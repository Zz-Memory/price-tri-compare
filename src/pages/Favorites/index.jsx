import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTitle from "@/hooks/useTitle";
import { useFavoritesStore } from "@/store/favorites";
import { useUserStore } from "@/store/login";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import SearchBox from "./components/SearchBox";
import SubTabs from "./components/SubTabs";
import ListItem from "./components/ListItem";
import ManageBar from "./components/ManageBar";
import { debounce } from "@/utils/debounce";

const EMPTY = Object.freeze([]);

const Favorites = () => {
  useTitle("收藏");
  const navigate = useNavigate();

  // 当前用户 key（优先 id，其次 username；未登录 -> guest）
  const user = useUserStore((s) => s.user);
  const userKey = user?.id ?? user?.username ?? "guest";

  // 仅读取当前用户的收藏
  const byUser = useFavoritesStore((s) => s.byUser);
  const items = byUser?.[userKey] ?? EMPTY;
  const removeById = useFavoritesStore((s) => s.removeById);
  const removeBatch = useFavoritesStore((s) => s.removeBatch);
  const decFavorites = useUserStore((s) => s.decFavorites);

  // UI 状态
  const [mainTab, setMainTab] = useState("deal"); // all | deal | post
  const [subTab, setSubTab] = useState("discount"); // discount | alert | expired
  const [manage, setManage] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedSetQuery = useMemo(() => debounce(setQuery, 300), [setQuery]);
  useEffect(() => {
    return () => debouncedSetQuery.cancel?.();
  }, [debouncedSetQuery]);

  // 选择集合（仅管理态使用）
  const [selected, setSelected] = useState(() => new Set());

  // 过滤后的列表（当前仅“折扣爆料/折扣”展示）
  const filtered = useMemo(() => {
    let list = items;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((it) => (it.title || "").toLowerCase().includes(q));
    }
    if (mainTab !== "deal") return [];
    if (subTab !== "discount") return [];
    return list;
  }, [items, query, mainTab, subTab]);

  const filteredIds = useMemo(() => filtered.map((it) => it.id), [filtered]);
  const isAllSelected = useMemo(() => {
    return manage && filtered.length > 0 && filteredIds.every((id) => selected.has(id));
  }, [manage, filtered.length, filteredIds, selected]);

  const handleToggleManage = () => {
    setManage((m) => !m);
    setSelected(new Set());
  };

  const handleCheckChange = (id, checked) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelected((prev) => {
      if (isAllSelected) return new Set();
      return new Set(filteredIds);
    });
  };

  const handleRemoveSingle = (id) => {
    removeById(id, userKey);
    decFavorites(1);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleBatchRemove = () => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    removeBatch(ids, userKey);
    decFavorites(ids.length);
    setSelected(new Set());
  };

  const empty = filtered.length === 0;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 pb-20">
      <Header
        title="我的收藏"
        manage={manage}
        onBack={() => navigate(-1)}
        onToggleManage={handleToggleManage}
      />
      <Tabs value={mainTab} onChange={setMainTab} />
      <SearchBox value={query} onChange={debouncedSetQuery} placeholder="搜索折扣爆料" />
      <SubTabs value={subTab} onChange={setSubTab} />

      {empty ? (
        <div className="py-20 text-center text-gray-400">暂无收藏</div>
      ) : (
        <div className="divide-y">
          {filtered.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              manage={manage}
              checked={selected.has(item.id)}
              onCheckChange={handleCheckChange}
              onRemove={handleRemoveSingle}
            />
          ))}
        </div>
      )}


      {manage && (
        <ManageBar
          total={filtered.length}
          selectedCount={selected.size}
          isAllSelected={isAllSelected}
          onToggleAll={handleToggleAll}
          onBatchRemove={handleBatchRemove}
        />
      )}
    </div>
  );
};

export default Favorites;