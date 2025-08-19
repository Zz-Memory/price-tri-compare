import { useEffect } from 'react';

/**
 * 自定义Hook：自动设置页面标题
 * @param {string} title - 页面标题
 */
const useTitle = (title) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
};

export default useTitle;