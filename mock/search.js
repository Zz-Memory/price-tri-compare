import Mock from 'mockjs';

const { Random } = Mock;

function genSuggestions(q) {
  const kw = (q || '').trim();
  if (!kw) return [];
  const base = [
    `${kw}`,
    `${kw} 最低价`,
    `${kw} 历史价格`,
    `${kw} 价格走势`,
    `${kw} 参数对比`,
    `${kw} 京东/拼多多 对比`,
    `${kw} 优惠券`,
    `${kw} 官方旗舰店`,
    `${kw} 开箱测评`,
    `${kw} 用户评价`,
    `${kw} 以旧换新`,
    `${kw} 真伪鉴定`,
    `${kw} 学生优惠`,
    `${kw} 教育优惠`,
    `${kw} 近期好价`,
    `${kw} 店铺券`,
    `${kw} 补贴`,
  ];

  // 乱序并取随机 5~8 条（去重）
  const pool = Random.shuffle(base);
  const count = Random.integer(5, 8);
  const set = new Set();
  const out = [];
  for (const s of pool) {
    if (!set.has(s)) {
      set.add(s);
      out.push(s);
    }
    if (out.length >= count) break;
  }
  return out;
}

export default [
  {
    url: '/api/search/suggest',
    method: 'get',
    timeout: 100,
    response: ({ query }) => {
      const q = query?.q || '';
      const list = genSuggestions(q);
      return {
        code: 0,
        message: 'ok',
        data: { list }
      };
    }
  }
];