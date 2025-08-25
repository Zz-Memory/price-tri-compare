import { ArrowLeft } from "@react-vant/icons";

const THEME = "#f04a31";

export default function SearchBar({ keyword = "", onChange, onSubmit, onBack }) {
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
      <form onSubmit={onSubmit} className="relative flex-1">
        <input
          type="text"
          value={keyword}
          onChange={(e) => onChange && onChange(e.target.value)}
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
    </div>
  );
}