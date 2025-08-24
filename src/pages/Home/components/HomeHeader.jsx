import SearchBox from '@/components/SearchBox';
import {Qr} from "@react-vant/icons";

/**
 * HomeHeader
 * - 首页头部区域：左侧品牌与副标题，右侧扫码图标 + “领红包”按钮
 * - 下方嵌入搜索框 SearchBox（组件已搭建，仅样式调整过）
 */
const HomeHeader = () => {
  return (
    <div>
      {/* 顶部：标题区 + 动作按钮 */}
      <div className="flex justify-between items-center mb-2">
        {/* 标题与副标题 */}
        <div className="text-xl font-bold text-red-500">
          货三家{' '}
          <span className="text-sm font-normal text-gray-500">
            中立的导购平台
          </span>
        </div>

        {/* 扫码图标 + 领红包 */}
        <div className="flex items-center space-x-2">
            <Qr />
          <button className="bg-red-500 text-white text-sm px-4 py-1 rounded-full">
            领红包
          </button>
        </div>
      </div>

      {/* 搜索框 */}
      <SearchBox />
    </div>
  )
}

export default HomeHeader