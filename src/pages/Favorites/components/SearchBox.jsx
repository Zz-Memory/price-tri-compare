import { useState, useEffect } from "react";
import { Search } from "@react-vant/icons";

const SearchBox = ({ value, onChange, placeholder = "搜索折扣爆料" }) => {
  const [inner, setInner] = useState(value || "");
  useEffect(() => {
    setInner(value || "");
  }, [value]);

  const handleInput = (e) => {
    const v = e.target.value;
    setInner(v);
    onChange?.(v);
  };

  return (
    <div className="bg-white px-3 pb-2">
      <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3 text-sm text-gray-500">
        <span className="mr-2"><Search  /></span>
        <input
          value={inner}
          onChange={handleInput}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBox;