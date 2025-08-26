import React from "react";

const itemStyle = {
  breakInside: "avoid",
  WebkitColumnBreakInside: "avoid",
  pageBreakInside: "avoid",
};

const Waterfall = ({ items = [], renderItem, columnCount = 2, gap = 12, itemGap = 12, keyProp = "id" }) => {
  return (
    <div className="px-3" style={{ columnCount, columnGap: gap }}>
      {items.map((it) => (
        <div key={it?.[keyProp] ?? Math.random()} style={{ ...itemStyle, marginBottom: itemGap }}>
          {renderItem ? renderItem(it) : null}
        </div>
      ))}
    </div>
  );
};

export default Waterfall;