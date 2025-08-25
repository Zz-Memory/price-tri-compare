const Tabs = ({ value = "deal", onChange }) => {
  const items = [
    { key: "all", label: "全网商品" },
    { key: "deal", label: "折扣爆料" },
    { key: "post", label: "社区帖子" },
  ];
  return (
    <div className="bg-white">
      <div className="px-3 flex items-center justify-around h-11">
        {items.map((it) => {
          const active = value === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange?.(it.key)}
              className={`relative text-sm px-2 py-1 ${active ? "text-orange-500" : "text-gray-700"}`}
            >
              {it.label}
              {active ? (
                <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-10 h-0.5 bg-orange-500 rounded-full" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;