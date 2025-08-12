import { useState, useRef, useEffect } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('chat'); // chat or sql
  const messagesEndRef = useRef(null);

  // Scroll to bottom smoothly whenever chat or loading changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  // Format current time as HH:MM for message timestamps
  const formatTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newUserMessage = { role: 'user', text: input, time: formatTime() };
    // Immediately add user message
    setChatHistory(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      if (mode === 'chat') {
        const res = await fetch('http://localhost:3002/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        });
        const data = await res.json();
        const botMsg = { role: 'bot', text: data.reply, time: formatTime() };
        setChatHistory(prev => [...prev, botMsg]);
      } else {
        // SQL mode — include updated history with new user message
        const updatedHistory = [...chatHistory, newUserMessage];
        const res = await fetch('http://localhost:3002/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: input,
            history: updatedHistory,
          }),
        });
        const data = await res.json();
        const botMsg = {
          role: 'bot',
          text: data.summary || JSON.stringify(data, null, 2) || 'No response from server.',
          time: formatTime(),
        };
        setChatHistory(prev => [...prev, botMsg]);
      }
    } catch (error) {
      const errorMsg = {
        role: 'bot',
        text: 'Oops! Something went wrong. Try again later.',
        time: formatTime(),
      };
      setChatHistory(prev => [...prev, errorMsg]);
      console.error('Send message error:', error);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">💬 Vertex AI Assistant</h1>
        <div className="flex border rounded-lg overflow-hidden">
          <button
            className={`px-4 py-2 ${mode === 'chat' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            onClick={() => setMode('chat')}
          >
            Chat Mode
          </button>
          <button
            className={`px-4 py-2 ${mode === 'sql' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            onClick={() => setMode('sql')}
          >
            SQL Mode
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xl px-5 py-3 rounded-lg shadow 
                ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              <div>{msg.text}</div>
              <div className="text-xs text-gray-400 mt-1 text-right">{msg.time}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 italic animate-pulse">
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="bg-white border-t p-4 flex items-center gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'chat' ? 'Ask me anything...' : 'Ask a DB question...'}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          aria-label="Send Message"
        >
          Send
        </button>
      </div>
    </div>
  );
}
