import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageSquare, X, Send, Bot, User, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chatService from '../../services/chatService';
import { AuthContext } from '../../context/AuthContext';

const FloatingChatbot = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am Medica AI, your healthcare assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpen);
    return () => window.removeEventListener('open-chatbot', handleOpen);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const historyToAnalyze = [...messages, userMessage];
      const res = await chatService.sendChatMessage(historyToAnalyze);
      
      setMessages(prev => [...prev, { sender: 'bot', text: res.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'I am currently offline. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Medica AI Assistant</h3>
                <p className="text-[10px] opacity-80 uppercase tracking-widest font-semibold">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-muted/30 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-card border p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {user ? (
            <form onSubmit={handleSend} className="p-4 bg-card border-t flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-muted rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4 ml-1" />
              </button>
            </form>
          ) : (
            <div className="p-4 bg-card border-t">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  navigate('/login');
                }}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md"
              >
                <LogIn className="w-5 h-5" /> Login to Chat with AI
              </button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Authentication is required to use the assistant.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform hover:shadow-primary/50"
        >
          <MessageSquare className="w-7 h-7" />
        </button>
      )}
    </div>
  );
};

export default FloatingChatbot;
