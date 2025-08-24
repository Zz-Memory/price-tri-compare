import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Checkbox } from 'react-vant';
import { useUserStore } from '@/store/login';

const BRAND_COLOR = '#f04a31'; // 慢慢买风格橙红

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);

  const login = useUserStore((s) => s.login);

  // 轻量自定义 Toast
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const timerRef = useRef(null);
  const showToast = (message, type = 'success') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast({ visible: true, message, type });
    timerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
      timerRef.current = null;
    }, 3000);
  };
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const goBack = () => {
    navigate('/', { replace: true });
  };

  const onSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!username.trim() || !password.trim() || !agree) return; // 仅做是否为空与是否勾选协议校验
    if (loading) return;
    setLoading(true);
    try {
      const ret = await login({ username: username.trim(), password: password.trim() });
      if (ret?.success) {
        showToast(ret.msg || '登录成功', 'success');
        // 成功 3 秒后再跳转，保证提示完整显示
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 3000);
      } else {
        showToast(ret?.msg || '用户名或密码错误', 'fail');
      }
    } catch (err) {
      showToast('登录失败', 'fail');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !!username.trim() && !!password.trim() && agree;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 顶部关闭 */}
      <div className="h-12 flex items-center px-4">
        <button
          className="text-2xl leading-none text-gray-600"
          aria-label="close"
          onClick={goBack}
        >
          ×
        </button>
      </div>

      {/* 品牌区 */}
      <div className="px-8 flex flex-col items-center">
        <div
          className="text-4xl font-extrabold"
          style={{ color: BRAND_COLOR, letterSpacing: '2px' }}
        >
          货三家
        </div>
        <div className="text-sm text-gray-500 mt-1">买到 “全网真低价”</div>

        {/* 用户名/密码登录表单 */}
        <div className="w-full mt-4 p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-lg text-black-900 mb-3 text-center">欢迎您的登录</div>
          <Form onFinish={onSubmit}>
            <Form.Item name="username" rules={[{ required: true }]}>
              <Input
                value={username}
                onChange={setUsername}
                placeholder="请输入用户名"
                clearable
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true }]}>
              <Input
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="请输入密码"
                clearable
              />
            </Form.Item>
            <Button
              type="primary"
              block
              loading={loading}
              disabled={!canSubmit}
              style={{ background: BRAND_COLOR, borderColor: BRAND_COLOR, height: 44, borderRadius: 8 }}
              onClick={onSubmit}
            >
              登录
            </Button>
          </Form>
          <p className="text-xs text-gray-400 mt-2">测试账户：admin / 123456</p>
        </div>
        {/* 协议勾选 */}
        <div className="w-full mt-6 flex items-center text-xs text-gray-500">
          <Checkbox
            checked={agree}
            onChange={setAgree}
            iconSize={14}
            checkedColor={BRAND_COLOR}
            shape="square"
          />
          <span className="ml-2">
            我已阅读并同意
            <a className="text-gray-700 underline" href="#" onClick={(e) => e.preventDefault()}>用户服务协议</a>
            、<a className="text-gray-700 underline" href="#" onClick={(e) => e.preventDefault()}>隐私政策</a>
          </span>
        </div>
      </div>

      {/* 轻量 Toast */}
      {toast.visible && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 bottom-20 px-4 py-2 text-white text-sm rounded-lg shadow
            ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}

      <div className="mt-auto mb-6" />
    </div>
  );
}