import { useNavigate } from 'react-router-dom';
import { THEME_COLOR } from '@/constants/theme';
import { hexToRgba } from '@/utils/color';

const THEME = THEME_COLOR;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-4 px-6 text-center bg-white">
      <div className="text-[84px] font-extrabold tracking-wider leading-none" style={{ color: THEME_COLOR, filter: `drop-shadow(0 4px 16px ${hexToRgba(THEME_COLOR, 0.25)})` }}>
        404
      </div>
      <div className="text-2xl font-bold text-gray-900">页面走丢了</div>
      <p className="max-w-[560px] text-sm text-gray-600">
        您访问的页面不存在，可能是错误的路由导航或链接已过期。
      </p>

      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: THEME, boxShadow: '0 6px 16px rgba(240,74,49,0.35)' }}
        >
          返回首页
        </button>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border"
          style={{ borderColor: THEME, color: THEME, backgroundColor: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hexToRgba(THEME, 0.05); }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          返回上一页
        </button>
      </div>
    </div>
  );
}