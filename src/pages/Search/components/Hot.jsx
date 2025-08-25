/**
 * 热门发现组件
 * props:
 * - items: string[] 热门关键词
 * - onClickItem: (kw: string) => void 点击某个热门词
 */
export default function Hot({ items = [], onClickItem, onShuffle }) {
  return (
    <section className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">热门发现</h3>
        <button
          type="button"
          onClick={onShuffle}
          className="text-xs text-[#f04a31] hover:underline"
        >
          换一批
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((kw) => (
          <button
            key={kw}
            type="button"
            onClick={() => onClickItem && onClickItem(kw)}
            className="rounded-full px-3 py-1.5 text-sm border text-[#f04a31] bg-[#f04a31]/5 border-[#f04a31] hover:bg-[#f04a31]/10"
            title={kw}
          >
            {kw}
          </button>
        ))}
      </div>
    </section>
  );
}