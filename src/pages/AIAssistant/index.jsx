import { useRef, useState, useEffect } from "react";
import useTitle from "@/hooks/useTitle";
import { CHAT_WORKFLOW_URL, CHAT_WORKFLOW_ID } from "@/constants/coze";

const AIAssistant = () => {
  useTitle("AI助手");

  const patToken = import.meta.env.VITE_PAT_TOKEN;


  const [messages, setMessages] = useState([
    { role: "assistant", content: "你好，我是你的 Coze 工作流助手～" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const inputRef = useRef(null);
  const aiIndexRef = useRef(-1);
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages, loading]);

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
              const delta =
                obj?.delta ??
                obj?.data?.delta ??
                obj?.data?.content ??
                obj?.data?.answer ??
                obj?.content ??
                obj?.answer ??
                obj?.text ??
                obj?.data?.output ??
                obj?.output ??
                "";

              if (delta) {
                acc += String(delta);
                const idx = aiIndexRef.current;
                if (idx >= 0) {
                  setMessages((prev) => {
                    const next = [...prev];
                    next[idx] = { ...next[idx], content: acc };
                    return next;
                  });
                }
              }
            } catch {
              // 若不是 JSON，当作纯文本增量
              if (dataStr && dataStr !== "[DONE]") {
                acc += dataStr;
                const idx = aiIndexRef.current;
                if (idx >= 0) {
                  setMessages((prev) => {
                    const next = [...prev];
                    next[idx] = { ...next[idx], content: acc };
                    return next;
                  });
                }
              }
            }
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
          reply =
            data?.answer ??
            data?.text ??
            data?.output ??
            data?.result ??
            JSON.stringify(data);
        } catch {
          reply = ret?.data ?? "";
        }
        const idx = aiIndexRef.current;
        if (idx >= 0) {
          setMessages((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], content: String(reply || "").trim() || "（空响应）" };
            return next;
          });
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
    <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 12 }}>AI Assistant</h2>

      <div
        ref={listRef}
        style={{
          border: "1px solid #eee",
          borderRadius: 8,
          padding: 12,
          height: 420,
          overflowY: "auto",
          background: "#fafafa",
          marginBottom: 12,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "8px 10px",
                borderRadius: 8,
                whiteSpace: "pre-wrap",
                background: m.role === "user" ? "#1677ff" : "#fff",
                color: m.role === "user" ? "#fff" : "#333",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ color: "#999", fontSize: 12 }}>对方正在输入…</div>
        )}
      </div>

      {errMsg && (
        <div style={{ color: "crimson", marginBottom: 8 }}>{errMsg}</div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="请输入内容，回车发送（Shift+Enter 换行）"
          style={{
            flex: 1,
            resize: "none",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            minWidth: 88,
            border: "none",
            background: loading || !input.trim() ? "#ccc" : "#1677ff",
            color: "#fff",
            borderRadius: 6,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          }}
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;