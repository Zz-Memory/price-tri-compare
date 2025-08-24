const BRAND_COLOR = '#f04a31';

function Item({ icon, text, onClick }) {
  return (
    <button
      className="flex flex-col items-center justify-center w-1/4 py-2 active:bg-gray-50 rounded-lg"
      onClick={onClick}
    >
      <div className="text-xl" aria-hidden>{icon}</div>
      <div className="text-xs mt-1 text-gray-700">{text}</div>
    </button>
  );
}

export default function BlastCenter({ onItemClick }) {
  return (
    <div className="px-4 mt-3">
      <div className="rounded-2xl p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm font-medium">
            <span className="mr-1">🏆</span> 爆料中心
          </div>
          <div className="text-xs text-gray-500">我的等级 {'>'}</div>
        </div>

        <div className="mt-3 flex">
          <Item icon="📝" text="我要爆料" onClick={() => onItemClick?.('report')} />
          <Item icon="📄" text="我的爆料" onClick={() => onItemClick?.('myReports')} />
          <Item icon="📊" text="数据中心" onClick={() => onItemClick?.('data')} />
          <Item icon="📘" text="爆料指南" onClick={() => onItemClick?.('guide')} />
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl p-3" style={{ background: '#fff4e9' }}>
          <div className="text-xs">
            <div className="font-medium text-gray-800">限时任务：老司机爆料征集</div>
            <div className="text-gray-500 mt-0.5">查看更多活动 {'>'}</div>
          </div>
          <button
            className="px-3 py-1 rounded-full text-white text-xs"
            style={{ background: BRAND_COLOR }}
            onClick={() => onItemClick?.('task')}
          >
            去看看
          </button>
        </div>
      </div>
    </div>
  );
}