import React from "react";
import TipAuthor from "./TipAuthor";
import TipContent from "./TipContent";
import TipMeta from "./TipMeta";
import { LikeO, StarO } from "@react-vant/icons";

const TipCombinedCard = ({ tip, likeCount = 0, favCount = 0, commentsCount = 0 }) => {
  if (!tip) return null;
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-3">
        <TipAuthor name={tip.authorName} avatar={tip.authorAvatar} />
      </div>

      <TipContent cover={tip.cover} content={tip.content} embedded />

      <div className="px-3 pb-3">
        <TipMeta
          brand={tip.brand}
          product={tip.product}
          createdAt={tip.createdAt}
          commentsCount={commentsCount}
          showCounts={false}
        />
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
          <span className="flex items-center gap-1"><LikeO /> {likeCount}</span>
          <span className="flex items-center gap-1"><StarO /> {favCount}</span>
        </div>
      </div>
    </div>
  );
};

export default TipCombinedCard;