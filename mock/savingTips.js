import Mock from 'mockjs';

const { Random } = Mock;

// 封面与头像
function genCover() {
  const bg = Random.color();
  let fg = Random.color();
  if (fg === bg) fg = '#ffffff';
  // 随机高度以制造瀑布流的高低错落（120~220）
  const h = Random.integer(120, 220);
  return Random.image(`240x${h}`, bg, fg, 'png', 'img');
}
function genAvatar() {
  const bg = Random.color();
  let fg = Random.color();
  if (fg === bg) fg = '#ffffff';
  return Random.image('48x48', bg, fg, 'png', 'user');
}

// 评论
function genComments() {
  const n = Random.integer(2, 5);
  return Array.from({ length: n }, () => ({
    id: Random.guid(),
    avatar: genAvatar(),
    username: Random.cname(),
    content: Random.csentence(8, 15),
  }));
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

function genTitle(brand, product) {
  const t = Random.pick(TITLE_TPLS)(brand, product);
  // 控制到 5~15 字（大致，中文计数）
  return t.length > 15 ? t.slice(0, 15) : t;
}
function genContent(brand, product) {
  const c = Random.pick(CONTENT_TPLS)(brand, product);
  // 控制到 30~80 字（大致）
  if (c.length < 30) return c + Random.csentence(8, 16);
  if (c.length > 80) return c.slice(0, 80);
  return c;
}

function genArticle() {
  const brand = Random.pick(BRANDS);
  const product = Random.pick(PRODUCTS);
  return {
    id: Random.guid(),
    title: genTitle(brand, product),
    cover: genCover(),
    content: genContent(brand, product),
    comments: genComments(),
    likes: Random.integer(0, 100),
    favorites: Random.integer(0, 20),
    createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    brand,
    product,
  };
}

function generateList(count = 10) {
  return Array.from({ length: count }, () => genArticle());
}

export default [
  {
    url: '/api/saving-tips/list',
    method: 'get',
    timeout: 300,
    response: ({ query }) => {
      const page = Number(query?.page || 1);
      const pageSize = Number(query?.pageSize || 10);
      const list = generateList(pageSize);
      return {
        code: 0,
        message: 'ok',
        data: {
          list,
          page,
          pageSize,
          hasMore: page < 5,
        },
      };
    },
  },
];