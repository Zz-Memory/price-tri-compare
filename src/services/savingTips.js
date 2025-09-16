import axios from '@/services/config';
import { isVercel } from "@/services/config";
import Mock from "mockjs";

export async function fetchSavingTips({ page = 1, pageSize = 10 } = {}) {
  if (isVercel) {
    const { Random } = Mock;
    const genCover = () => {
      const bg = Random.color(); let fg = Random.color(); if (fg === bg) fg = "#ffffff";
      return Random.image("240x135", bg, fg, "png", "img");
    };
    const genAvatar = () => {
      const bg = Random.color(); let fg = Random.color(); if (fg === bg) fg = "#ffffff";
      return Random.image("48x48", bg, fg, "png", "user");
    };
    const genArticle = () => ({
      id: Random.guid(),
      title: Random.ctitle(8, 15),
      cover: genCover(),
      content: Random.csentence(40, 80),
      authorName: Random.cname(),
      authorAvatar: genAvatar(),
      comments: Array.from({ length: Random.integer(2, 5) }, () => ({
        id: Random.guid(), avatar: genAvatar(), username: Random.cname(), content: Random.csentence(10, 24),
      })),
      likes: Random.integer(0, 100),
      favorites: Random.integer(0, 20),
      createdAt: Random.datetime(),
      brand: Random.pick(['苹果','华为','小米']),
      product: Random.pick(['手机','耳机','路由器']),
    });
    const list = Array.from({ length: pageSize }, genArticle);
    return { list, page, pageSize, hasMore: page < 5 };
  }

  const { data } = await axios.get('/saving-tips/list', { params: { page, pageSize } });
  const payload = data?.data || {};
  return {
    list: payload.list || [],
    page: payload.page || page,
    pageSize: payload.pageSize || pageSize,
    hasMore: !!payload.hasMore,
  };
}