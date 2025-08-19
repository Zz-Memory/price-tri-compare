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
        const currentPath = location.pathname;
        const index = tabs.findIndex(tab => currentPath.startsWith(tab.path));
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
        <div>
            <div>
                <Outlet />
            </div>
            <Tabbar value={activeTab} onChange={handleTabChange} fixed>
                {tabs.map((tab, index) => (
                    <Tabbar.Item key={index} icon={tab.icon}>
                        {tab.title}
                    </Tabbar.Item>
                ))}
            </Tabbar>
        </div>
    )
}

export default MainLayout;
