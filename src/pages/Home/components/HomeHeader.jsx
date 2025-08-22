import SearchBox from '@/components/SearchBox';

const HomeHeader = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="text-xl font-bold text-red-500">
          货三家 <span className="text-sm font-normal text-gray-500">中立的导购平台</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"></rect>
              <rect x="14" y="3" width="7" height="7" rx="1"></rect>
              <rect x="3" y="14" width="7" height="7" rx="1"></rect>
              <rect x="14" y="14" width="7" height="7" rx="1"></rect>
            </svg>
          </span>
          <button className="bg-red-500 text-white text-sm px-4 py-1 rounded-full">领红包</button>
        </div>
      </div>
      <SearchBox />
    </div>
  );
};

export default HomeHeader;