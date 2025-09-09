import { THEME_COLOR } from '@/constants/theme';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  const commonStyle = {
    maxWidth: '80%',
    padding: '8px 10px',
    borderRadius: 8,
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    userSelect: 'text',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  };

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
          ...commonStyle,
          background: isUser ? THEME_COLOR : '#fff',
          color: isUser ? '#fff' : '#333',
          // 仅对用户消息保留 pre-wrap，助手用 Markdown 控制换行
          whiteSpace: isUser ? 'pre-wrap' : 'normal',
        }}
      >
        {isUser ? (
          content
        ) : (
          <div
            className="ai-markdown"
            style={{
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 style={{ fontSize: 20, margin: '8px 0 6px', lineHeight: 1.4 }} {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 style={{ fontSize: 18, margin: '8px 0 6px', lineHeight: 1.4 }} {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 style={{ fontSize: 16, margin: '8px 0 6px', lineHeight: 1.4 }} {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p style={{ margin: '6px 0' }} {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul style={{ paddingLeft: 20, margin: '6px 0' }} {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol style={{ paddingLeft: 20, margin: '6px 0' }} {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li style={{ margin: '2px 0' }} {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a style={{ color: THEME_COLOR, textDecoration: 'underline' }} target="_blank" rel="noreferrer" {...props} />
                ),
                code: ({ inline, children, ...props }) => {
                  if (inline) {
                    return (
                      <code
                        style={{
                          background: '#f6f8fa',
                          border: '1px solid #eee',
                          borderRadius: 4,
                          padding: '0 4px',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <pre
                      style={{
                        background: '#0f172a',
                        color: '#e2e8f0',
                        padding: 10,
                        borderRadius: 6,
                        overflowX: 'auto',
                      }}
                    >
                      <code
                        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}
                        {...props}
                      >
                        {children}
                      </code>
                    </pre>
                  );
                },
                table: ({ node, ...props }) => (
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        margin: '6px 0',
                        fontSize: 13,
                      }}
                      {...props}
                    />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th style={{ border: '1px solid #eee', background: '#f8f8f8', padding: '6px' }} {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td style={{ border: '1px solid #eee', padding: '6px' }} {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    style={{
                      borderLeft: '3px solid #e5e7eb',
                      margin: '6px 0',
                      padding: '4px 8px',
                      color: '#666',
                      background: '#fafafa',
                    }}
                    {...props}
                  />
                ),
                hr: ({ node, ...props }) => (
                  <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '8px 0' }} {...props} />
                ),
              }}
            >
              {String(content || '')}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}