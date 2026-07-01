import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChatbotPreview = () => {
  return (
    <section className="py-24 bg-card/50 border-y" id="ai-assistant">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Conversational AI Assistant</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Not sure about your symptoms? Chat naturally with our AI assistant. Describe how you feel, and it will intelligently extract symptoms and provide immediate preliminary guidance.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"><MessageSquare className="h-4 w-4" /></div>
                  <span className="font-medium">Natural language processing</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary"><Bot className="h-4 w-4" /></div>
                  <span className="font-medium">Instant symptom extraction</span>
                </li>
              </ul>
              
              <button onClick={() => window.dispatchEvent(new Event('open-chatbot'))} className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-md">
                Open AI Assistant
              </button>
            </motion.div>
          </div>

          <div className="lg:w-1/2 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-background rounded-2xl border shadow-2xl p-6 relative"
            >
              <div className="flex items-center gap-3 border-b pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold">MediCheck AI</h3>
                  <p className="text-xs text-green-500 font-medium">Online</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                    <p className="text-sm">I've had a strong fever for 2 days, and my head is pounding.</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted text-foreground p-3 rounded-2xl rounded-tl-sm max-w-[80%]">
                    <p className="text-sm">I have noted <span className="font-semibold text-primary">Fever</span> and <span className="font-semibold text-primary">Headache</span>. Do you also have any muscle pain or nausea?</p>
                  </div>
                </div>
                
                 <div className="flex gap-3 justify-end">
                  <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                    <p className="text-sm">Yes, severe muscle pain.</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted text-foreground p-3 rounded-2xl rounded-tl-sm max-w-[80%]">
                    <p className="text-sm">Based on Fever, Headache, and Muscle Pain, there is a high probability of <span className="font-bold text-destructive">Flu</span> or <span className="font-bold text-destructive">Dengue</span>. I highly recommend taking a Complete Blood Count (CBC) test.</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <input type="text" placeholder="Type your symptoms..." className="w-full bg-muted border-none rounded-full py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" disabled />
                <button className="absolute right-2 top-1.5 p-1.5 bg-primary rounded-full text-primary-foreground" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
                </button>
              </div>

            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ChatbotPreview;
