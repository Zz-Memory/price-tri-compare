/**
 * 搜索历史组件
 * props:
 * - items: string[] 历史关键词
 * - onClickItem: (kw: string) => void 点击某个历史词
 * - onDeleteItem: (kw: string) => void 删除某个历史词
 * - onClear: () => void 清空全部
 */
export default function History({ items = [], onClickItem, onDeleteItem, onClear }) {
  return (
    <section className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">搜索历史</h3>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            清空
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-gray-400">暂无历史</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((kw) => (
            <div
              key={kw}
              className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full px-3 py-1.5 text-sm"
              role="button"
              onClick={() => onClickItem && onClickItem(kw)}
            >
              <span className="truncate max-w-[12rem]">{kw}</span>
              <button
                type="button"
                aria-label="删除"
                className="ml-1 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem && onDeleteItem(kw);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}