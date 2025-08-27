import React from "react";

const TipComments = ({ comments = [] }) => {
  if (!Array.isArray(comments) || comments.length === 0) {
    return <div className="px-3 py-4 text-sm text-gray-500 text-center">暂无评论</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-100 text-base text-gray-900 font-semibold">评论（{comments.length}）</div>
      <ul className="divide-y divide-gray-100">
        {comments.map((c) => (
          <li key={c.id} className="px-3 py-3 flex items-start gap-2">
            <img
              src={c.avatar}
              alt={c.username}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <div className="text-xs text-gray-700 mb-1">{c.username}</div>
              <div className="text-sm text-gray-800 leading-5">{c.content}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TipComments;