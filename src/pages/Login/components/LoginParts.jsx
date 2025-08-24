import { Form, Input, Button, Checkbox } from 'react-vant';

export const HeaderClose = ({ onBack }) => {
  return (
    <div className="h-12 flex items-center px-4">
      <button
        className="text-2xl leading-none text-gray-600"
        aria-label="close"
        onClick={onBack}
      >
        ×
      </button>
    </div>
  );
};

export const BrandHeader = ({ brandColor }) => {
  return (
    <>
      <div
        className="text-4xl font-extrabold"
        style={{ color: brandColor, letterSpacing: '2px' }}
      >
        货三家
      </div>
      <div className="text-sm text-gray-500 mt-1">买到 “全网真低价”</div>
    </>
  );
};

export const CredentialsForm = ({
  username,
  password,
  setUsername,
  setPassword,
  loading,
  canSubmit,
  onSubmit,
  brandColor,
}) => {
  return (
    <div className="w-full mt-4 p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="text-lg text-black mb-3 text-center">欢迎您的登录</div>
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
          style={{ background: brandColor, borderColor: brandColor, height: 44, borderRadius: 8 }}
          onClick={onSubmit}
        >
          登录
        </Button>
      </Form>
      <p className="text-xs text-gray-400 mt-2">测试账户：admin / 123456</p>
    </div>
  );
};

export const AgreementCheck = ({ checked, onChange, brandColor }) => {
  return (
    <div className="w-full mt-6 flex items-center text-xs text-gray-500">
      <Checkbox
        checked={checked}
        onChange={onChange}
        iconSize={14}
        checkedColor={brandColor}
        shape="square"
      />
      <span className="ml-2">
        我已阅读并同意
        <a className="text-gray-700 underline" href="#" onClick={(e) => e.preventDefault()}>用户服务协议</a>
        、<a className="text-gray-700 underline" href="#" onClick={(e) => e.preventDefault()}>隐私政策</a>
      </span>
    </div>
  );
};

export const InlineToast = ({ visible, message, type }) => {
  if (!visible) return null;
  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 bottom-20 px-4 py-2 text-white text-sm rounded-lg shadow
        ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
};