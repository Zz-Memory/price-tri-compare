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
              className={`relative text-sm px-2 py-1 ${active ? "" : "text-gray-700"}`}
              style={active ? { color: "#f04a31" } : undefined}
            >
              {it.label}
              {active ? (
                <span
                  className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-10 h-0.5 rounded-full"
                  style={{ backgroundColor: "#f04a31" }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;