import { create } from "zustand";
import { doLogin, getUser } from "@/services/login";

export const useUserStore = create((set, get) => ({
  user: null, // 用户信息
  isLogin: false, // 是否登录

  // 登录：成功后直接将 data 写入全局 user，并保存 token
  login: async ({ username = "", password = "" }) => {
    const res = await doLogin({ username, password });
    const { code, msg, token, data: user } = res.data;
    if (code === 200 && token) {
      localStorage.setItem("token", token);
      set({
        user,
        isLogin: true,
      });
      return { success: true, msg };
    } else {
      localStorage.removeItem("token");
      set({
        user: null,
        isLogin: false,
      });
      return { success: false, msg: msg || "登录失败" };
    }
  },

  // 刷新/启动恢复登录态
  hydrate: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false };
    }
    try {
      const res = await getUser();
      const { code, data } = res.data || {};
      if (code === 0 && data) {
        set({ user: data, isLogin: true });
        return { success: true };
      }
    } catch (e) {}
    localStorage.removeItem("token");
    set({ user: null, isLogin: false });
    return { success: false };
  },

  // 退出登录
  loginOut: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      isLogin: false,
    });
  },

  // 清空用户（调试/异常处理）
  clearUser: () => {
    set({ user: null, isLogin: false });
  },

  // 直接设置/合并用户信息（便于统一更新）
  setUser: (user) => {
    set({ user, isLogin: !!user });
  },
  patchUser: (partial = {}) => {
    const curr = get().user;
    if (!curr) return;
    set({ user: { ...curr, ...partial } });
  },

  // 业务计数更新：收藏、足迹、金币、积分
  incFavorites: (n = 1) => {
    const curr = get().user;
    if (!curr) return;
    const next = Math.max(0, (curr.favorites || 0) + n);
    set({ user: { ...curr, favorites: next } });
  },
  decFavorites: (n = 1) => {
    const curr = get().user;
    if (!curr) return;
    const next = Math.max(0, (curr.favorites || 0) - n);
    set({ user: { ...curr, favorites: next } });
  },
  incFootprints: (n = 1) => {
    const curr = get().user;
    if (!curr) return;
    const next = Math.max(0, (curr.footprints || 0) + n);
    set({ user: { ...curr, footprints: next } });
  },
  addCoins: (n = 1) => {
    const curr = get().user;
    if (!curr) return;
    const next = Math.max(0, (curr.coins || 0) + n);
    set({ user: { ...curr, coins: next } });
  },
  spendCoins: (n = 1) => {
    const curr = get().user;
    if (!curr) return;
    const next = Math.max(0, (curr.coins || 0) - n);
    set({ user: { ...curr, coins: next } });
  },
  addPoints: (n = 1) => {
    const curr = get().user;
    if (!curr) return;
    const next = Math.max(0, (curr.points || 0) + n);
    set({ user: { ...curr, points: next } });
  },
}));