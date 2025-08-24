import axios from '@/services/config'

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

export const getUser = () => {
  return axios.get('/user');
};

export const doLogin = async ({ username, password }) => {
  // 仅封装为 JWT，不在本地验证正确性
  const payload = { username, password, ts: Date.now() };
  const token = await signJwtHS256(payload, SECRET);
  return axios.post('/login', { token });
};
