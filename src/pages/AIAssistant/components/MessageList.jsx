import MessageBubble from './MessageBubble';

export default function MessageList({ messages, loading, listRef, bottomRef }) {
  return (
    <div
      ref={listRef}
      style={{
        border: '1px solid #eee',
        borderRadius: 8,
        padding: 12,
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#fafafa',
        marginBottom: 12,
        userSelect: 'text',
      }}
    >
      {messages.map((m, i) => (
        <MessageBubble key={i} role={m.role} content={m.content} />
      ))}
      {loading && <div style={{ color: '#999', fontSize: 12 }}>对方正在输入…</div>}
      <div ref={bottomRef} />
    </div>
  );
}