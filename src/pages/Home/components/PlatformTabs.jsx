/**
 * 平台标签（受控组件）
 * 用途：在首页顶部展示多个平台入口，支持选中态高亮与切换回调
 *
 * Props:
 * - items: { key: string; label: string }[]  平台列表
 * - active: string                            当前选中平台 key
 * - onChange: (key: string) => void          切换回调
 * - onMenuClick?: () => void                 右侧“更多/菜单”按钮回调（可选）
 *
 * 视觉：
 * - 选中项：文字变红加粗，底部出现 2px 红色下划线
 * - 未选中项：灰色文字
 */
const defaultItems = [
  { key: 'douyin', label: '抖音商城' },
  { key: 'pdd', label: '拼多多' },
  { key: 'jd', label: '京东' },
  { key: 'tb', label: '淘宝' },
  { key: 'tmall', label: '天猫' },
  { key: 'kuaishou', label: '快手商城' },
];

const MenuIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const PlatformTabs = ({ items = defaultItems, active = items[0]?.key, onChange = () => {}, onMenuClick }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      {/* 左侧平台项 */}
      <div className="flex items-center space-x-4 text-sm">
        {items.map((it) => {
          const isActive = it.key === active;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(it.key)}
              className={`relative pb-1 focus:outline-none ${
                isActive ? 'text-red-500 font-bold' : 'text-gray-500'
              }`}
            >
              <span>{it.label}</span>
              {/* 选中态下划线 */}
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-red-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 右侧菜单按钮（预留） */}
      <button type="button" onClick={onMenuClick} className="text-gray-500">
        <MenuIcon />
      </button>
    </div>
  );
};

export default PlatformTabs;