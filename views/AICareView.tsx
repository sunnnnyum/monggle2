
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getAIInterpretation } from '../services/geminiService';

const AICareView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: '안녕하세요! 몽글의 악몽 해석 봇입니다. 어떤 꿈을 꾸셨나요? 키워드로 불안을 짚어드릴게요.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const interpretation = await getAIInterpretation(currentInput);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: interpretation,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-softGray">
      <header className="p-6 bg-white border-b border-gray-100 flex flex-col items-center">
        <div className="w-12 h-12 bg-secondary rounded-[1.2rem] flex items-center justify-center text-white text-xl mb-2 shadow-lg shadow-secondary/20">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <h1 className="text-xl font-bold text-dark tracking-tight">악몽 해석 봇</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Dream Interpretation</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
              m.role === 'user' 
                ? 'bg-primary text-dark rounded-tr-none font-bold' 
                : 'bg-white text-dark rounded-tl-none border border-gray-100 font-medium'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-gray-100 flex gap-1">
              <div className="w-1.5 h-1.5 bg-secondary/30 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-secondary/60 rounded-full animate-bounce delay-150"></div>
              <div className="w-1.5 h-1.5 bg-secondary/90 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 bg-softGray p-2 rounded-2xl border border-gray-200 focus-within:border-primary transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="어떤 꿈을 꿨는지 알려줘..."
            className="flex-1 bg-transparent py-2 px-3 outline-none text-sm font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${input.trim() && !loading ? 'bg-primary text-dark shadow-lg shadow-primary/20 active:scale-90' : 'bg-gray-200 text-gray-400'}`}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICareView;
