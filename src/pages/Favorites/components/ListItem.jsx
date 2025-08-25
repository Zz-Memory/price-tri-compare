import { Link } from "react-router-dom";
import { CommentCircleO, ThumbCircleO } from "@react-vant/icons";

/**
 * 收藏列表单项
 * - 非管理态：整行可点击，进入详情
 * - 管理态：显示复选框与“取消收藏”按钮
 */
const ListItem = ({
  item = {},
  manage = false,
  checked = false,
  onCheckChange, // (id, nextChecked)
  onRemove, // (id)
}) => {
  const priceStr = item.priceText ? item.priceText : (item.currentPrice ? `${item.currentPrice}元` : "");
  const content = (
    <div className="px-3 py-3 bg-white">
      <div className="flex items-start">
        {manage ? (
          <label className="mr-2 mt-1">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onCheckChange?.(item.id, e.target.checked)}
            />
          </label>
        ) : null}

        {/* 封面 */}
        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          {item.cover ? (
            <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
          ) : null}
        </div>

        {/* 文案 */}
        <div className="flex-1 ml-3">
          <h3 className="text-[15px] text-gray-900 leading-5">
            {item.title || "未知商品"}
          </h3>
          {priceStr ? (
            <div className="text-orange-500 text-[15px] mt-1">{priceStr}</div>
          ) : null}

          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <span>
              {item?.meta?.source} | {item?.meta?.time}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gray-400"><CommentCircleO /></span>
              <span>{item?.stats?.comments ?? 0}</span>
              <span className="text-gray-400"><ThumbCircleO /></span>
              <span>{item?.stats?.likes ?? 0}</span>
            </span>
          </div>
        </div>

        {manage ? (
          <button
            type="button"
            onClick={() => onRemove?.(item.id)}
            className="ml-2 text-xs text-red-500 active:text-red-600"
          >
            取消
          </button>
        ) : null}
      </div>
    </div>
  );

  if (manage) {
    return content;
  }

  // 非管理态：整行可点击进入详情
  return (
    <Link
      to={`/product/${item.id}`}
      state={{ item }}
      className="block"
    >
      {content}
    </Link>
  );
};

export default ListItem;