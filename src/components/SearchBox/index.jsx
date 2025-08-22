const SearchBox = () => {
  return (
    <div className="relative">
      <input
        type="text"
        name="search"
        id="search"
        placeholder="iPhone 16 全网比价"
        className="w-full pl-9 pr-24 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
        </svg>
      </span>
      <button
        type="button"
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-500 text-white px-5 py-1.5 rounded-full text-sm"
      >
        搜索
      </button>
    </div>
  )
};

export default SearchBox;
