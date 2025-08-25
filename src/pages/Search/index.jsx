import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const THEME = "#f04a31";

export default function Search() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialQuery = params.get("q") || "";
  const [keyword, setKeyword] = useState(initialQuery);
  const [status, setStatus] = useState(initialQuery ? "searching" : "idle");

  const doSearch = (q) => {
    const query = (q ?? keyword).trim();
    if (!query) return;
    setStatus("searching");
    // TODO: 接入真实搜索接口
    setTimeout(() => setStatus("done"), 400);
  };

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`, { replace: true });
    doSearch(q);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white p-3 border-b border-gray-100">
        <form onSubmit={onSubmit} className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="输入商品名称、型号或关键词"
            className="w-full pl-9 pr-24 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": THEME, caretColor: THEME }}
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
            </svg>
          </span>
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-white px-5 py-1.5 rounded-full text-sm"
            style={{ backgroundColor: THEME }}
          >
            搜索
          </button>
        </form>
      </header>

      <main className="p-4">
        {status === "idle" && <p className="text-sm text-gray-500">输入关键词开始搜索</p>}
        {status === "searching" && (
          <p className="text-sm text-gray-500">
            正在搜索：<span className="font-medium text-gray-900">{keyword}</span> …
          </p>
        )}
        {status === "done" && (
          <div>
            <p className="text-sm text-gray-500 mb-2">
              已根据关键词“<span className="font-medium text-gray-900">{keyword}</span>”展示结果（示意）
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