import { useState } from "react";
import useTitle from "@/hooks/useTitle";
import HomeHeader from "./components/HomeHeader";
import QuickActions from "./components/QuickActions";
import PlatformTabs from "./components/PlatformTabs";
import CategoryChips from "./components/CategoryChips";
import ProductCard from "./components/ProductCard";

const platformItems = [
  { key: "douyin", label: "抖音商城" },
  { key: "pdd", label: "拼多多" },
  { key: "jd", label: "京东" },
  { key: "tb", label: "淘宝" },
  { key: "tmall", label: "天猫" },
  { key: "kuaishou", label: "快手商城" },
];

const categoryItems = [
  { key: "pc", label: "电脑" },
  { key: "phone", label: "手机" },
  { key: "appliance", label: "家电" },
  { key: "clothes", label: "服饰" },
  { key: "beauty", label: "美妆" },
  { key: "sports", label: "运动" },
  { key: "home", label: "居家" },
];

const demoProducts = [
  {
    id: "p1",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_zRzeIZvSHo2VbM4VMMhKR8t3tHRR6MKHgdfgpZc9r24kQNPVCr1F0afUpomGEVffMEFkbG73dmwaTWHn08xKwAupHzK_tv5ER7dYlIQfaxv2TCRytV0zUPyYimhk4ZQ9EsBOntiabMAX6yOapLjXimNNhSfqOo0_OEszgrFOC1OySlNudV0vMT4RvDNy56nyUj8Bamnr5EX5yXuHwuu-FlP1Iq9UHUror8Jo_C4N0DpCa981IUWuGd2aIGP-ZlCXIZqpUcsbfg4",
    badge: { text: "低于双11", color: "bg-red-500" },
    title:
      "一加 平板Pro 平板电脑 高通第三代骁龙 8 12.1英寸 8GB+128GB 深空灰",
    subtitle: "慢慢买补贴1.4元",
    price: { amount: "1751.85元" },
    meta: { source: "京东自营", time: "22:03" },
    stats: { comments: 0, likes: 29 },
  },
  {
    id: "p2",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEKcedclE3jqFohF6mZx7zKeSDqCZwxiLjX0rI5mOPK8adxPb4oFgG6Ft1XJ3HNdf4nYzfC4e7TS0t1k7s2pMioIKGDbsFFs-M9TLo7FHMxUsjQURXQNqq98brfU51BbUK2HdT798cOimQHOoGyHvl7AVOdXgJE6SKuDXmkRCFP_Q1Du-Rc0rjUypMUQ2l1iKgVu95IIEJ8OXHFXj9uvU9aNXTmPqSWw8RA62HJpwQsLh9uhvU8fjZUnLIrC5zln0b1XEvB05vScQ",
    badge: { text: "历史新低", color: "bg-blue-500" },
    title: "iQOO Neo10 Pro+ 手机 超级像素 12+256G",
    tag: { text: "政府补贴", bg: "bg-yellow-100", textColor: "text-yellow-700" },
    price: { amount: "2116.65元", note: "(需领券,晒图...)" },
    meta: { source: "京东商城", time: "10:39" },
    stats: { comments: 2, likes: 549 },
  },
];

const Home = () => {
  useTitle("首页");

  const [activePlatform, setActivePlatform] = useState(platformItems[0].key);
  const [activeCategory, setActiveCategory] = useState(categoryItems[0].key);

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen pb-16">
      <header className="p-3 bg-white">
        <HomeHeader />
      </header>

      <section className="bg-white p-3">
        <QuickActions />
      </section>

      <main className="bg-gray-100 p-3">
        <PlatformTabs
          items={platformItems}
          active={activePlatform}
          onChange={setActivePlatform}
          onMenuClick={() => {}}
        />

        <CategoryChips
          items={categoryItems}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {demoProducts.map((p) => (
          <ProductCard
            key={p.id}
            cover={p.cover}
            badge={p.badge}
            title={p.title}
            subtitle={p.subtitle}
            tag={p.tag}
            price={p.price}
            meta={p.meta}
            stats={p.stats}
          />
        ))}
      </main>
    </div>
  );
};

export default Home;