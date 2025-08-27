const Tabs = ({ value = "deal", onChange, manage = false, onToggleManage }) => {
  const items = [
    { key: "deal", label: "折扣爆料" },
    { key: "post", label: "社区帖子" },
  ];
  return (
    <div className="bg-white">
      <div className="relative px-3 h-12 flex items-center">
        {/* 居中 Tabs */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          {items.map((it) => {
            const active = value === it.key;
            return (
              <button
                key={it.key}
                type="button"
                onClick={() => onChange?.(it.key)}
                className={`relative text-[16px] px-2 py-1 ${active ? "" : "text-gray-800"}`}
                style={active ? { color: "#f04a31" } : undefined}
              >
                {it.label}
                {active ? (
                  <span
                    className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-12 h-0.5 rounded-full"
                    style={{ backgroundColor: "#f04a31" }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* 右侧管理按钮 */}
        <button
          type="button"
          onClick={onToggleManage}
          className="ml-auto text-sm px-3 py-1 rounded-full border"
          style={{
            color: "#f04a31",
            borderColor: "#f04a31",
            backgroundColor: manage ? "#fff0ed" : "#ffffff",
          }}
        >
          {manage ? "完成" : "管理"}
        </button>
      </div>
    </div>
  );
};

export default Tabs;