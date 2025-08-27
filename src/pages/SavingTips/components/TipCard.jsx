import React, { useMemo } from "react";
import { LikeO } from "@react-vant/icons";
import { useNavigate } from "react-router-dom";

const clamp2 = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};
const clampTitle = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

// 基于 id 生成稳定随机高度，避免重渲时高度抖动
function heightById(id, min = 120, max = 220) {
  if (!id) return Math.floor((min + max) / 2);
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const span = max - min + 1;
  return min + (hash % span);
}

const TipCard = ({ data }) => {
  const art = data || {};
  const coverH = useMemo(() => heightById(art.id), [art.id]);
  const navigate = useNavigate();
  const handleClick = () => {
    if (art?.id) navigate(`/tips/${art.id}`, { state: { data: art } });
  };

  return (
    <div onClick={handleClick} className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer">
      {art.cover ? (
        <div style={{ width: "100%", height: coverH, overflow: "hidden" }}>
          <img
            src={art.cover}
            alt="cover"
            className="w-full h-full object-cover block"
            style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ) : null}

      <div className="p-3">
        {art.title ? (
          <h3 className="text-[16px] font-bold text-gray-900 leading-5 mb-1" style={clampTitle}>
            {art.title}
          </h3>
        ) : null}

        <p className="text-[13px] text-gray-800 leading-5 mt-1" style={clamp2}>
          {art.content}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            {art.authorAvatar ? (
              <img
                src={art.authorAvatar}
                alt={art.authorName || "作者"}
                className="w-5 h-5 rounded-full"
              />
            ) : null}
            <span className="ml-2 text-xs text-gray-700">{art.authorName || "作者"}</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            <LikeO />
            <span className="ml-1">{art.likes ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipCard;