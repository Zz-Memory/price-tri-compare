import React from "react";

const TipContent = ({ cover, content }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {cover ? (
        <div className="w-full">
          <img
            src={cover}
            alt="cover"
            className="w-full block object-cover"
            style={{ display: "block", width: "100%" }}
          />
        </div>
      ) : null}
      <div className="p-3">
        <p className="text-[15px] leading-6 text-gray-800 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

export default TipContent;