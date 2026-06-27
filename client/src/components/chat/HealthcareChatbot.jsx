import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Mic, MicOff, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import predictionService from '../../services/predictionService';

const HealthcareChatbot = ({ onPredictionComplete }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello 👋\n\nI am your AI Healthcare Assistant. I am here to help analyze your symptoms. How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const updatedHistory = [...messages, userMessage];
    
    setMessages(updatedHistory);
    setInput('');
    setIsTyping(true);

    try {
      const response = await predictionService.sendChatMessage(updatedHistory);
      
      if (response.type === 'chat') {
        setMessages([...updatedHistory, { sender: 'bot', text: response.text }]);
        speak(response.text);
      } else if (response.type === 'prediction') {
        setMessages([...updatedHistory, { sender: 'bot', text: "Thank you for the information. I have analyzed your symptoms and generated a prediction report." }]);
        speak("Thank you for the information. I have analyzed your symptoms and generated a prediction report.");
        
        // Pass the prediction back up to the parent to render the Medical Report UI
        setTimeout(() => {
          onPredictionComplete(response);
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      setMessages([...updatedHistory, { sender: 'bot', text: "I'm sorry, I encountered an error connecting to my systems. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListen = () => {
    if (!recognition) {
      alert("Your browser does not support Voice Recognition.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? prev + ' ' + transcript : transcript);
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Strip markdown before speaking (basic stripping)
      const cleanText = text.replace(/[*#_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col bg-card border rounded-2xl shadow-xl overflow-hidden h-[600px] w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-primary/5 border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
            <Bot className="text-primary-foreground w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">AI Health Assistant</h2>
            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-xs text-yellow-600 mb-6 text-center max-w-md mx-auto">
          <strong>Disclaimer:</strong> This is an AI-generated health assessment and is not a medical diagnosis. Please consult a qualified healthcare professional.
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.sender === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                  : 'bg-card text-card-foreground border shadow-sm rounded-tl-sm'
                }`}
              >
                {msg.sender === 'bot' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.text}</p>
                )}
                <span className={`text-[10px] block mt-2 opacity-70 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
             </div>
             <div className="bg-card border shadow-sm p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
               <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
               <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
               <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
             </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t">
        <div className="relative flex items-end gap-2">
          <button 
            onClick={toggleListen}
            className={`p-3 rounded-full shrink-0 transition-colors ${isListening ? 'bg-destructive text-destructive-foreground animate-pulse' : 'bg-muted hover:bg-muted/80'}`}
            title="Use Voice"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your symptoms (e.g., 'I have had a fever for 3 days...')"
              className="w-full bg-muted border-transparent rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[50px] max-h-[120px]"
              rows={1}
            />
          </div>
          
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-primary text-primary-foreground rounded-xl shrink-0 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthcareChatbot;
