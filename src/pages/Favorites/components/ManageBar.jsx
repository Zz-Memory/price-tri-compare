import { THEME_COLOR } from '@/constants/theme';
const ManageBar = ({
  total = 0,
  selectedCount = 0,
  isAllSelected = false,
  onToggleAll,
  onBatchRemove,
}) => {
  const disableAll = total === 0;
  const disableBatch = selectedCount === 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onToggleAll}
          disabled={disableAll}
          className={`text-sm ${disableAll ? "text-gray-400" : "text-gray-700"}`}
        >
          {isAllSelected ? "取消全选" : "全选"}
        </button>

        <button
          type="button"
          onClick={() => {
            // 延后一帧执行，避免同步卸载与提交冲突
            requestAnimationFrame(() => onBatchRemove?.());
          }}
          disabled={disableBatch}
          className={`text-sm px-3 py-1 rounded ${disableBatch ? "bg-gray-200 text-gray-400" : "text-white"}`}
          style={!disableBatch ? { backgroundColor: THEME_COLOR } : undefined}
        >
          取消收藏{selectedCount > 0 ? `(${selectedCount})` : ""}
        </button>
      </div>
    </div>
  );
};

export default ManageBar;