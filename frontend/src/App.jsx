import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const askQuestion = async () => {
    if (!question.trim()) return;
    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      const aiMessage = { role: "ai", text: data.answer || "(No response)" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Error: " + err.message }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 px-4 py-2 rounded-2xl animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-700 bg-gray-900/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
          />
          <button
            onClick={askQuestion}
            disabled={loading}
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
