import { useRef, useState, useEffect } from "react";
import useTitle from "@/hooks/useTitle";
import { CHAT_WORKFLOW_URL, CHAT_WORKFLOW_ID } from "@/constants/coze";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";

const AIAssistant = () => {
  useTitle("AI助手");

  const patToken = import.meta.env.VITE_PAT_TOKEN;


  const [messages, setMessages] = useState([
    { role: "assistant", content: "你好，我是你的货三家购物助手～" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const inputRef = useRef(null);
  const aiIndexRef = useRef(-1);
  const listRef = useRef(null);
  const selectedAnswerRef = useRef(null);
  const lastAnswersRef = useRef({ a1: "", a2: "", a3: "" });
  const bottomRef = useRef(null);

  // 慢速流式渲染：缓冲与节流定时器
  const renderBufferRef = useRef([]); // 增量分片缓冲
  const renderTimerRef = useRef(null);
  const RENDER_CHUNK_MS = 120; // 渲染间隔（毫秒），数值越大越慢
  const CHUNK_MODE = "char"; // "char" | "word" | "sentence"
  const MAX_CHUNK_SIZE = 3; // char 模式下单次输出字符数

  // 将文本 delta 推入缓冲区，等待慢速渲染
  const pushToRenderBuffer = (delta) => {
    if (!delta) return;
    let parts = [];
    if (CHUNK_MODE === "sentence") {
      parts = delta.split(/(?<=[。！？!?])/);
    } else if (CHUNK_MODE === "word") {
      parts = delta.split(/(\s+)/).filter(Boolean);
    } else {
      const chars = Array.from(delta);
      for (let i = 0; i < chars.length; i += MAX_CHUNK_SIZE) {
        parts.push(chars.slice(i, i + MAX_CHUNK_SIZE).join(""));
      }
    }
    renderBufferRef.current.push(...parts);
    if (!renderTimerRef.current) {
      renderTimerRef.current = setInterval(() => {
        const idx = aiIndexRef.current;
        if (idx < 0) return;
        const piece = renderBufferRef.current.shift();
        if (piece) {
          setMessages((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], content: (next[idx].content || "") + piece };
            return next;
          });
        } else {
          clearInterval(renderTimerRef.current);
          renderTimerRef.current = null;
        }
      }, RENDER_CHUNK_MS);
    }
  };

  // 立即把剩余缓冲刷到消息中（在结束/报错/卸载时调用）
  const flushRenderBuffer = () => {
    if (renderTimerRef.current) {
      clearInterval(renderTimerRef.current);
      renderTimerRef.current = null;
    }
    const idx = aiIndexRef.current;
    if (idx >= 0 && renderBufferRef.current.length) {
      const rest = renderBufferRef.current.join("");
      renderBufferRef.current = [];
      setMessages((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], content: (next[idx].content || "") + rest };
        return next;
      });
    }
  };

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ block: "end" });
      } else {
        el.scrollTop = el.scrollHeight;
      }
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const onResize = () => scrollToBottom();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      // 组件卸载时清理并尝试刷掉缓冲
      try { flushRenderBuffer(); } catch {}
    };
  }, []);

  const appendMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    if (!patToken || !CHAT_WORKFLOW_ID) {
      setErrMsg("环境变量缺失：请在 .env 中配置 VITE_PAT_TOKEN 或在常量中配置CHAT_WORKFLOW_ID，并重启服务。");
      return;
    }

    setErrMsg("");
    // 同时入列“用户消息 + 空的助手消息”，并记录助手消息下标
    setMessages((prev) => {
      const next = [...prev, { role: "user", content: text }, { role: "assistant", content: "" }];
      aiIndexRef.current = next.length - 1;
      return next;
    });
    setInput("");
    setLoading(true);

    // 重置本轮的目标答案键，确保仅显示本轮有内容的 answerX
    selectedAnswerRef.current = null;
    lastAnswersRef.current = { a1: "", a2: "", a3: "" };

    try {
      const parameters = { input: text }; // 如果工作流入参不是 input，请改这里
      const res = await fetch(CHAT_WORKFLOW_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${patToken}`,
          "Content-Type": "application/json",
          Accept: "text/event-stream, application/json",
        },
        body: JSON.stringify({ workflow_id: CHAT_WORKFLOW_ID, parameters }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${t}`);
      }

      const contentType = res.headers.get("content-type") || "";
      // SSE 流式解析
      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let acc = "";
        console.log("开始接收SSE流...", contentType);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // 规范化 CRLF
          buffer = buffer.replace(/\r\n/g, "\n");

          let sepIndex;
          // 以空行分隔事件
          while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
            const rawEvent = buffer.slice(0, sepIndex).trim();
            buffer = buffer.slice(sepIndex + 2);

            if (!rawEvent) continue;
            let eventName = "message";
            const dataLines = [];
            // 按行拆分
            for (const line of rawEvent.split("\n")) {
              if (line.startsWith("event:")) eventName = line.slice(6).trim();
              else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
            }
            const dataStr = dataLines.join("\n");
            if (!dataStr) continue;
            if (dataStr === "[DONE]") continue;

            try {
              const obj = JSON.parse(dataStr);

              // 解析候选名称（如果事件里标注了输出变量名）
              const rawName = (obj?.name || obj?.data?.name || obj?.key || obj?.data?.key || "").toString();
              const name = rawName.toLowerCase();

              // 解析 delta 文本（流式增量）——兼容字符串或 {content:""} 结构
              const asStr = (v) => (typeof v === "string" ? v : "");
              const fromDelta = (d) =>
                typeof d === "string"
                  ? d
                  : d && typeof d === "object"
                  ? asStr(d.content)
                  : "";
              const deltaText =
                fromDelta(obj?.delta) ||
                fromDelta(obj?.data?.delta) ||
                asStr(obj?.data?.content) ||
                asStr(obj?.content) ||
                asStr(obj?.text) ||
                asStr(obj?.data?.answer) ||
                asStr(obj?.answer) ||
                "";

              // 尝试从输出结构中拿到 answer1/2/3（有些事件可能携带完整/部分内容）
              let outObj = obj?.output ?? obj?.data?.output ?? null;
              if (typeof outObj === "string") {
                try { outObj = JSON.parse(outObj); } catch { outObj = null; }
              }
              const pick = (src, k) => (src && typeof src === "object" && typeof src[k] === "string" ? src[k] : "");
              const a1 =
                pick(obj, "answer1") || pick(obj?.data, "answer1") || pick(outObj, "answer1");
              const a2 =
                pick(obj, "answer2") || pick(obj?.data, "answer2") || pick(outObj, "answer2");
              const a3 =
                pick(obj, "answer3") || pick(obj?.data, "answer3") || pick(outObj, "answer3");

              // 记录流中出现过的候选答案，便于流结束时兜底
              if ((a1 && a1.trim()) || (a2 && a2.trim()) || (a3 && a3.trim())) {
                const prev = lastAnswersRef.current || {};
                lastAnswersRef.current = {
                  a1: a1?.trim() ? a1 : prev.a1 || "",
                  a2: a2?.trim() ? a2 : prev.a2 || "",
                  a3: a3?.trim() ? a3 : prev.a3 || "",
                };
              }

              // 首次锁定有效答案键：优先从事件名判断，其次从出现的非空 answerX 判断
              if (!selectedAnswerRef.current) {
                if (["answer1", "answer2", "answer3"].includes(name)) {
                  selectedAnswerRef.current = name;
                } else if (a1?.trim()) {
                  selectedAnswerRef.current = "answer1";
                } else if (a2?.trim()) {
                  selectedAnswerRef.current = "answer2";
                } else if (a3?.trim()) {
                  selectedAnswerRef.current = "answer3";
                }
              }

              // 只显示三个回答里非空的那个：优先取 answer1/2/3 中第一个非空
              const display = [a1, a2, a3].find(v => typeof v === "string" && v.trim());
              if (display !== undefined) {
                const idx = aiIndexRef.current;
                if (idx >= 0) {
                  setMessages((prev) => {
                    const next = [...prev];
                    next[idx] = { ...next[idx], content: "" };
                    return next;
                  });
                  pushToRenderBuffer(display.trim());
                }
              } else if (deltaText) {
                // 没有 answer 快照时，优先尝试把增量解析为 {answer1/2/3}，只显示非空的那个；否则再当普通文本追加
                let picked = null;
                try {
                  const maybe = JSON.parse(deltaText);
                  if (typeof maybe === "string") {
                    try {
                      const maybe2 = JSON.parse(maybe);
                      if (maybe2 && typeof maybe2 === "object") {
                        const arr = [maybe2.answer1, maybe2.answer2, maybe2.answer3];
                        picked = arr.find(v => typeof v === "string" && v.trim());
                      }
                    } catch {}
                  } else if (maybe && typeof maybe === "object") {
                    const arr = [maybe.answer1, maybe.answer2, maybe.answer3];
                    picked = arr.find(v => typeof v === "string" && v.trim());
                  }
                } catch {}
                const idx = aiIndexRef.current;
                if (idx >= 0) {
                  if (picked) {
                    setMessages((prev) => {
                      const next = [...prev];
                      next[idx] = { ...next[idx], content: "" };
                      return next;
                    });
                    pushToRenderBuffer(picked.trim());
                  } else {
                    pushToRenderBuffer(deltaText);
                  }
                }
              }
            } catch {
              // 若不是 JSON，当作纯文本增量
              if (dataStr && dataStr !== "[DONE]") {
                acc += dataStr;
                const idx = aiIndexRef.current;
                if (idx >= 0) {
                  pushToRenderBuffer(dataStr);
                }
              }
            }
          }
        }
        // 流结束后，如未累积任何文本，则回退到最后一个非空的 answerX
        if (!acc.trim()) {
          const { a1, a2, a3 } = lastAnswersRef.current || {};
          const fallback = [a1, a2, a3].find(v => typeof v === "string" && v.trim());
          if (fallback) {
            pushToRenderBuffer(fallback.trim());
          }
        }
      } else {
        // 兼容非流式响应（服务端没返回 SSE 时）
        const ret = await res.json().catch(() => null);
        if (!ret) throw new Error("无法解析响应");
        if (ret.code !== 0) {
          setErrMsg(ret.msg || "调用失败");
          return;
        }
        let reply = "";
        try {
          const data = typeof ret.data === "string" ? JSON.parse(ret.data) : ret.data;
          const output = typeof data?.output === "string" ? JSON.parse(data.output) : (data?.output || data);
          const candidates = [
            output?.answer1,
            output?.answer2,
            output?.answer3,
            data?.answer1,
            data?.answer2,
            data?.answer3,
          ];
          reply =
            candidates.find(v => typeof v === "string" && v.trim()) ||
            data?.answer ||
            data?.text ||
            (typeof data === "object" ? JSON.stringify(data) : String(data ?? ""));
        } catch {
          reply = ret?.data ?? "";
        }
        const idx = aiIndexRef.current;
        if (idx >= 0) {
          setMessages((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], content: "" };
            return next;
          });
          pushToRenderBuffer(String(reply || "").trim() || "（空响应）");
        }
      }
    } catch (e) {
      setErrMsg(e.message || "请求异常");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 720,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        position: "relative",
        "--tabbar-h": "50px",
      }}
    >
      <MessageList
        messages={messages}
        loading={loading}
        listRef={listRef}
        bottomRef={bottomRef}
      />

      {errMsg && (
        <div style={{ color: "crimson", marginBottom: 8 }}>{errMsg}</div>
      )}

      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        loading={loading}
        onKeyDown={onKeyDown}
        inputRef={inputRef}
        onFocusScroll={scrollToBottom}
      />
    </div>
  );
};

export default AIAssistant;