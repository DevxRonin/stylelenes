'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Send, Bot, User, ShoppingBag, ArrowRight, Check, RotateCcw, ShieldCheck } from 'lucide-react';
import { sendAIChat } from '../../lib/api';
import { useCart } from '../../lib/cartContext';

export default function AIAssistantPage() {
  const { addToCart } = useCart();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Greetings. I am your StyleLens AI Optical Stylist. Whether you are looking for timeless polarized aviators under ₹999, executive business spectacles, or eyewear sculpted for your facial profile, I am here to assist.',
      results: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const chatBottomRef = useRef(null);

  const sampleQuestions = [
    'Suggest the best sunglasses under ₹999.',
    'Which eyewear is best for daily use?',
    'Show premium black sunglasses.',
    'Recommend eyewear for formal occasions.',
    'What frames look best on a round face shape?',
    'Show me the 18K gold collection.',
  ];

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendQuery = async (queryText) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendAIChat(q);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: res.answer || 'Here are curated frames matching your optical aesthetic:',
          results: res.results || []
        }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Our styling atelier is momentarily busy. Please try asking again in a moment.',
          results: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    const pid = product._id || product.id;
    setAddedId(pid);
    setTimeout(() => setAddedId(null), 1800);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: 'Session refreshed. How may I assist your eyewear selection today?',
        results: []
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-xs text-[#C9A227] font-semibold mb-3">
          <Sparkles size={14} className="animate-spin" />
          <span>Haute AI Optical Concierge</span>
        </div>
        <h1 className="font-playfair text-3xl sm:text-5xl font-extrabold text-white">
          StyleLens AI Stylist
        </h1>
        <p className="text-xs sm:text-sm text-white/60 mt-2 font-light">
          Intelligent bespoke recommendations analyzing price, frame ergonomics, occasion, and facial architecture.
        </p>
      </div>

      {/* Main Chat Interface Container */}
      <div className="rounded-[28px] bg-[#121212] border border-[#C9A227]/30 shadow-2xl overflow-hidden flex flex-col h-[75vh] min-h-[550px]">
        {/* Salon Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1A1812] to-[#141414] border-b border-[#C9A227]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9F7C14] to-[#DFB83E] p-[2px]">
              <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center text-[#C9A227]">
                <Bot size={18} />
              </div>
            </div>
            <div>
              <h3 className="font-playfair text-sm sm:text-base font-bold text-white flex items-center gap-2">
                StyleLens Haute Intelligence
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              </h3>
              <p className="text-[11px] text-white/50">Trained on Italian Frame Craft & Optical Metrics</p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white transition-colors"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset Consultation</span>
          </button>
        </div>

        {/* Chat History Window */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#C9A227]/15 text-[#C9A227] flex items-center justify-center shrink-0 mt-1 border border-[#C9A227]/30">
                  <Sparkles size={15} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 rounded-[22px] ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#C9A227] to-[#DFB83E] text-black font-semibold rounded-tr-sm shadow-lg'
                    : 'bg-white/[0.04] text-white/90 border border-white/10 rounded-tl-sm space-y-4'
                }`}
              >
                <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>

                {/* Recommended Product Cards within Chat */}
                {msg.results && msg.results.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <p className="text-xs uppercase tracking-wider text-[#C9A227] font-bold">
                      Recommended Silhouettes From Catalog:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.results.map((prod) => {
                        const pid = prod._id || prod.id;
                        const isThisAdded = addedId === pid;
                        return (
                          <div
                            key={pid}
                            className="flex flex-col justify-between p-3.5 rounded-2xl bg-black/50 border border-white/10 hover:border-[#C9A227]/50 transition-colors shadow-md group"
                          >
                            <div className="flex gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-16 h-16 rounded-xl object-cover bg-black/40 border border-white/5 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                {prod.badge && (
                                  <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#C9A227] text-black font-bold">
                                    {prod.badge}
                                  </span>
                                )}
                                <h4 className="font-playfair text-xs sm:text-sm font-bold text-white truncate mt-1">
                                  {prod.name}
                                </h4>
                                <p className="text-xs text-[#C9A227] font-bold mt-0.5">
                                  ₹{prod.price.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
                              <button
                                onClick={() => handleQuickAdd(prod)}
                                className={`flex-1 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                                  isThisAdded
                                    ? 'bg-emerald-500 text-black'
                                    : 'cta-gradient text-black hover:shadow-md'
                                }`}
                              >
                                {isThisAdded ? (
                                  <>
                                    <Check size={13} />
                                    <span>Added</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag size={13} />
                                    <span>Add to Bag</span>
                                  </>
                                )}
                              </button>

                              <Link
                                href={`/product/${pid}`}
                                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1"
                              >
                                <span>Inspect</span>
                                <ArrowRight size={12} />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 mt-1">
                  <User size={15} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-white/50 text-xs italic pl-2">
              <Sparkles size={16} className="text-[#C9A227] animate-spin" />
              <span>Consulting StyleLens inventory and optical specs...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-[#0F0F0F] border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-white/40 uppercase tracking-wider shrink-0 pl-1">
            Try Asking:
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(q)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#C9A227]/20 border border-white/10 hover:border-[#C9A227]/40 text-xs text-white/80 hover:text-[#C9A227] transition-all whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="p-4 bg-[#141414] border-t border-white/10 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Ask anything: e.g. 'Suggest sunglasses under ₹999' or 'Best frames for square face'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-full text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#C9A227] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 rounded-full cta-gradient font-bold text-xs uppercase tracking-wider text-black disabled:opacity-40 flex items-center gap-2 hover:shadow-gold-glow transition-all"
          >
            <span>Send</span>
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
