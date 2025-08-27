import React from "react";
import { ArrowLeft } from "@react-vant/icons";

const TipHeader = ({ title = "", onBack }) => {
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur px-3 py-3 border-b border-gray-100 flex items-center">
      <button
        onClick={onBack}
        className="text-sm text-gray-700 mr-2 px-2 py-1 rounded hover:bg-gray-100 active:bg-gray-200"
        aria-label="返回"
      >
        <ArrowLeft />
      </button>
      <div className="text-base font-medium text-gray-900 truncate">{title || "攻略详情"}</div>
    </div>
  );
};

export default TipHeader;