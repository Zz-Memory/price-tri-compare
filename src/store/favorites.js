import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * 收藏 Store（按用户分桶）
 * - byUser: { [userKey: string]: Product[] }
 * - 方法均需传入 userKey，保证每个用户只操作自己的收藏
 */
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      byUser: {},

      // 每个用户的收藏数覆盖：{ [userKey]: { [id]: number } }
      favCountsByUser: {},

      // 获取指定用户列表（工具方法，可在组件选择器中使用 s.byUser[userKey] || [] 代替）
      getList: (userKey) => {
        const key = userKey ?? "guest";
        return get().byUser[key] || [];
      },

      // 获取/设置收藏数（按用户+文章维度持久化）
      getFavCount: (userKey, id) => {
        const key = userKey ?? "guest";
        if (id == null) return undefined;
        const map = get().favCountsByUser[key] || {};
        return map[id];
      },
      setFavCount: (userKey, id, count) =>
        set((state) => {
          const key = userKey ?? "guest";
          if (id == null) return state;
          const prev = state.favCountsByUser[key] || {};
          return {
            favCountsByUser: {
              ...state.favCountsByUser,
              [key]: { ...prev, [id]: Math.max(0, Number(count) || 0) },
            },
          };
        }),

      add: (item, userKey) =>
        set((state) => {
          const key = userKey ?? "guest";
          if (!item || item.id == null) return state;
          const list = state.byUser[key] || [];
          if (list.some((it) => it.id === item.id)) return state;
          return { byUser: { ...state.byUser, [key]: [item, ...list] } };
        }),

      removeById: (id, userKey) =>
        set((state) => {
          const key = userKey ?? "guest";
          const list = state.byUser[key] || [];
          return { byUser: { ...state.byUser, [key]: list.filter((it) => it.id !== id) } };
        }),

      toggle: (item, userKey) =>
        set((state) => {
          const key = userKey ?? "guest";
          if (!item || item.id == null) return state;
          const list = state.byUser[key] || [];
          const exists = list.some((it) => it.id === item.id);
          const next = exists ? list.filter((it) => it.id !== item.id) : [item, ...list];
          return { byUser: { ...state.byUser, [key]: next } };
        }),

      removeBatch: (ids = [], userKey) =>
        set((state) => {
          const key = userKey ?? "guest";
          const list = state.byUser[key] || [];
          const setIds = new Set(ids);
          return { byUser: { ...state.byUser, [key]: list.filter((it) => !setIds.has(it.id)) } };
        }),

      clearUser: (userKey) =>
        set((state) => {
          const key = userKey ?? "guest";
          return { byUser: { ...state.byUser, [key]: [] } };
        }),
    }),
    {
      name: "ptc_favorites_by_user",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ byUser: state.byUser, favCountsByUser: state.favCountsByUser }),
    }
  )
);