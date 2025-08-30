import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { CommentCircleO, ThumbCircleO, ChatO, LikeO } from "@react-vant/icons";
import { SwipeCell, Button } from "react-vant";
import { THEME_COLOR } from "@/constants/theme";

/**
 * 收藏列表单项
 * - 根节点保持 div，避免管理态切换导致 DOM 冲突
 * - 使用 SwipeCell：左滑显示右侧“取消收藏”按钮；未滑动前按钮不可见
 * - 非管理态：点击整行进入详情
 * - 管理态：显示复选框（仍可左滑进行单项取消），支持底部批量操作
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
  const isPost = item.__type === "post";
  const comments = item?.stats?.comments ?? 0;
  const likes = item?.stats?.likes ?? 0;

  const handleOpen = () => {
    if (manage) return;
    if (!item?.id) return;
    if (item.__type === "post") {
      navigate(`/tips/${item.id}`, { state: { data: item._raw || item } });
    } else {
      navigate(`/product/${item.id}`, { state: { item } });
    }
  };

  const handleRemove = (e) => {
    e?.stopPropagation?.();
    onRemove?.(item.id);
  };

  return (
    <div className="relative fav-item rounded-lg shadow-sm overflow-hidden bg-white" style={{ isolation: 'isolate' }}>
      <SwipeCell
        className="bg-transparent overflow-hidden"
        style={{ width: "100%", contain: "layout paint" }}
        rightAction={
          <div style={{ height: "100%", width: 96, overflow: "hidden" }}>
            <Button
              square
              type="danger"
              className="h-full rounded-none"
              style={{ height: "100%", width: "100%", border: 0, boxShadow: "none" }}
              onClick={handleRemove}
            >
              取消收藏
            </Button>
          </div>
        }
      >
        <div
          className="px-3 py-3 bg-transparent w-full box-border"
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
                  style={{ accentColor: THEME_COLOR }}
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
                <div className="text-[15px] mt-1" style={{ color: THEME_COLOR }}>{priceStr}</div>
              ) : null}

              <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                <span>
                  {item?.meta?.source} | {item?.meta?.time}
                </span>
                <span className="flex items-center gap-2">
                  {isPost ? (
                    <>
                      <span className="text-gray-400"><ChatO /></span>
                      <span>{comments}</span>
                      <span className="text-gray-400"><LikeO /></span>
                      <span>{likes}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-400"><CommentCircleO /></span>
                      <span>{comments}</span>
                      <span className="text-gray-400"><ThumbCircleO /></span>
                      <span>{likes}</span>
                    </>
                  )}
                </span>
              </div>
            </div>

          </div>
        </div>
      </SwipeCell>
      <div aria-hidden className="pointer-events-none absolute top-0 bottom-0 bg-white z-50" style={{ width: 4, right: -1 }} />
      <style>{`
        .fav-item .rv-swipe-cell { overflow: hidden; }
        .fav-item .rv-swipe-cell__right { right: -2px; }
      `}</style>
    </div>
  );
};

export default memo(ListItem);