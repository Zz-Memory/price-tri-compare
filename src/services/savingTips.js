import axios from '@/services/config';
import { isVercel } from "@/services/config";
import Mock from "mockjs";

export async function fetchSavingTips({ page = 1, pageSize = 10 } = {}) {
  if (isVercel) {
    // 完全复刻 mock/savingTips.js 的生成逻辑，确保语义与文案和本地一致
    const { Random } = Mock;

    // 封面与头像
    function genCover() {
      const bg = Random.color();
      let fg = Random.color();
      if (fg === bg) fg = '#ffffff';
      return Random.image('240x135', bg, fg, 'png', 'img');
    }
    function genAvatar() {
      const bg = Random.color();
      let fg = Random.color();
      if (fg === bg) fg = '#ffffff';
      return Random.image('48x48', bg, fg, 'png', 'user');
    }

    // 关键词池
    const BRANDS = ['苹果','华为','小米','OPPO','vivo','一加','联想','华硕','戴尔','惠普','美的','海尔','格力','索尼','任天堂','耐克','阿迪达斯'];
    const PRODUCTS = ['手机','笔记本','平板','耳机','显示器','路由器','空调','洗衣机','冰箱','运动鞋','电饭煲','空气炸锅'];
    const SCENES = ['618','双11','百亿补贴','以旧换新','教育优惠','店铺券叠加','多件多折','会员日'];
    const ACTIONS = ['凑单满减','领平台券','叠店铺券','参加秒杀','关注会员日','用白条券','拼单立减'];

    // 标题模板（5~15 字左右）
    const TITLE_TPLS = [
      (b, p) => `${b}${p}怎么买更值？${Random.pick(SCENES)}`,
      (b, p) => `${b}${p}省钱攻略：优惠怎么叠最划算`,
      (b, p) => `避坑！${b}${p}入手建议与省钱技巧`,
      (b, p) => `${b}${p}低价入手：三步拿到底价`,
      (b, p) => `${b}${p}选购要点与优惠组合`,
    ];
    function genTitle(brand, product) {
      const t = Random.pick(TITLE_TPLS)(brand, product);
      return t.length > 15 ? t.slice(0, 15) : t;
    }

    // 正文模板（30~80 字）
    const CONTENT_TPLS = [
      (b, p) =>
        `想入手${b}${p}，优先关注${Random.pick(SCENES)}。先${Random.pick(ACTIONS)}，再用平台大额券，最后凑单触发满减。下单前对比历史价，避免活动前临时涨价。`,
      (b, p) =>
        `${b}${p}省钱关键在“叠”。店铺券+平台券+满减一并使用，若支持${Random.pick(['以旧换新','学生/教育优惠'])}更好。选择基础款更稳，价格更容易打到低位。`,
      (b, p) =>
        `入手${b}${p}别急，先收集${Random.pick(ACTIONS)}，配合${Random.pick(SCENES)}再下单。若差几元可凑单日用品，整体实付更低，记得查价走势再决定。`,
      (b, p) =>
        `${b}${p}想省钱，先看是否有${Random.pick(['联名券','会员券','大额神券'])}。叠加满减后常能比日常低一档，拼单或分期券也可利用，注意库存与时效。`,
    ];
    function genContent(brand, product) {
      const c = Random.pick(CONTENT_TPLS)(brand, product);
      if (c.length < 30) return c + Random.csentence(8, 16);
      if (c.length > 80) return c.slice(0, 80);
      return c;
    }

    // 评论模板
    const COMMENT_TPLS = [
      (b, p) => `已入手${b}${p}，叠券确实香，等${Random.pick(SCENES)}再下更稳`,
      (b, p) => `${b}${p}别冲高配，基础款性价比高，等满减+平台券一起上`,
      (b, p) => `同意，${Random.pick(ACTIONS)}+店铺券，${b}${p}价格能打到位`,
      (b, p) => `${b}${p}如果有${Random.pick(['教育优惠','以旧换新','会员券'])}再叠更便宜`,
      (b, p) => `对比历史价很重要，${b}${p}活动前有时会先涨再降`,
    ];
    function genComments(brand, product) {
      const n = Random.integer(2, 5);
      return Array.from({ length: n }, () => ({
        id: Random.guid(),
        avatar: genAvatar(),
        username: Random.cname(),
        content: Random.pick(COMMENT_TPLS)(brand, product),
      }));
    }

    // 时间范围：2025-01-01 ~ 2025-08-10
    function formatDateTime(date) {
      const d = new Date(date);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
    function randDateInRange(start, end) {
      const t = Random.integer(start.getTime(), end.getTime());
      return formatDateTime(t);
    }

    function genArticle() {
      const brand = Random.pick(BRANDS);
      const product = Random.pick(PRODUCTS);
      const authorName = Random.cname();
      const authorAvatar = genAvatar();
      const createdAt = randDateInRange(
        new Date(2025, 0, 1, 0, 0, 0),
        new Date(2025, 7, 10, 23, 59, 59)
      );
      return {
        id: Random.guid(),
        title: genTitle(brand, product),
        cover: genCover(),
        content: genContent(brand, product),
        authorName,
        authorAvatar,
        comments: genComments(brand, product),
        likes: Random.integer(0, 100),
        favorites: Random.integer(0, 20),
        createdAt,
        brand,
        product,
      };
    }

    const list = Array.from({ length: pageSize }, () => genArticle());

    // 返回与 mock 完全一致的包结构，并在调用层保持与本地一致的解包结果
    const mockResp = {
      code: 0,
      message: 'ok',
      data: {
        list,
        page,
        pageSize,
        hasMore: page < 5,
      },
    };
    return mockResp.data;
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