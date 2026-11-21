'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Send, X, Bot, User, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { sendAIChat } from '../lib/api';
import { useCart } from '../lib/cartContext';

export default function AIAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Bonjour! I am your StyleLens AI Personal Stylist. Whether you desire handcrafted titanium aviators, Italian polarized shades, or daily ergonomic eyewear, ask me anything!',
      results: []
    }
  ]);
  const messagesEndRef = useRef(null);
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);

  const samplePrompts = [
    'Suggest the best sunglasses under ₹999',
    'Which eyewear is best for daily use?',
    'Show premium black sunglasses',
    'Recommend eyewear for formal occasions',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMessage = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await sendAIChat(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response.answer || 'Here are our premier recommendations tailored to your style vision:',
          results: response.results || []
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Apologies, our concierge is momentarily updating frames. Here are our premier picks:',
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

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#DFB83E] via-[#C9A227] to-[#9F7C14] text-[#0A0A0A] font-bold text-xs tracking-wide shadow-2xl hover:scale-105 transition-transform duration-300 group shadow-[#C9A227]/40"
          aria-label="Open AI Shopping Stylist"
        >
          <div className="w-6 h-6 rounded-full bg-[#0A0A0A] text-[#C9A227] flex items-center justify-center">
            <Sparkles size={13} className="animate-spin" />
          </div>
          <span className="hidden sm:inline">Ask AI Stylist</span>
        </button>
      )}

      {/* Floating Modal Assistant */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[620px] h-[85vh] bg-[#121212] border border-[#C9A227]/30 rounded-[22px] shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#1A1812] to-[#141414] border-b border-[#C9A227]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9F7C14] to-[#F9E79F] p-[2px]">
                <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center text-[#C9A227]">
                  <Sparkles size={14} />
                </div>
              </div>
              <div>
                <h3 className="font-playfair text-sm font-bold text-white flex items-center gap-1.5">
                  StyleLens AI Stylist
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                </h3>
                <p className="text-[10px] text-white/50">Curated Eyewear Concierge</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center shrink-0 mt-0.5 border border-[#C9A227]/30">
                    <Bot size={13} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#C9A227] to-[#DFB83E] text-black font-medium rounded-tr-sm'
                      : 'bg-white/[0.04] text-white/90 border border-white/10 rounded-tl-sm space-y-3'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Render Recommended Product Cards */}
                  {msg.results && msg.results.length > 0 && (
                    <div className="space-y-2 mt-2 pt-2 border-t border-white/10">
                      <p className="text-[10px] uppercase tracking-wider text-[#C9A227] font-bold">
                        Recommended Frames:
                      </p>
                      {msg.results.map((prod) => {
                        const pid = prod._id || prod.id;
                        const isThisAdded = addedId === pid;
                        return (
                          <div
                            key={pid}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-white/5 hover:border-[#C9A227]/40 transition-colors"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 object-cover rounded-lg shrink-0 border border-white/5"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-playfair text-xs font-semibold text-white truncate">
                                {prod.name}
                              </h5>
                              <p className="text-[11px] text-[#C9A227] font-bold">
                                ₹{prod.price.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleQuickAdd(prod)}
                                className={`p-1.5 rounded-full transition-colors ${
                                  isThisAdded ? 'bg-emerald-500 text-black' : 'bg-[#C9A227] text-black hover:bg-[#E5BF45]'
                                }`}
                                title="Add to Bag"
                              >
                                {isThisAdded ? <Check size={12} /> : <ShoppingBag size={12} />}
                              </button>
                              <Link
                                href={`/product/${pid}`}
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20"
                                title="View Details"
                              >
                                <ArrowRight size={12} />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User size={13} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-white/50 text-xs italic">
                <Sparkles size={14} className="text-[#C9A227] animate-spin" />
                <span>Consulting eyewear catalog & styling metrics...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2 border-t border-white/5 bg-[#0F0F0F] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#C9A227]/20 border border-white/10 hover:border-[#C9A227]/40 text-[10px] text-white/80 hover:text-[#C9A227] transition-all whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#141414] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask for face shape, price under ₹999, occasion..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder-white/40 focus:border-[#C9A227] focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2 rounded-full cta-gradient text-black disabled:opacity-50 transition-opacity"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
