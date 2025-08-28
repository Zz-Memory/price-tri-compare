import { THEME_COLOR } from '@/constants/theme';
const SubTabs = ({ value = "discount", onChange }) => {
  const items = [
    { key: "discount", label: "折扣" },
    { key: "alert", label: "折扣提醒" },
    { key: "expired", label: "已失效" },
  ];
  return (
    <div className="bg-white">
      <div className="px-3 flex items-center gap-6 h-10">
        {items.map((it) => {
          const active = value === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange?.(it.key)}
              className={`relative text-sm ${active ? "" : "text-gray-700"}`}
              style={active ? { color: THEME_COLOR } : undefined}
            >
              {it.label}
              {active ? (
                <span
                  className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: THEME_COLOR }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubTabs;