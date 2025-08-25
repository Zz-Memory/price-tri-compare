const ManageBar = ({
  total = 0,
  selectedCount = 0,
  isAllSelected = false,
  onToggleAll,
  onBatchRemove,
}) => {
  if (total === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onToggleAll}
          className="text-sm text-gray-700"
        >
          {isAllSelected ? "取消全选" : "全选"}
        </button>

        <button
          type="button"
          onClick={onBatchRemove}
          disabled={selectedCount === 0}
          className={`text-sm px-3 py-1 rounded ${
            selectedCount === 0
              ? "bg-gray-200 text-gray-400"
              : "bg-red-500 text-white active:bg-red-600"
          }`}
        >
          取消收藏{selectedCount > 0 ? `(${selectedCount})` : ""}
        </button>
      </div>
    </div>
  );
};

export default ManageBar;