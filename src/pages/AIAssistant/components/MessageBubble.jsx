import { THEME_COLOR } from '@/constants/theme';

export default function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 8,
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          padding: '8px 10px',
          borderRadius: 8,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
          userSelect: 'text',
          background: isUser ? THEME_COLOR : '#fff',
          color: isUser ? '#fff' : '#333',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        {content}
      </div>
    </div>
  );
}