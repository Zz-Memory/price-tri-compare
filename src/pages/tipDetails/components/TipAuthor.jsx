import React from "react";

const TipAuthor = ({ name = "作者", avatar, onFollow }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {avatar ? (
          <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200" />
        )}
        <span className="ml-2 text-sm text-gray-900">{name}</span>
      </div>
      <button
        onClick={onFollow}
        className="px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded hover:bg-blue-100 active:bg-blue-200"
      >
        关注
      </button>
    </div>
  );
};

export default TipAuthor;