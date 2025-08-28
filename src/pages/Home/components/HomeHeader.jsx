import SearchBox from '@/components/SearchBox';
import {Qr} from "@react-vant/icons";
import { THEME_COLOR } from "@/constants/theme";

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
        <div className="text-xl font-bold" style={{ color: THEME_COLOR }}>
          货三家{' '}
          <span className="text-sm font-normal text-gray-500">
            中立的导购平台
          </span>
        </div>

        {/* 扫码图标 + 领红包 */}
        <div className="flex items-center space-x-2">
            <Qr style={{ color: THEME_COLOR }} />
          <button className="text-white text-sm px-4 py-1 rounded-full" style={{ backgroundColor: THEME_COLOR, color: '#fff' }}>
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