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

/**
 * 平台标签组件
 * props:
 * - items: {key,label}[]
 * - active: string
 * - onChange: (key)=>void
 * - onMenuClick?: ()=>void
 */
const PlatformTabs = ({ items = defaultItems, active = items[0]?.key, onChange = () => {}, onMenuClick }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center space-x-4 text-sm">
        {items.map((it) => {
          const isActive = it.key === active;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(it.key)}
              className={`${isActive ? 'text-red-500 font-bold' : 'text-gray-500'} focus:outline-none`}
            >
              {it.label}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={onMenuClick} className="text-gray-500">
        <MenuIcon />
      </button>
    </div>
  );
};

export default PlatformTabs;