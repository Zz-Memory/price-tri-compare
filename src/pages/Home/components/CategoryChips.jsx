const defaultCats = [
  { key: 'pc', label: '电脑' },
  { key: 'phone', label: '手机' },
  { key: 'appliance', label: '家电' },
  { key: 'clothes', label: '服饰' },
  { key: 'beauty', label: '美妆' },
  { key: 'sports', label: '运动' },
  { key: 'home', label: '居家' },
];

/**
 * 分类 Chips 组件
 * props:
 * - items: {key,label}[]
 * - active: string
 * - onChange: (key)=>void
 */
const CategoryChips = ({ items = defaultCats, active = items[0]?.key, onChange = () => {} }) => {
  return (
    <div className="flex space-x-2 text-sm mb-3 overflow-x-auto pb-2">
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              isActive ? 'bg-red-100 text-red-500 font-semibold' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryChips;