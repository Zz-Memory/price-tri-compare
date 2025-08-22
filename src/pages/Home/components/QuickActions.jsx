/**
 * QuickActions
 * - 首页顶部的 5 个圆形快捷入口
 * - 这里使用 emoji 作为占位图标，后续可替换为自定义 SVG 或图标库
 * - 可按需增加/减少条目，或接入服务端返回的数据
 */

// 单项结构：{ label: string; color: string; badge?: string; badgeColor?: string; icon: string }
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
          {/* 圆形图标容器 */}
          <div className={`w-12 h-12 ${it.color} rounded-full flex items-center justify-center`}>
            <span className="text-lg leading-none">{it.icon}</span>
          </div>

          {/* 右上角小角标（可选） */}
          {it.badge && (
            <span
              className={`absolute -top-1 -right-2 ${it.badgeColor} text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white`}
            >
              {it.badge}
            </span>
          )}

          {/* 文案 */}
          <p className="mt-1">{it.label}</p>
        </div>
      ))}
    </div>
  )
}

export default QuickActions