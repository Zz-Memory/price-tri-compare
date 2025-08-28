import { useNavigate } from 'react-router-dom';
import { THEME_COLOR } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';


export default function Todo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 px-6 text-center bg-white">
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wider border"
        style={{ borderColor: THEME_COLOR, color: THEME_COLOR }}
      >
        TODO
      </span>
      <h1 className="m-0 text-2xl font-bold text-gray-900">功能开发中</h1>
      <p className="m-0 max-w-[560px] text-sm text-gray-600">
        该页面/功能尚未实现，正在加紧开发中，敬请期待～
      </p>

      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: THEME_COLOR, boxShadow: `0 6px 16px ${hexToRgba(THEME_COLOR, 0.35)}` }}
        >
          返回首页
        </button>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border"
          style={{ borderColor: THEME_COLOR, color: THEME_COLOR, backgroundColor: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hexToRgba(THEME_COLOR, 0.05); }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          返回上一页
        </button>
      </div>
    </div>
  );
}