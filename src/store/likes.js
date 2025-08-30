import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * 点赞 Store（按用户分桶）
 * - likedByUser: { [userKey: string]: { [id: string]: true } }
 * - 提供 has/toggle/add/remove 等方法
 */
export const useLikesStore = create(
  persist(
    (set, get) => ({
      likedByUser: {},

      // 是否已点赞
      has: (userKey, id) => {
        const key = userKey ?? "guest";
        if (id == null) return false;
        const map = get().likedByUser[key] || {};
        return !!map[id];
      },

      // 点赞
      add: (id, userKey) =>
        set((state) => {
          const key = userKey ?? "guest";
          if (id == null) return state;
          const prev = state.likedByUser[key] || {};
          if (prev[id]) return state;
          return {
            likedByUser: {
              ...state.likedByUser,
              [key]: { ...prev, [id]: true },
            },
          };
        }),

      // 取消点赞
      remove: (id, userKey) =>
        set((state) => {
          const key = userKey ?? "guest";
          if (id == null) return state;
          const prev = state.likedByUser[key] || {};
          if (!prev[id]) return state;
          const next = { ...prev };
          delete next[id];
          return {
            likedByUser: {
              ...state.likedByUser,
              [key]: next,
            },
          };
        }),

      // 切换点赞
      toggle: (id, userKey) =>
        set((state) => {
          const key = userKey ?? "guest";
          if (id == null) return state;
          const prev = state.likedByUser[key] || {};
          const exists = !!prev[id];
          const next = { ...prev };
          if (exists) delete next[id];
          else next[id] = true;
          return {
            likedByUser: {
              ...state.likedByUser,
              [key]: next,
            },
          };
        }),

      // 批量移除
      removeBatch: (ids = [], userKey) =>
        set((state) => {
          const key = userKey ?? "guest";
          const prev = state.likedByUser[key] || {};
          if (!ids?.length) return state;
          const next = { ...prev };
          ids.forEach((id) => {
            if (id != null) delete next[id];
          });
          return {
            likedByUser: {
              ...state.likedByUser,
              [key]: next,
            },
          };
        }),

      // 清空某用户点赞记录
      clearUser: (userKey) =>
        set((state) => {
          const key = userKey ?? "guest";
          return {
            likedByUser: {
              ...state.likedByUser,
              [key]: {},
            },
          };
        }),
    }),
    {
      name: "ptc_likes_by_user",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ likedByUser: state.likedByUser }),
    }
  )
);