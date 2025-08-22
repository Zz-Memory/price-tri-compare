/**
 * 分类 Chips（受控组件）
 * 用途：在平台标签下方展示可横向滚动的分类选项
 *
 * Props:
 * - items: { key: string; label: string }[]  分类列表
 * - active: string                            当前选中分类 key
 * - onChange: (key: string) => void          选中切换回调
 *
 * 视觉：
 * - 选中项：红底浅色（红文案）+ 加粗
 * - 未选中：灰底
 */
const defaultCats = [
  { key: 'pc', label: '电脑' },
  { key: 'phone', label: '手机' },
  { key: 'appliance', label: '家电' },
  { key: 'clothes', label: '服饰' },
  { key: 'beauty', label: '美妆' },
  { key: 'sports', label: '运动' },
  { key: 'home', label: '居家' },
];

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