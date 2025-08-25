import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/login';
import HeaderClose from './components/HeaderClose';
import BrandHeader from './components/BrandHeader';
import CredentialsForm from './components/CredentialsForm';
import AgreementCheck from './components/AgreementCheck';
import InlineToast from './components/InlineToast';

const BRAND_COLOR = '#f04a31'; // 慢慢买风格橙红

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from && location.state.from !== '/login') ? location.state.from : '/user';
  const backState = location.state?.backState;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);

  const login = useUserStore((s) => s.login);
  const isLogin = useUserStore((s) => s.isLogin);
  const hydrateStore = useUserStore((s) => s.hydrate);

  // 轻量自定义 Toast
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const timerRef = useRef(null);
  const navigatedRef = useRef(false);
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

  // 已登录访问 /login 时，重定向回来源页；若本地有 token 但未恢复，则先 hydrate（均保证只导航一次）
  useEffect(() => {
    if (isLogin) {
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        navigate(from, { replace: true, state: backState });
      }
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      (async () => {
        const ret = await hydrateStore();
        if (ret && ret.success && !navigatedRef.current) {
          navigatedRef.current = true;
          navigate(from, { replace: true, state: backState });
        }
      })();
    }
  }, [isLogin]);

  const goBack = () => {
    navigate('/', { replace: true });
  };

  const onSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!username.trim() || !password.trim() || !agree) return; // 非空 + 协议勾选校验
    if (loading) return;
    setLoading(true);
    try {
      const ret = await login({ username: username.trim(), password: password.trim() });
      if (ret?.success) {
        showToast(ret.msg || '登录成功', 'success');
        if (!navigatedRef.current) {
          navigatedRef.current = true;
          navigate(from, { replace: true, state: backState });
        }
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
      <HeaderClose onBack={goBack} />

      <div className="px-8 flex flex-col items-center">
        <BrandHeader brandColor={BRAND_COLOR} />

        <CredentialsForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          loading={loading}
          canSubmit={canSubmit}
          onSubmit={onSubmit}
          brandColor={BRAND_COLOR}
        />

        <AgreementCheck
          checked={agree}
          onChange={setAgree}
          brandColor={BRAND_COLOR}
        />
      </div>

      <InlineToast visible={toast.visible} message={toast.message} type={toast.type} />

      <div className="mt-auto mb-6" />
    </div>
  );
}