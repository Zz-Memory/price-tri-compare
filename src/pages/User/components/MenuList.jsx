export default function MenuList({ items = [] }) {
  return (
    <div className="px-4 mt-3">
      <div className="bg-white rounded-2xl shadow-sm">
        {items.map((it, idx) => (
          <button
            key={idx}
            className="w-full flex items-center justify-between px-4 py-3 active:bg-gray-50"
            onClick={it.onClick}
          >
            <div className="flex items-center gap-2">
              {it.icon ? <span className="text-lg" aria-hidden>{it.icon}</span> : null}
              <span className="text-sm text-gray-800">{it.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {it.rightExtra ? (
                <span className="text-xs text-gray-400">{it.rightExtra}</span>
              ) : null}
              <span className="text-gray-300">{'>'}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}