/**
 * ProductCard 商品卡片（展示组件）
 * - 负责渲染封面、角标、标题/副标题、标签、价格、来源时间、互动数据（评论/点赞）
 * - 无业务逻辑与跳转，父组件可在外层包裹 Link 或绑定点击事件
 *
 * Props
 * - cover: string                         封面图 URL
 * - badge?: { text: string; color?: string }
 *     - 左上角角标（如“历史新低”），color 为 Tailwind 背景色类名（默认 bg-red-500）
 * - title: string                         标题文案
 * - subtitle?: string                     副标题（如“补贴 X 元”“红包立减”等）
 * - tag?: { text: string; bg?: string; textColor?: string }
 *     - 标签（如“政府补贴”），默认样式为 bg-yellow-100 + text-yellow-700
 * - price: { amount: string; note?: string }
 *     - 展示用价格字符串（例如 “2116.65元”），note 为灰色补充说明（例如 “(需领券...)”）
 * - meta: { source: string; time: string }
 *     - 底部来源与时间，例如 “京东自营 | 22:03”
 * - stats: { comments: number|string; likes: number|string }
 *     - 互动数据
 * - closable?: boolean                    是否显示右上角关闭按钮（默认 true）
 *
 * 使用示例
 * <ProductCard
 *   cover="https://xx/cover.png"
 *   badge={{ text: '历史新低', color: 'bg-blue-500' }}
 *   title="iQOO Neo10 Pro+ 手机 12+256G"
 *   subtitle="平台津贴叠加"
 *   tag={{ text: '政府补贴', bg: 'bg-yellow-100', textColor: 'text-yellow-700' }}
 *   price={{ amount: '2116.65元', note: '(需领券,晒图...)' }}
 *   meta={{ source: '京东商城', time: '10:39' }}
 *   stats={{ comments: 2, likes: 549 }}
 * />
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
        {/* 左侧：封面图 + 左上角角标 */}
        <div className="relative mr-3">
          {/* 封面图尺寸与页面样式匹配：w-28 h-28 => 112x112 */}
          <img alt={title} className="w-28 h-28 object-cover rounded-lg" src={cover} />
          {/* 角标：左上角，斜切圆角（左上 / 右下） */}
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

        {/* 右侧：信息区 */}
        <div className="flex-1">
          {/* 标题 + 右上角关闭按钮（可选） */}
          <div className="flex justify-between items-start">
            {/* 标题采用紧凑行高，避免两行间距过大 */}
            <h3 className="text-base font-semibold leading-tight">{title}</h3>
            {closable && (
              <button
                className="text-gray-400 text-xl leading-none"
                aria-label="close-card"
                type="button"
              >
                ×
              </button>
            )}
          </div>

          {/* 副标题（如补贴信息），可选 */}
          {subtitle && <p className="text-xs text-gray-500 my-1">{subtitle}</p>}

          {/* 标签（如“政府补贴”），可选；采用柔和底色 + 对应文字色 */}
          {tag?.text && (
            <span
              className={`inline-block text-xs px-2 py-0.5 rounded my-1 ${
                tag.bg || 'bg-yellow-100'
              } ${tag.textColor || 'text-yellow-700'}`}
            >
              {tag.text}
            </span>
          )}

          {/* 价格区：主价红色加粗，补充说明为灰色小号 */}
          <p className="text-red-500 text-xl font-bold">
            {price?.amount}
            {price?.note && (
              <span className="text-sm font-normal text-gray-500">{price.note}</span>
            )}
          </p>

          {/* 底部元信息与互动数据（评论/点赞） */}
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            {/* 来源与时间 */}
            <span>
              {meta?.source} | {meta?.time}
            </span>

            {/* 互动数据（图标 + 数字） */}
            <div className="flex items-center space-x-2">
              {/* 评论图标（纯 SVG，无依赖） */}
              <span className="text-gray-400" aria-label="comments">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
                </svg>
              </span>
              <span>{stats?.comments ?? 0}</span>

              {/* 点赞图标 */}
              <span className="text-gray-400" aria-label="likes">
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