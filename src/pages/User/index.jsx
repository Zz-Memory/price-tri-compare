import useTitle from "@/hooks/useTitle";
import { useUserStore } from "@/store/login";
import { useFavoritesStore } from "@/store/favorites";
import HeaderCard from "./components/HeaderCard";
import StatRow from "./components/StatRow";
import BlastCenter from "./components/BlastCenter";
import MenuList from "./components/MenuList";
import {
  SettingO,
  ShareO,
  ServiceO,
  NotesO,
  Records,
  Aim, 
  HotO, 
  FriendsO,
  Revoke,
} from "@react-vant/icons"
import { Dialog } from "react-vant";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const BRAND_COLOR = "#f04a31";

const User = () => {
  useTitle("我的");
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();
  const userKey = user?.id ?? user?.username ?? "guest";
  const favoritesCount = useFavoritesStore((s) => (s.byUser?.[userKey]?.length) || 0);
  const loginOut = useUserStore((s) => s.loginOut);
  const [showLogout, setShowLogout] = useState(false);
  const onLogoutClick = () => setShowLogout(true);

  const displayName = user?.username || "Tony";

  const handlePointsClick = () => {
    // 可跳转积分页
    // navigate('/points')
  };

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const handleBlastClick = (key) => {
    // 根据实际路由对接
    // switch (key) { case 'report': ... }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] overflow-y-auto" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 96px)' }}>
      {/* 顶部头像与积分 */}
      <HeaderCard displayName={displayName} onPointsClick={handlePointsClick} />

      {/* 统计 */}
      <StatRow
        footprints={user?.footprints ?? 0}
        favorites={favoritesCount}
        coins={user?.coins ?? 0}
        points={user?.points ?? 0}
        onFavoritesClick={handleFavoritesClick}
      />

      {/* 爆料中心 */}
      <BlastCenter onItemClick={handleBlastClick} />

      {/* 菜单分组一 */}
      <MenuList
        items={[
          { icon: <Aim  />, label: "赏金猎人" },
          { icon: <HotO  />, label: "好价订阅" },
          { icon: <FriendsO  />, label: "社区讨论" },
          { icon: <Records  />, label: "购买记录", rightExtra: "购后防降价" },
        ]}
      />

      {/* 菜单分组二 */}
      <MenuList
        items={[
          { icon: <NotesO />, label: "帮助反馈" },
          { icon: <ServiceO />, label: "在线客服" },
          { icon: <ShareO />, label: "分享货三家", rightExtra: "邀好友避坑，每邀1人得60积分" },
        ]}
      />

      {/* 菜单分组三 */}
      <MenuList
        items={[
          { icon: <SettingO />, label: "系统设置" },
          {
            icon: <Revoke />,
            label: "退出登录",
            onClick: onLogoutClick,
          },
        ]}
      />
      <Dialog
        visible={showLogout}
        title="确认操作"
        showCancelButton
        onConfirm={() => {
          setShowLogout(false);
          loginOut();
          navigate("/login");
        }}
        onCancel={() => setShowLogout(false)}
        onClose={() => setShowLogout(false)}
      >
        <div className="text-center">确认退出登录？</div>
      </Dialog>
    </div>
  );
};

export default User;