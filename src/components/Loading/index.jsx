import React from 'react';
import { THEME_COLOR } from '@/constants/theme';

const Loading = ({ size = 'md', color = THEME_COLOR }) => {
  const sizePx = size === 'small' ? 10 : size === 'lg' ? 16 : 14;
  const dotStyleBase = {
    width: sizePx,
    height: sizePx,
    backgroundColor: color,
    borderRadius: '9999px',
  };
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex space-x-2">
        <div className="animate-bounce" style={{ ...dotStyleBase, animationDelay: '0ms' }} />
        <div className="animate-bounce" style={{ ...dotStyleBase, animationDelay: '150ms' }} />
        <div className="animate-bounce" style={{ ...dotStyleBase, animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default Loading;