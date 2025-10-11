'use client';

import * as React from 'react';

type Message = { 
  role: string; 
  content: string; 
  id: string;
  timestamp: number;
  error?: boolean;
};

export default function ChatWidgetPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('dave-chat-messages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage
  React.useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('dave-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to clear input
      if (e.key === 'Escape' && input) {
        setInput('');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input, 
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message, 
        id: (Date.now() + 1).toString(),
        timestamp: Date.now()
      }]);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get response. Please try again.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try sending your message again.', 
        id: (Date.now() + 1).toString(),
        timestamp: Date.now(),
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastMessage = () => {
    // Find the last user message and resubmit
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      // Remove error message
      setMessages(prev => prev.filter(m => !m.error));
      // Resubmit
      setInput(lastUserMessage.content);
      setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 0);
    }
  };

  const handleClose = () => {
    // Send message to parent window to close the widget
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'CLOSE_CHAT_WIDGET' }, '*');
    }
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('dave-chat-messages');
    setError(null);
  };

  const formatMessage = (content: string) => {
    // Enhanced markdown-like formatting with links and lists
    let formatted = content;
    
    // Convert markdown links [text](url) to HTML
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline;">$1</a>');
    
    // Convert plain URLs to clickable links
    formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline;">$1</a>');
    
    // Convert email addresses to mailto links
    formatted = formatted.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, '<a href="mailto:$1" style="color: #60a5fa; text-decoration: underline;">$1</a>');
    
    // Bold text **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic text *text*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert bullet points (•, -, *) at start of line to proper list items
    formatted = formatted.replace(/^[•\-\*]\s+(.+)$/gm, '<span style="display: block; padding-left: 12px; position: relative;"><span style="position: absolute; left: 0;">•</span>$1</span>');
    
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br />');
    
    return formatted;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        /* Mobile responsive styles */
        @media (max-width: 400px) {
          .chat-widget-container {
            height: 100vh !important;
            height: 100dvh !important;
            border-radius: 0 !important;
            border: none !important;
          }
        }
        
        /* Custom scrollbar for webkit browsers */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }
        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .messages-container::-webkit-scrollbar-thumb {
          background: #727b95;
          border-radius: 3px;
        }
        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
      <div 
        className="chat-widget-container"
        style={{ 
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', 
          height: 540,
          maxHeight: '100vh',
          display: 'flex', 
          flexDirection: 'column', 
          background: '#0c0f19', 
          color: '#e5e8ee', 
          border: '1px solid #727b95',
          position: 'relative'
        }}
      >
      {/* Header with controls */}
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid #727b95', 
        fontWeight: 600, 
        color: '#e5e8ee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>DAVE:5000</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              style={{
                fontSize: 11,
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #727b95',
                background: 'transparent',
                color: '#e5e8ee',
                cursor: 'pointer',
                opacity: 0.7,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              Clear
            </button>
          )}
          <button
            onClick={handleClose}
            aria-label="Close chat"
            style={{
              fontSize: 18,
              padding: '4px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              color: '#e5e8ee',
              cursor: 'pointer',
              opacity: 0.7,
              transition: 'all 0.2s',
              lineHeight: 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.background = '#1a1d2e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages container */}
      <div 
        ref={messagesContainerRef} 
        className="messages-container"
        style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: 16,
          scrollBehavior: 'smooth'
        }}
      >
        {messages.length === 0 && (
          <div style={{ opacity: .7, fontSize: 14, color: '#e5e8ee' }}>
            <p style={{ marginBottom: 12 }}>👋 Hi! I&apos;m DAVE:5000.</p>
            <p>Ask about experience, tools, projects, or availability.</p>
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} style={{ 
            fontSize: 14, 
            padding: '10px 12px', 
            marginBottom: 12, 
            background: m.role === 'user' ? '#111522' : (m.error ? '#2d1a1a' : 'transparent'), 
            borderRadius: 12, 
            border: m.role === 'user' ? '1px solid #727b95' : (m.error ? '1px solid #ef4444' : 'none'),
            color: '#e5e8ee'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <strong style={{ fontSize: 13, color: m.error ? '#ef4444' : '#e5e8ee' }}>
                {m.role === 'user' ? 'You' : 'DAVE:5000'}
              </strong>
              <span style={{ fontSize: 10, opacity: 0.5 }}>{formatTime(m.timestamp)}</span>
            </div>
            <div 
              style={{ lineHeight: 1.5, wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }}
            />
            {m.error && (
              <button
                onClick={retryLastMessage}
                disabled={isLoading}
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 8,
                  border: '1px solid #ef4444',
                  background: 'transparent',
                  color: '#ef4444',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: isLoading ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.background = '#3d1a1a';
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.currentTarget.style.background = 'transparent';
                }}
              >
                🔄 Retry
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ 
            fontSize: 13, 
            opacity: .6, 
            color: '#e5e8ee',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span>DAVE:5000 is typing</span>
            <span style={{ 
              display: 'inline-flex',
              gap: 2
            }}>
              <span style={{ animation: 'pulse 1.4s ease-in-out infinite' }}>.</span>
              <span style={{ animation: 'pulse 1.4s ease-in-out 0.2s infinite' }}>.</span>
              <span style={{ animation: 'pulse 1.4s ease-in-out 0.4s infinite' }}>.</span>
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick replies */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 6, 
        padding: '10px 12px', 
        borderTop: '1px solid #727b95',
        maxHeight: '80px',
        overflow: 'auto'
      }}>
        {[
          "What's your experience?",
          "What tools do you use?",
          "Tell me about your projects",
          "Are you available for work?"
        ].map((q) => (
          <button
            key={q}
            type="button"
            disabled={isLoading}
            onClick={async () => {
              if (isLoading) return;
              setInput(q);
              // Trigger the form submission directly
              setTimeout(() => {
                formRef.current?.requestSubmit();
              }, 0);
            }}
            style={{ 
              fontSize: 12, 
              padding: '6px 12px', 
              borderRadius: 16, 
              border: '1px solid #727b95', 
              background: 'transparent',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              color: '#e5e8ee',
              opacity: isLoading ? 0.5 : 1,
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#040711';
                e.currentTarget.style.color = '#e5e8ee';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#e5e8ee';
              }
            }}
          >
            {q}
          </button>
        ))}
      </div>
      
      {/* Input form */}
      <form 
        ref={formRef} 
        onSubmit={handleSubmit} 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 6, 
          padding: 12, 
          borderTop: '1px solid #727b95',
          background: '#0c0f19'
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type a message…" 
            aria-label="Message"
            disabled={isLoading}
            maxLength={500}
            autoComplete="off"
            style={{ 
              flex: 1, 
              fontSize: 14, 
              padding: '10px 12px', 
              borderRadius: 10, 
              border: '1px solid #727b95',
              background: '#111522',
              color: '#e5e8ee',
              outline: 'none',
              transition: 'border-color 0.2s',
              minWidth: 0
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#9ca3af'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#727b95'}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            style={{ 
              fontSize: 14, 
              padding: '10px 20px', 
              borderRadius: 10, 
              background: input.trim() && !isLoading ? '#040711' : '#1a1d2e', 
              color: '#e5e8ee', 
              border: '1px solid #727b95', 
              cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
              opacity: (!input.trim() || isLoading) ? .5 : 1,
              transition: 'all 0.2s',
              fontWeight: 500,
              minWidth: '60px',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !isLoading) {
                e.currentTarget.style.background = '#0a0e1f';
              }
            }}
            onMouseLeave={(e) => {
              if (input.trim() && !isLoading) {
                e.currentTarget.style.background = '#040711';
              }
            }}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
        
        {/* Character counter - show when approaching limit */}
        {input.length > 400 && (
          <div style={{ 
            fontSize: 11, 
            color: input.length > 480 ? '#ef4444' : '#9ca3af',
            textAlign: 'right',
            paddingRight: 4
          }}>
            {input.length}/500
          </div>
        )}
      </form>
      </div>
    </>
  );
}
