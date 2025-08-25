import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * 收藏 Store
 * - items: 收藏的商品数组（完整商品对象，要求含 id）
 * - add(item): 添加收藏（去重）
 * - removeById(id): 按 id 取消收藏
 * - toggle(item): 切换收藏
 * - removeBatch(ids): 批量取消收藏
 * - clear(): 清空
 */
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((state) => {
          if (!item || item.id == null) return state;
          if (state.items.some((it) => it.id === item.id)) return state;
          return { items: [item, ...state.items] };
        }),

      removeById: (id) =>
        set((state) => ({
          items: state.items.filter((it) => it.id !== id),
        })),

      toggle: (item) =>
        set((state) => {
          if (!item || item.id == null) return state;
          const exists = state.items.some((it) => it.id === item.id);
          return {
            items: exists
              ? state.items.filter((it) => it.id !== item.id)
              : [item, ...state.items],
          };
        }),

      removeBatch: (ids = []) =>
        set((state) => {
          const setIds = new Set(ids);
          return { items: state.items.filter((it) => !setIds.has(it.id)) };
        }),

      clear: () => set({ items: [] }),
    }),
    {
      name: "ptc_favorites",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);