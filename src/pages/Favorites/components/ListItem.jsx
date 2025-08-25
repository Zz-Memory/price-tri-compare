import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { CommentCircleO, ThumbCircleO } from "@react-vant/icons";

/**
 * 收藏列表单项
 * - 统一根节点为 div，避免在管理态/非管理态切换时根节点类型变化引发 DOM 提交冲突
 * - 非管理态：点击整行进入详情
 * - 管理态：显示复选框与“取消收藏”按钮
 */
const ListItem = ({
  item = {},
  manage = false,
  checked = false,
  onCheckChange, // (id, nextChecked)
  onRemove, // (id)
}) => {
  const navigate = useNavigate();
  const priceStr = item.priceText ? item.priceText : (item.currentPrice ? `${item.currentPrice}元` : "");

  const handleOpen = () => {
    if (manage) return;
    if (!item?.id) return;
    navigate(`/product/${item.id}`, { state: { item } });
  };

  return (
    <div
      className="px-3 py-3 bg-white"
      onClick={handleOpen}
      role={!manage ? "button" : undefined}
      tabIndex={!manage ? 0 : undefined}
    >
      <div className="flex items-start">
        {/* 左侧：管理态为复选框；非管理态用占位保证对齐 */}
        {manage ? (
          <label
            className="mr-2 mt-1"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onCheckChange?.(item.id, e.target.checked)}
              style={{ accentColor: "#f04a31" }}
            />
          </label>
        ) : (
          <div className="mr-2 mt-1" style={{ width: 16 }} />
        )}

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
            <div className="text-[15px] mt-1" style={{ color: "#f04a31" }}>{priceStr}</div>
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

        {/* 右侧：管理态显示“取消”按钮；非管理态用占位保证对齐 */}
        {manage ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove?.(item.id); }}
            className="ml-2 text-xs"
            style={{ color: "#f04a31" }}
          >
            取消
          </button>
        ) : (
          <div className="ml-2 text-xs" style={{ width: 24 }} />
        )}
      </div>
    </div>
  );
};

export default memo(ListItem);
