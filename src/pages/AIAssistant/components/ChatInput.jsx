import { THEME_COLOR } from '@/constants/theme';

export default function ChatInput({
  input,
  setInput,
  handleSend,
  loading,
  onKeyDown,
  inputRef,
  onFocusScroll,
}) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 'calc(var(--tabbar-h) + env(safe-area-inset-bottom))',
        background: '#fff',
        padding: '8px 0',
        display: 'flex',
        gap: 8,
        zIndex: 5,
        borderTop: '1px solid #eee',
      }}
    >
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocusScroll}
        rows={2}
        placeholder="请输入内容，回车发送（Shift+Enter 换行）"
        style={{
          flex: 1,
          resize: 'none',
          padding: 8,
          borderRadius: 6,
          border: '1px solid #ddd',
        }}
      />
      <button
        onClick={handleSend}
        disabled={loading || !input.trim()}
        style={{
          minWidth: 88,
          border: 'none',
          background: loading || !input.trim() ? '#ccc' : THEME_COLOR,
          color: '#fff',
          borderRadius: 6,
          cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
        }}
      >
        发送
      </button>
    </div>
  );
}