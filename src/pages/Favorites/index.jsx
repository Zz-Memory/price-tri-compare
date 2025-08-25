import { useMemo, useState } from "react";
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

const Favorites = () => {
  useTitle("收藏");
  const navigate = useNavigate();

  const items = useFavoritesStore((s) => s.items) || [];
  const removeById = useFavoritesStore((s) => s.removeById);
  const removeBatch = useFavoritesStore((s) => s.removeBatch);
  const decFavorites = useUserStore((s) => s.decFavorites);

  // UI 状态
  const [mainTab, setMainTab] = useState("deal"); // all | deal | post
  const [subTab, setSubTab] = useState("discount"); // discount | alert | expired
  const [manage, setManage] = useState(false);
  const [query, setQuery] = useState("");

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
    removeById(id);
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
    removeBatch(ids);
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
      <SearchBox value={query} onChange={setQuery} placeholder="搜索折扣爆料" />
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

      {!manage && (
        <div className="py-6 text-center text-xs text-gray-400">
          -- 展示近一年收藏爆料，左滑可取消收藏 --
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