const actions = [
  { label: '查历史价', color: 'bg-red-100 text-red-500', badge: '避坑', badgeColor: 'bg-red-500', icon: '⏱️' },
  { label: '好价热榜', color: 'bg-purple-100 text-purple-500', icon: '⭐' },
  { label: '羊毛好券', color: 'bg-red-100 text-red-500', icon: '🐑' },
  { label: '餐饮外卖', color: 'bg-blue-100 text-blue-500', badge: '天天领', badgeColor: 'bg-red-500', icon: '🍔' },
  { label: '蹲个好价', color: 'bg-yellow-100 text-yellow-500', icon: '👛' },
];

const QuickActions = () => {
  return (
    <div className="flex justify-around text-center text-xs text-gray-700">
      {actions.map((it) => (
        <div key={it.label} className="relative">
          <div className={`w-12 h-12 ${it.color} rounded-full flex items-center justify-center`}>
            <span className="text-lg leading-none">{it.icon}</span>
          </div>
          {it.badge && (
            <span className={`absolute -top-1 -right-2 ${it.badgeColor} text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white`}>
              {it.badge}
            </span>
          )}
          <p className="mt-1">{it.label}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;