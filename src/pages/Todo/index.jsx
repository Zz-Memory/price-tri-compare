import { useNavigate } from 'react-router-dom';

const THEME = '#f04a31';

export default function Todo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 px-6 text-center bg-white">
      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wider text-[#f04a31] border"
        style={{ borderColor: THEME }}
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
          style={{ backgroundColor: THEME, boxShadow: '0 6px 16px rgba(240,74,49,0.35)' }}
        >
          返回首页
        </button>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border text-[#f04a31] hover:bg-[#f04a31]/5"
          style={{ borderColor: THEME }}
        >
          返回上一页
        </button>
      </div>
    </div>
  );
}