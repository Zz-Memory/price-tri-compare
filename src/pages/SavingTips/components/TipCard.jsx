import React, { useMemo } from "react";
import { StarO, LikeO } from "@react-vant/icons";
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

        {Array.isArray(art.comments) && art.comments.length > 0 ? (
          <div className="flex items-center mt-2">
            <div className="flex -space-x-2">
              {art.comments.slice(0, 2).map((c) => (
                <img
                  key={c.id}
                  src={c.avatar}
                  alt={c.username}
                  className="w-5 h-5 rounded-full border border-white"
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-500">{art.comments.length} 条评论</span>
          </div>
        ) : null}

        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span><StarO  /> {art.favorites ?? 0}</span>
          <span><LikeO  /> {art.likes ?? 0}</span>
        </div>
      </div>
    </div>
  );
};

export default TipCard;