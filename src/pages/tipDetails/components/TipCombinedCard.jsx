import React from "react";
import TipAuthor from "./TipAuthor";
import TipContent from "./TipContent";
import TipMeta from "./TipMeta";


const TipCombinedCard = ({ tip }) => {
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
        />

      </div>
    </div>
  );
};

export default TipCombinedCard;