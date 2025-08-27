import React from "react";
import { LikeO, StarO } from "@react-vant/icons";

const MetaTag = ({ children }) => (
  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 mr-2">{children}</span>
);

const TipMeta = ({ brand, product, createdAt, commentsCount = 0, likes = 0, favorites = 0 }) => {
  return (
    <div className="px-3 py-2">
      <div className="mb-2">
        {brand ? <MetaTag>{brand}</MetaTag> : null}
        {product ? <MetaTag>{product}</MetaTag> : null}
        {createdAt ? <span className="text-xs text-gray-500 ml-1">{createdAt}</span> : null}
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-4">
        <span>评论 {commentsCount}</span>
        <span className="flex items-center gap-1"><LikeO /> {likes ?? 0}</span>
        <span className="flex items-center gap-1"><StarO /> {favorites ?? 0}</span>
      </div>
    </div>
  );
};

export default TipMeta;