import React from "react";

/**
 * LineChart 渐变面积折线图（纯 SVG）
 * - 仅接收数值数组 data，内部自适应计算 min/max 并绘制
 * - 无任何外部依赖，便于在不同页面复用
 */
const LineChart = ({ data = [], width = 320, height = 140, className = "" }) => {
  if (!Array.isArray(data) || data.length < 2) {
    return <div className={`w-full h-36 bg-gray-50 rounded-lg ${className}`} />;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = (1 - (v - min) / span) * height;
    return { x, y };
  });
  const polyPoints = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `0,${height} ${polyPoints} ${width},${height}`;

  const hSteps = 4;
  const vSteps = 6;
  const last = pts[pts.length - 1];

  // 避免 defs id 冲突
  const gradId = "lcAreaPd";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`w-full h-36 ${className}`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 网格 */}
      <g stroke="currentColor" className="text-gray-200">
        {Array.from({ length: hSteps + 1 }).map((_, i) => {
          const y = (i / hSteps) * height;
          return <line key={`h-${i}`} x1="0" y1={y} x2={width} y2={y} strokeDasharray="4 4" />;
        })}
        {Array.from({ length: vSteps + 1 }).map((_, i) => {
          const x = (i / vSteps) * width;
          return <line key={`v-${i}`} x1={x} y1="0" x2={x} y2={height} strokeDasharray="4 4" />;
        })}
      </g>

      {/* 渐变面积 */}
      <polygon points={areaPoints} fill={`url(#${gradId})`} />

      {/* 折线 */}
      <polyline
        points={polyPoints}
        fill="none"
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 终点高亮 */}
      <circle cx={last.x} cy={last.y} r="3.5" fill="#fff" stroke="#ef4444" strokeWidth="2" />
    </svg>
  );
};

export default LineChart;