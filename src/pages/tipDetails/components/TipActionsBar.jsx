import React from "react";
import { ShareO, ChatO, StarO, Star, LikeO, Like } from "@react-vant/icons";

const TipActionsBar = ({
  placeholder = "点我发评论",
  shareCount = 0,
  commentsCount = 0,
  favCount = 0,
  likeCount = 0,
  faved = false,
  liked = false,
  onClickCommentInput,
  onClickShare,
  onToggleFav,
  onToggleLike,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
      <div
        className="max-w-md mx-auto px-3 pt-2 pb-2"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {}}
            className="flex-1 text-left bg-gray-100 text-gray-500 rounded-full px-4 py-2"
          >
            {placeholder}
          </button>

          <div className="flex items-end gap-5">
            <button onClick={onClickShare} className="flex flex-col items-center text-gray-600">
              <ShareO />
              <span className="text-[10px] mt-1 text-gray-500">{shareCount}</span>
            </button>
            <button onClick={onClickCommentInput} className="flex flex-col items-center text-gray-600">
              <ChatO />
              <span className="text-[10px] mt-1 text-gray-500">{commentsCount}</span>
            </button>
            <button onClick={onToggleFav} className="flex flex-col items-center text-gray-600">
              {faved ? <Star /> : <StarO />}
              <span className="text-[10px] mt-1 text-gray-500">{favCount}</span>
            </button>
            <button onClick={onToggleLike} className="flex flex-col items-center text-gray-600">
              {liked ? <Like /> : <LikeO />}
              <span className="text-[10px] mt-1 text-gray-500">{likeCount}</span>
            </button>
          </div>
        </div>

        <div className="mt-2 mx-auto h-1 w-32 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};

export default TipActionsBar;