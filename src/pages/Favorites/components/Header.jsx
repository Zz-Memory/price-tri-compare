import { ArrowLeft } from "@react-vant/icons";

const Header = ({ title = "我的收藏", manage = false, onBack, onToggleManage }) => {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
      <div className="h-12 px-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100"
          aria-label="返回"
        >
          <span className="text-xl leading-none"><ArrowLeft /></span>
        </button>
        <div className="text-base text-gray-900">{title}</div>
        <button
          type="button"
          onClick={onToggleManage}
          className="text-sm text-gray-700"
        >
          {manage ? "完成" : "管理"}
        </button>
      </div>
    </header>
  );
};

export default Header;