import { create } from "zustand";
import { doLogin, getUser } from "@/services/login";

export const useUserStore = create((set) => ({
  user: null, // 用户信息
  isLogin: false, // 是否登录
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
  loginOut: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      isLogin: false,
    });
  },
  clearUser: () => {
    set({ user: null, isLogin: false });
  },
}));
