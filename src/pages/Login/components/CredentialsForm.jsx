import { Form, Input, Button } from 'react-vant';

export default function CredentialsForm({
  username,
  password,
  setUsername,
  setPassword,
  loading,
  canSubmit,
  onSubmit,
  brandColor,
}) {
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
}