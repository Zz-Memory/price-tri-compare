import jwt from "jsonwebtoken";

// 为了安全性，编码的时候加密
// 解码的时候用于解密
// 加盐
const secret = "!@$@!$#@$abcdefg";
// login 模拟 mock
export default [
  {
    url: "/api/login",
    method: "POST",
    timeout: 1000, // 请求耗时
    response: (req, res) => {
      const { token: loginToken } = req.body || {};
      if (!loginToken) {
        return {
          code: 400,
          msg: "缺少登录凭证",
        };
      }
      try {
        const payload = jwt.verify(loginToken, secret);
        const { username, password } = payload || {};
        if (username !== "admin" || password !== "123456") {
          return {
            code: 400,
            msg: "用户名或密码错误",
          };
        }
        // json 用户数据
        const token = jwt.sign(
          {
            user: {
              id: "101",
              username: "admin",
              level: 4,
            },
          },
          secret, // 密钥
          {
            expiresIn: 86400, // 过期时间 秒
          }
        );
        // 生成token 颁发令牌
        return {
          code: 200,
          msg: "登录成功",
          token,
          data: {
            id: "101",
            username: "admin",
            footprints: 0,
            favorites: 0,
            coins: 0,
            points: 0,
          },
        };
      } catch (err) {
        return {
          code: 400,
          msg: "无效的登录凭证",
        };
      }
    },
  },
  {
    url: "/api/user",
    method: "GET",
    response: (req, res) => {
      // 用户端token headers
      const auth = req.headers["authorization"] || "";
      const token = auth.split(" ")[1];
      try {
        const decoded = jwt.verify(token, secret);
        return {
          code: 0,
          data: decoded.user,
        };
      } catch (err) {
        return {
          code: 1,
          message: "Invalid token: " + err,
        };
      }
    },
  },
];
