/**
 * 商品卡片组件
 * props:
 * - cover: string 图片
 * - badge?: { text: string, color?: string } // color 为 Tailwind 背景色类名
 * - title: string
 * - subtitle?: string // 如“慢慢买补贴1.4元”或标签
 * - tag?: { text: string, bg?: string, textColor?: string } // 可选角标/标记（如“政府补贴”）
 * - price: { amount: string, note?: string } // note 如 "(需领券...)" 灰字
 * - meta: { source: string, time: string }
 * - stats: { comments: number|string, likes: number|string }
 * - closable?: boolean
 */
const ProductCard = ({
  cover,
  badge,
  title,
  subtitle,
  tag,
  price,
  meta,
  stats,
  closable = true,
}) => {
  return (
    <div className="bg-white rounded-lg p-3 mb-3">
      <div className="flex items-start">
        <div className="relative mr-3">
          <img alt={title} className="w-28 h-28 object-cover rounded-lg" src={cover} />
          {badge?.text && (
            <span
              className={`absolute top-0 left-0 text-white text-xs px-2 py-0.5 rounded-tl-lg rounded-br-lg ${
                badge.color || 'bg-red-500'
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold leading-tight">{title}</h3>
            {closable && <button className="text-gray-400 text-xl leading-none">×</button>}
          </div>

          {subtitle && <p className="text-xs text-gray-500 my-1">{subtitle}</p>}
          {tag?.text && (
            <span
              className={`inline-block text-xs px-2 py-0.5 rounded my-1 ${
                tag.bg || 'bg-yellow-100'
              } ${tag.textColor || 'text-yellow-700'}`}
            >
              {tag.text}
            </span>
          )}

          <p className="text-red-500 text-xl font-bold">
            {price?.amount}
            {price?.note && (
              <span className="text-sm font-normal text-gray-500">{price.note}</span>
            )}
          </p>

          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <span>
              {meta?.source} | {meta?.time}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
                </svg>
              </span>
              <span>{stats?.comments ?? 0}</span>
              <span className="text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3 9 9 0 0 0-9 9"></path>
                  <path d="M9 22V12h12v5a5 5 0 0 1-5 5z"></path>
                </svg>
              </span>
              <span>{stats?.likes ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;