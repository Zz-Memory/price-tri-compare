export default function StatRow({
  footprints = 32,
  favorites = 4,
  coins = 0,
  points = 0,
}) {
  const Item = ({ num, label }) => (
    <div className="flex-1 text-center">
      <div className="text-lg font-semibold">{num}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
  return (
    <div className="px-4 mt-3">
      <div className="flex bg-white rounded-2xl py-3 shadow-sm">
        <Item num={footprints} label="足迹" />
        <Item num={favorites} label="收藏" />
        <Item num={coins} label="金币" />
        <Item num={points} label="积分" />
      </div>
    </div>
  );
}