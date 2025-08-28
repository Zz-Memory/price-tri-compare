import {
    Outlet,
    useLocation,
    useNavigate
} from 'react-router-dom'
import { Tabbar } from 'react-vant'
import {
    HomeO,
    FireO,
    ChatO,
    StarO,
    UserO
} from '@react-vant/icons'
import { useEffect, useState } from 'react'
import { THEME_COLOR } from '@/constants/theme'

// 底部导航栏数据
const tabs = [
    {icon: <HomeO />, title: '首页', path: "/home"},
    {icon: <FireO />, title: '省钱攻略', path: '/tips'},
    {icon: <ChatO />, title: 'AI助手', path: '/assistant'},
    {icon: <StarO />, title: '收藏', path: '/favorites'},
    {icon: <UserO />, title: '我的', path: '/user'}
]

const MainLayout = () => {
    // 获取当前路径信息
    const location = useLocation();
    // 获取路由跳转方法
    const navigate = useNavigate();
    // 声明标签活跃状态
    const [activeTab, setActiveTab] = useState(0);

    // 根据当前路径设置活动标签
    useEffect(() => {
        // 获取当前路径
        const currentPath = location.pathname;
        // 找到第一个匹配的tab
        const index = tabs.findIndex(tab => currentPath.startsWith(tab.path));
        // 如果找到则激活该标签
        if (index !== -1) {
            setActiveTab(index);
        }
    }, [location.pathname]);

    // 处理标签切换
    const handleTabChange = (index) => {
        setActiveTab(index);
        navigate(tabs[index].path);
    };

    return(
        <>
            <div>
                <Outlet />
            </div>
            <Tabbar activeColor={THEME_COLOR} value={activeTab} onChange={handleTabChange} fixed>
                {tabs.map((tab, index) => (
                    <Tabbar.Item key={index} icon={tab.icon}>
                        {tab.title}
                    </Tabbar.Item>
                ))}
            </Tabbar>
        </>
    )
}

export default MainLayout;
