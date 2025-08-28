import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "@react-vant/icons";
import { useNavigate } from "react-router-dom";
import { fetchSearchSuggestions } from "@/services/search";
import { debounce } from "@/utils/debounce";
import { THEME_COLOR } from "@/constants/theme";

const HIST_KEY = "ptc_search_history";

function readHistory() {
  try {
    const raw = localStorage.getItem(HIST_KEY);
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return [];
  }
}
function writeHistory(list) {
  localStorage.setItem(HIST_KEY, JSON.stringify(list));
}
function addToHistory(kw) {
  const key = (kw || "").trim();
  if (!key) return;
  const prev = readHistory();
  const next = [key, ...prev.filter((x) => x !== key)].slice(0, 20);
  writeHistory(next);
}

/**
 * SearchBar
 * props:
 * - keyword: string
 * - onChange: (val: string) => void
 * - onSubmit: (e: FormEvent) => void
 * - onBack: () => void
 * - onPickKeyword?: (kw: string) => void  // 选中联想词回调（优先调用）
 */
export default function SearchBar({ keyword = "", onChange, onSubmit, onBack, onPickKeyword }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [suggests, setSuggests] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchSuggestsDebouncedRef = useRef(null);
  const blurTimerRef = useRef(null);

  // 输入变更后 300ms 防抖请求联想词
  useEffect(() => {
    if (!fetchSuggestsDebouncedRef.current) {
      fetchSuggestsDebouncedRef.current = debounce(async (q) => {
        setLoading(true);
        try {
          const list = await fetchSearchSuggestions(q);
          setSuggests(list);
          setOpen(list.length > 0);
        } finally {
          setLoading(false);
        }
      }, 300);
    }
    const q = (keyword || "").trim();
    if (!q) {
      setSuggests([]);
      setOpen(false);
      fetchSuggestsDebouncedRef.current?.cancel?.();
      return;
    }
    fetchSuggestsDebouncedRef.current(q);
  }, [keyword]);

  useEffect(() => {
    return () => {
      fetchSuggestsDebouncedRef.current?.cancel?.();
    };
  }, []);

  const handlePick = (kw) => {
    setOpen(false);
    if (onPickKeyword) {
      onPickKeyword(kw);
      return;
    }
    // 兼容：父未提供 onPickKeyword 时，组件内处理跳转与历史
    addToHistory(kw);
    navigate(`/search/result?q=${encodeURIComponent(kw)}`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onBack}
        className="shrink-0 w-9 h-9 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
        aria-label="返回"
      >
        <ArrowLeft />
      </button>

      <div className="relative flex-1">
        <form
          onSubmit={onSubmit}
          className="relative"
          onFocus={() => {
            if ((keyword || "").trim() && suggests.length) setOpen(true);
          }}
          onBlur={() => {
            // 延迟关闭，确保点击建议项能触发
            blurTimerRef.current = setTimeout(() => setOpen(false), 120);
          }}
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder="输入商品名称、型号或关键词"
            className="w-full pl-9 pr-24 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": THEME_COLOR, caretColor: THEME_COLOR }}
            onFocus={() => {
              if (suggests.length) setOpen(true);
            }}
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
            style={{ backgroundColor: THEME_COLOR }}
          >
            搜索
          </button>
        </form>

        {/* 下拉联想词 */}
        {open && (
          <div
            className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-lg shadow"
            onMouseDown={(e) => {
              // 防止触发 form 的 blur 关闭
              e.preventDefault();
              if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
            }}
          >
            {loading && (
              <div className="px-3 py-2 text-xs text-gray-400">加载中…</div>
            )}
            {!loading && suggests.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-400">无相关建议</div>
            )}
            {!loading &&
              suggests.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => handlePick(s)}
                >
                  {s}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}