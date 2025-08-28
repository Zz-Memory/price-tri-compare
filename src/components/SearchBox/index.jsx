import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEARCH_HINTS } from "@/constants/search";
import { THEME_COLOR } from "@/constants/theme";

const SearchBox = () => {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // 每 3s 随机切换占位词（避免与当前相同）
    timerRef.current = setInterval(() => {
      setIdx((prev) => {
        let next = Math.floor(Math.random() * SEARCH_HINTS.length);
        if (next === prev) next = (prev + 1) % SEARCH_HINTS.length;
        return next;
      });
    }, 3000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, []);

  const placeholder = SEARCH_HINTS[idx];

  const goSearchOnly = () => {
    navigate("/search");
  };

  const goSearchWithHint = () => {
    navigate(`/search?q=${encodeURIComponent(placeholder)}`);
  };

  return (
    <div className="relative">
      <input
        type="text"
        name="search"
        id="search"
        placeholder={placeholder}
        className="w-full pl-9 pr-24 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2"
        style={{ "--tw-ring-color": THEME_COLOR, caretColor: THEME_COLOR }}
        onClick={goSearchOnly}
        readOnly
      />
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
        </svg>
      </span>
      <button
        type="button"
        className="absolute right-1 top-1/2 -translate-y-1/2 text-white px-5 py-1.5 rounded-full text-sm"
        style={{ backgroundColor: THEME_COLOR, color: '#fff' }}
        onClick={goSearchWithHint}
      >
        搜索
      </button>
    </div>
  );
};

export default SearchBox;