import { Button } from 'react-vant';

const BRAND_COLOR = '#f04a31';

export default function HeaderCard({ displayName = '用户', onPointsClick }) {
  return (
    <div className="px-4 pt-4">
      <div
        className="rounded-2xl p-4 shadow-sm"
        style={{ background: 'linear-gradient(180deg, #fff4f1 0%, #ffffff 100%)' }}
      >
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl mr-3">
            😊
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold">{displayName}</div>
            <div className="text-xs text-gray-500 mt-0.5">0 个勋章 · 个人主页</div>
          </div>

          <div className="relative inline-block">
            <Button
              size="small"
              round
              style={{ background: BRAND_COLOR, borderColor: BRAND_COLOR, color: '#fff' }}
              onClick={onPointsClick}
            >
              领积分
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}