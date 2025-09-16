import { useState } from 'react';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Welcome to DeFAI! Ready to optimize your portfolio?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    const userMessage = input;
    setInput('');
    
    // Add user message immediately
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 p-3 rounded ${
            msg.sender === 'bot' 
              ? 'bg-blue-50 text-blue-800 mr-4' 
              : 'bg-green-50 text-green-800 ml-4'
          }`}>
            <strong className="capitalize">{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        {loading && (
          <div className="bg-blue-50 text-blue-800 mr-4 mb-3 p-3 rounded">
            <strong>Bot:</strong> Thinking...
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="border border-gray-300 p-3 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
