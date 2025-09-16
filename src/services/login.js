import axios from '@/services/config'
import { isVercel } from "@/services/config";

const SECRET = '!@$@!$#@$abcdefg';
const enc = new TextEncoder();

// base64url 编码工具
function base64UrlFromBytes(bytes) {
  let str = '';
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  const b64 = btoa(str);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function base64UrlFromString(str) {
  return base64UrlFromBytes(enc.encode(str));
}

// 使用 WebCrypto 生成 HS256 JWT：header.payload.signature
async function signJwtHS256(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const data = `${base64UrlFromString(JSON.stringify(header))}.${base64UrlFromString(JSON.stringify(payload))}`;
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const signature = base64UrlFromBytes(new Uint8Array(sigBuf));
  return `${data}.${signature}`;
}

export const getUser = async () => {
  if (isVercel) {
    // 直接从本地存储 token 解码简单返回（演示用途）
    const token = localStorage.getItem('token') || '';
    if (!token) return { data: { code: 1, message: 'No token' } };
    return { data: { code: 0, data: { id: '101', username: 'admin', footprints: 0, favorites: 0, coins: 0, points: 0 } } };
  }
  return axios.get('/user');
};

export const doLogin = async ({ username, password }) => {
  const payload = { username, password, ts: Date.now() };
  const token = await signJwtHS256(payload, SECRET);
  if (isVercel) {
    // Vercel：前端“假登录”，对齐 mock/login.js 成功返回结构
    if (username === 'admin' && password === '123456') {
      localStorage.setItem('token', token);
      return { data: { code: 200, msg: '登录成功', token, data: { id: '101', username: 'admin', footprints: 0, favorites: 0, coins: 0, points: 0 } } };
    }
    return { data: { code: 400, msg: '用户名或密码错误' } };
  }
  return axios.post('/login', { token });
};
