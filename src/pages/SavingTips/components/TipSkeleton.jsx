import React, { useMemo } from "react";
import { Skeleton } from "react-vant";

// 基于种子生成稳定的随机高度
function heightBySeed(seed, min = 120, max = 220) {
  if (seed == null) return Math.floor((min + max) / 2);
  const span = max - min + 1;
  return min + ((seed * 53) % span);
}

const TipSkeleton = ({ seed = 0 }) => {
  const h = useMemo(() => heightBySeed(seed), [seed]);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div style={{ width: "100%", height: h }} className="bg-gray-200" />
      <div className="p-3">
        <Skeleton animated title row={2} />
      </div>
    </div>
  );
};

export default TipSkeleton;