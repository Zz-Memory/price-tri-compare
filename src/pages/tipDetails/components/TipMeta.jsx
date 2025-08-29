import React from "react";


const MetaTag = ({ children }) => (
  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 mr-2">{children}</span>
);

const TipMeta = ({ brand, product, createdAt }) => {
  return (
    <div className="px-3 py-2">
      <div className="mb-2">
        {brand ? <MetaTag>{brand}</MetaTag> : null}
        {product ? <MetaTag>{product}</MetaTag> : null}
        {createdAt ? <span className="text-xs text-gray-500 ml-1">{createdAt}</span> : null}
      </div>

    </div>
  );
};

export default TipMeta;