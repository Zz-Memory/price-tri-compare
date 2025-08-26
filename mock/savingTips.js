import Mock from 'mockjs';

const { Random } = Mock;

function genCover() {
  const bg = Random.color();
  let fg = Random.color();
  if (fg === bg) fg = '#ffffff';
  // 封面 240x135，文字固定为 img
  return Random.image('240x135', bg, fg, 'png', 'img');
}

function genAvatar() {
  const bg = Random.color();
  let fg = Random.color();
  if (fg === bg) fg = '#ffffff';
  // 头像 48x48，文字可设为 user
  return Random.image('48x48', bg, fg, 'png', 'user');
}

function genComments() {
  const n = Random.integer(2, 5);
  return Array.from({ length: n }, () => ({
    id: Random.guid(),
    avatar: genAvatar(),
    username: Random.cname(),
    content: Random.csentence(8, 15)
  }));
}

function genArticle() {
  return {
    id: Random.guid(),
    cover: genCover(),                         // 1. 文章封面：图片文字 img
    content: Random.csentence(30, 80),         // 2. 文章内容：30~80字
    comments: genComments(),                   // 3. 评论：2~5条，含头像/用户名/内容8~15字
    likes: Random.integer(0, 100),             // 4. 点赞数：0~100
    favorites: Random.integer(0, 20),          // 5. 收藏数：0~20
    createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss')
  };
}

function generateList(count = 10) {
  return Array.from({ length: count }, () => genArticle());
}

export default [
  {
    url: '/api/saving-tips/list',
    method: 'get',
    timeout: 300,
    response: ({ query }) => {
      const page = Number(query?.page || 1);
      const pageSize = Number(query?.pageSize || 10);
      const list = generateList(pageSize);
      return {
        code: 0,
        message: 'ok',
        data: {
          list,
          page,
          pageSize,
          hasMore: page < 5
        }
      };
    }
  }
];