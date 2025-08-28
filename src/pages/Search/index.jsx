import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HOT_SEARCHES } from "@/constants/search";
import History from "./components/History";
import Hot from "./components/Hot";
import SearchBar from "./components/SearchBar";
import Toast from "./components/Toast";
import { THEME_COLOR } from "@/constants/theme";

const THEME = THEME_COLOR;
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

// 从热门池中随机抽取一批（默认8条）
function getRandomHot(pool = HOT_SEARCHES, count = 8) {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(count, arr.length));
}

export default function Search() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialQuery = params.get("q") || "";
  const [keyword, setKeyword] = useState(initialQuery);
  const [history, setHistory] = useState(() => readHistory());
  const [hotItems, setHotItems] = useState(() => getRandomHot());

  // 轻量 Toast 控制
  const [toast, setToast] = useState({ open: false, message: "" });
  const toastTimerRef = useRef(null);
  const showToast = (message) => {
    setToast({ open: true, message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast({ open: false, message: "" });
    }, 1600);
  };

  const saveHistory = (list) => {
    setHistory(list);
    localStorage.setItem(HIST_KEY, JSON.stringify(list));
  };

  const addToHistory = (q) => {
    const kw = (q || "").trim();
    if (!kw) return;
    const next = [kw, ...history.filter((x) => x !== kw)].slice(0, 20);
    saveHistory(next);
  };

  const handleDeleteItem = (kw) => {
    saveHistory(history.filter((x) => x !== kw));
  };

  const handleClearAll = () => {
    saveHistory([]);
  };

  const handleSearchKeyword = (kw) => {
    setKeyword(kw);
    addToHistory(kw);
    navigate(`/search/result?q=${encodeURIComponent(kw)}`);
  };

  useEffect(() => {
    if (initialQuery) {
      // 初始化时带 q 参数，直接跳结果页并写入历史
      handleSearchKeyword(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const q = (keyword || "").trim();
    if (!q) {
      showToast("请输入关键词");
      return;
    }
    addToHistory(q);
    navigate(`/search/result?q=${encodeURIComponent(q)}`);
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white p-3 border-b border-gray-100">
        <SearchBar
          keyword={keyword}
          onChange={setKeyword}
          onSubmit={onSubmit}
          onBack={goBack}
        />
      </header>

      <main className="p-4 space-y-4">
        <History
          items={history}
          onClickItem={handleSearchKeyword}
          onDeleteItem={handleDeleteItem}
          onClear={handleClearAll}
        />
        <Hot
          items={hotItems}
          onClickItem={handleSearchKeyword}
          onShuffle={() => setHotItems(getRandomHot())}
        />
      </main>

      <Toast open={toast.open} message={toast.message} />
    </div>
  );
}