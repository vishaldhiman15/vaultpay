import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Bot, Send, User, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useAccounts, useTransactions } from '@/hooks/useAccounts';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const SUGGESTIONS = [
  "What is my current balance?",
  "Analyze my recent spending",
  "How can I save more this month?",
  "Did my last transaction succeed?"
];

export function AiAdvisorPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to VaultAI. I am your hyper-intelligent financial companion. How can I illuminate your finances today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { data: accounts } = useAccounts();
  const { data: transactions } = useTransactions();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API key is missing');

      const genAI = new GoogleGenerativeAI(apiKey);
      
      const systemInstruction = `You are VaultAI, an ultra-advanced, futuristic AI financial advisor. 
Keep responses highly insightful, concise, and professional but with a sleek, futuristic tone. Use markdown formatting to make it beautiful (bold text, lists).
User name: ${user?.name || 'User'}
Accounts: ${JSON.stringify(accounts?.map(a => ({ id: a.id, type: a.type, balance: a.balance, currency: a.currency })) || [])}
Recent Transactions: ${JSON.stringify(transactions?.slice(0, 5).map(t => ({ amount: t.amount, type: t.type, status: t.status, date: t.createdAt })) || [])}`;

      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction
      });
      
      const historyMessages = messages.filter((m, i) => !(i === 0 && m.role === 'assistant'));
      const history = historyMessages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(text);
      const response = await result.response;
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.text() }]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'An anomaly occurred in the neural network. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] w-full flex flex-col items-center justify-center p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col h-[85vh]">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent rounded-full blur-md animate-pulse" />
            <div className="relative h-12 w-12 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-xl">
              <Sparkles className="text-accent h-6 w-6" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">VaultAI</h1>
            <p className="text-muted-foreground text-sm font-medium">Neural Financial Intelligence</p>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <Card className="flex-1 flex flex-col bg-black/40 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden rounded-3xl">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(var(--accent),0.2)]">
                      <Bot size={20} className="text-accent" />
                    </div>
                  )}
                  <div className={`p-5 rounded-3xl max-w-[85%] text-[15px] leading-relaxed shadow-xl backdrop-blur-md
                    ${msg.role === 'user' 
                      ? 'bg-primary/90 text-primary-foreground rounded-br-sm border border-primary/50' 
                      : 'bg-white/5 border border-white/10 text-foreground/90 rounded-bl-sm'}`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 max-w-none">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 relative">
                  <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
                  <Bot size={20} className="text-accent" />
                </div>
                <div className="p-5 rounded-3xl rounded-bl-sm bg-white/5 border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-6 pb-2 flex flex-wrap gap-2"
            >
              {SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(suggestion)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  {suggestion}
                  <ArrowRight size={12} className="opacity-50" />
                </button>
              ))}
            </motion.div>
          )}

          {/* Input Area */}
          <div className="p-6 pt-4 bg-gradient-to-t from-black/60 to-transparent">
            <div className="relative flex items-center group">
              <Input 
                className="w-full bg-black/40 border-white/20 text-white placeholder:text-white/30 rounded-full py-6 pl-6 pr-16 shadow-inner focus:ring-2 focus:ring-accent/50 transition-all text-base" 
                placeholder="Ask your neural advisor..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              />
              <Button 
                onClick={() => handleSend(input)} 
                disabled={loading || !input.trim()} 
                className="absolute right-2 rounded-full w-10 h-10 p-0 bg-accent hover:bg-accent/80 text-black shadow-[0_0_15px_rgba(var(--accent),0.4)] disabled:opacity-50 disabled:shadow-none transition-all"
              >
                {loading ? <Loader2 size={18} className="animate-spin text-black" /> : <Send size={18} className="ml-1" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
