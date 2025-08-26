import React from "react";

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

const TipCard = ({ data }) => {
  const art = data || {};
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {art.cover ? (
        <img
          src={art.cover}
          alt="cover"
          className="w-full block"
          style={{ display: "block", width: "100%", height: "auto" }}
        />
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
          <span>👍 {art.likes ?? 0}</span>
          <span>★ {art.favorites ?? 0}</span>
        </div>
      </div>
    </div>
  );
};

export default TipCard;