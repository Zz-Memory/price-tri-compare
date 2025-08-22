import Mock from 'mockjs';

const { Random } = Mock;

// 平台与类目
const PLATFORMS = [
  { key: 'douyin', name: '抖音商城' },
  { key: 'pdd', name: '拼多多' },
  { key: 'jd', name: '京东' },
  { key: 'tb', name: '淘宝' },
  { key: 'tmall', name: '天猫' },
  { key: 'kuaishou', name: '快手商城' }
];

const CATEGORIES = [
  { key: 'pc', label: '电脑' },
  { key: 'phone', label: '手机' },
  { key: 'appliance', label: '家电' },
  { key: 'clothes', label: '服饰' },
  { key: 'beauty', label: '美妆' },
  { key: 'sports', label: '运动' },
  { key: 'home', label: '居家' }
];

// 工具
const toMoney = (n) => Number(n.toFixed(2));
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

// 价格生成（满足你的三种形态要求）
// 1) currentPrice: 单个数字
// 2) last7dPrices: 7 个数字（从旧到新），最后一个等于 currentPrice
function genLast7Days(currentPrice) {
  const arr = [];
  for (let i = 0; i < 6; i += 1) {
    // 以当前价为基准，独立抽样在 ±10% 范围
    const pct = Random.float(-0.1, 0.1, 3, 3);
    arr.push(toMoney(currentPrice * (1 + pct)));
  }
  arr.push(toMoney(currentPrice));
  return arr;
}

// 3) last180dPrices: 近 6 个月价格（从旧到新）：
//    前段每 15 天一个价格点，最后 7 天与 last7dPrices 完全一致，可出现相同值
//    180d - 7d = 173d；173/15 ≈ 12 个半月节点
function genLast180Days(currentPrice, last7d) {
  const nodes = 12;
  const maxPct = 0.2; // 整体限制在 ±20%
  const min = currentPrice * (1 - maxPct);
  const max = currentPrice * (1 + maxPct);

  const series = [];
  // 初值在 ±15% 内
  let prev = clamp(currentPrice * (1 + Random.float(-0.15, 0.15, 3, 3)), min, max);
  series.push(toMoney(prev));

  for (let i = 1; i < nodes; i += 1) {
    // 每个半月点在前一价格基础上小幅波动（±2%），偶尔保持相同以制造“相同值”
    if (Random.boolean(1, 6)) {
      series.push(toMoney(prev)); // 保持不变
      continue;
    }
    let next = prev * (1 + Random.float(-0.02, 0.02, 3, 3));
    next = clamp(next, min, max);
    next = toMoney(next);
    series.push(next);
    prev = next;
  }

  // 拼接最近 7 天（完全与 last7d 一致）
  return [...series, ...last7d];
}

// 标题与素材
const CATEGORY_BRANDS = {
  phone: ['华为', '苹果', '小米', 'OPPO', 'vivo', '一加'],
  pc: ['联想', '华硕', '戴尔', '惠普', '苹果', '宏碁'],
  appliance: ['美的', '海尔', '格力', '松下', '小米', 'TCL'],
  beauty: ['兰蔻', '雅诗兰黛', '资生堂', '欧莱雅', 'SK-II', '薇诺娜'],
  clothes: ['耐克', '阿迪达斯', '优衣库', '李宁', '波司登', '安踏'],
  sports: ['李宁', '安踏', '特步', '361°', '耐克', '阿迪达斯'],
  home: ['宜家', 'MUJI', '小米', '网易严选', '九牧', '九阳']
};

function genTitle(categoryKey, brand) {
  switch (categoryKey) {
    case 'phone': {
      const models = ['Mate 60', 'Mate 60 Pro', 'Pura 70', 'iPhone 15', 'iPhone 14', 'Mi 14', 'K70', 'X100'];
      const storages = ['128G', '256G', '512G'];
      const colors = ['黑色', '白色', '远峰蓝', '青山黛', '釉紫', '金色'];
      const extras = ['5G', '旗舰芯片', '高刷屏', '长续航'];
      return `${brand} ${Random.pick(models)} ${Random.pick(storages)} ${Random.pick(colors)} ${Random.pick(extras)}`;
    }
    case 'pc': {
      const series = ['小新 Pro', 'YOGA', '灵耀', '战66', 'XPS 13', 'MateBook'];
      const sizes = ['13.3', '14', '15.6', '16'];
      const cpu = ['i5', 'i7', 'R5', 'R7', 'M2', 'M3'];
      return `${brand} ${Random.pick(series)} ${Random.pick(sizes)}英寸 ${Random.pick(cpu)} 16G+512G 轻薄本`;
    }
    case 'appliance': {
      const types = ['变频空调', '滚筒洗衣机', '双开门冰箱', '扫地机器人', '电饭煲', '洗烘一体机'];
      const cap = ['1.5匹', '8KG', '10KG', '425L', '5L'];
      return `${brand} ${Random.pick(types)} ${Random.pick(cap)} 一级能效`;
    }
    case 'beauty': {
      const types = ['精华', '面霜', '洁面', '水乳套装', '防晒'];
      const vol = ['30ml', '50ml', '100ml', '120ml', '150ml'];
      return `${brand} ${Random.pick(types)} ${Random.pick(vol)} 保湿修护`;
    }
    case 'clothes': {
      const types = ['运动鞋', '羽绒服', 'T恤', '卫衣', '棒球帽'];
      const extra = ['透气', '保暖', '速干', '宽松版', '轻便'];
      return `${brand} ${Random.pick(types)} ${Random.pick(extra)}`;
    }
    case 'sports': {
      const types = ['跑步鞋', '训练鞋', '瑜伽垫', '健腹轮', '护腕'];
      return `${brand} ${Random.pick(types)} 轻便耐用`;
    }
    default: {
      const types = ['收纳盒', '床品四件套', '落地灯', '办公椅', '空气炸锅'];
      return `${brand} ${Random.pick(types)} 实用百搭`;
    }
  }
}

function genCover() {
  // 与前端 w-28 h-28 对应 112x112；文字固定为 "img"，颜色随机
  const bg = Random.color();
  let fg = Random.color();
  if (fg === bg) fg = '#ffffff';
  return Random.image('112x112', bg, fg, 'png', 'img');
}

const BADGES = [
  { text: '低于双11', color: 'bg-red-500' },
  { text: '历史新低', color: 'bg-blue-500' },
  { text: '139天次低', color: 'bg-red-500' }
];
const OPTIONAL_TAGS = [
  { text: '政府补贴', bg: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { text: '店铺券', bg: 'bg-green-100', textColor: 'text-green-700' },
  { text: '限时秒杀', bg: 'bg-orange-100', textColor: 'text-orange-700' }
];

function genItem(platformKey, categoryKey) {
  const platformName = (PLATFORMS.find(p => p.key === platformKey) || PLATFORMS[0]).name;
  const brandPool = CATEGORY_BRANDS[categoryKey] || CATEGORY_BRANDS.phone;
  const brand = Random.pick(brandPool);

  const currentPrice = toMoney(Random.float(50, 5000, 2, 2));
  const last7dPrices = genLast7Days(currentPrice);
  const last180dPrices = genLast180Days(currentPrice, last7dPrices);

  // 时间（HH:mm 或 MM-DD）
  const time = Random.boolean()
    ? `${String(Random.integer(0, 23)).padStart(2, '0')}:${String(Random.integer(0, 59)).padStart(2, '0')}`
    : `${String(Random.integer(1, 12)).padStart(2, '0')}-${String(Random.integer(1, 28)).padStart(2, '0')}`;

  return {
    id: Random.guid(),
    platform: platformKey,
    category: categoryKey,
    cover: genCover(),
    badge: Random.pick(BADGES),
    title: genTitle(categoryKey, brand),
    subtitle: Random.boolean(3, 7, true) ? Random.pick(['慢慢买补贴1.4元', '红包立减', '平台津贴叠加', '限量抢购']) : '',
    tag: Random.boolean(4, 6, true) ? Random.pick(OPTIONAL_TAGS) : null,

    // 核心价格字段（按你的规则）
    currentPrice,
    last7dPrices,   // 长度=7，最后一个===currentPrice
    last180dPrices, // 半年序列，前段为半月点，最后 7 天与 last7dPrices 一致（长度约 19）

    // 展示辅助
    priceText: `${currentPrice}元`,
    meta: { source: platformName, time },

    // 点赞与评论
    stats: { comments: Random.integer(0, 2000), likes: Random.integer(0, 5000) }
  };
}

function generateList(count = 12, platform = 'jd', category = 'phone') {
  return Array.from({ length: count }, () => genItem(platform, category));
}

export default [
  {
    url: '/api/home/recommendations',
    method: 'get',
    timeout: 400,
    response: ({ query }) => {
      const platform = query?.platform || 'jd';
      const category = query?.category || 'phone';
      const page = Number(query?.page || 1);
      const pageSize = Number(query?.pageSize || 10);

      const list = generateList(pageSize, platform, category);

      return {
        code: 0,
        message: 'ok',
        data: {
          list,
          page,
          pageSize,
          hasMore: page < 5
        }
      };
    }
  }
];