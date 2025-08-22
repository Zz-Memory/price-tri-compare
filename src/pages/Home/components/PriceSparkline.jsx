/**
 * PriceSparkline 近 7 天价格折线迷你图
 * - 纯展示：不显示坐标轴/网格/tooltip
 * - 输入数据按从旧到新顺序的一维数字数组（长度 7）
 */
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const PriceSparkline = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  // 转换为 Recharts 所需结构
  const series = data.map((v) => ({ v }));

  // 防止全相等导致图形压扁：给 domain 预留 10% padding
  const min = Math.min(...data);
  const max = Math.max(...data);
  const diff = Math.max(max - min, Math.max(1, max * 0.01));
  const domainMin = min - diff * 0.1;
  const domainMax = max + diff * 0.1;

  return (
    <div className="w-16 h-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <YAxis hide domain={[domainMin, domainMax]} />
          <Line
            type="monotone"
            dataKey="v"
            stroke="#ef4444"   /* tailwind red-500 */
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceSparkline;