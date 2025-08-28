import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "@react-vant/icons";
import { THEME_COLOR } from "@/constants/theme";

const THEME = THEME_COLOR;

export default function SearchResult() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [status, setStatus] = useState(q ? "searching" : "idle");

  useEffect(() => {
    if (!q) return;
    setStatus("searching");
    // TODO: 接入真实搜索接口
    const t = setTimeout(() => setStatus("done"), 400);
    return () => clearTimeout(t);
  }, [q]);

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/search");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            className="shrink-0 w-9 h-9 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
            aria-label="返回"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-base font-semibold text-gray-900">搜索结果</h1>
        </div>
      </header>

      <main className="p-4">
        {!q && <p className="text-sm text-gray-500">未提供关键词</p>}
        {q && status === "searching" && (
          <p className="text-sm text-gray-500">
            正在搜索：<span className="font-medium text-gray-900">{q}</span> …
          </p>
        )}
        {q && status === "done" && (
          <div>
            <p className="text-sm text-gray-500 mb-2">
              已根据关键词“<span className="font-medium text-gray-900">{q}</span>”展示结果（示意）
            </p>
            <ul className="space-y-2">
              <li className="p-3 border border-gray-100 rounded-lg">示例结果 1</li>
              <li className="p-3 border border-gray-100 rounded-lg">示例结果 2</li>
              <li className="p-3 border border-gray-100 rounded-lg">示例结果 3</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}