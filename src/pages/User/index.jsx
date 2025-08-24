import useTitle from "@/hooks/useTitle";
import { useUserStore } from "@/store/login";
import HeaderCard from "./components/HeaderCard";
import StatRow from "./components/StatRow";
import BlastCenter from "./components/BlastCenter";
import MenuList from "./components/MenuList";

const BRAND_COLOR = "#f04a31";

const User = () => {
  useTitle("我的");
  const user = useUserStore((s) => s.user);

  const displayName = user?.username || "Tony";

  const handlePointsClick = () => {
    // 可跳转积分页
    // navigate('/points')
  };

  const handleBlastClick = (key) => {
    // 根据实际路由对接
    // switch (key) { case 'report': ... }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] pb-4">
      {/* 顶部头像与积分 */}
      <HeaderCard displayName={displayName} onPointsClick={handlePointsClick} />

      {/* 统计 */}
      <StatRow footprints={32} favorites={4} coins={0} points={0} />

      {/* 爆料中心 */}
      <BlastCenter onItemClick={handleBlastClick} />

      {/* 菜单分组一 */}
      <MenuList
        items={[
          { icon: "🕵️", label: "赏金猎人" },
          { icon: "📰", label: "好价订阅" },
          { icon: "💬", label: "社区讨论" },
          { icon: "🧾", label: "购买记录", rightExtra: "购后防降价" },
        ]}
      />

      {/* 菜单分组二 */}
      <MenuList
        items={[
          { icon: "❓", label: "帮助反馈" },
          { icon: "🛎️", label: "在线客服" },
          { icon: "↗️", label: "分享慢买", rightExtra: "邀好友避坑，每邀1人得60积分" },
        ]}
      />

      {/* 菜单分组三 */}
      <MenuList
        items={[
          { icon: "⚙️", label: "系统设置" },
        ]}
      />

      <div className="h-6" />
    </div>
  );
};

export default User;