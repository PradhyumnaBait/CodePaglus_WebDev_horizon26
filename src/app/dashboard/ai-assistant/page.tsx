'use client';

// ============================================================
// OpsPulse — AI Assistant Chat Interface (Task 3)
// Modern two-pane layout: left history sidebar + right chat area
// Colors, typography, and class conventions match existing design
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Zap, BarChart3, Package, DollarSign, AlertTriangle, Star } from 'lucide-react';
import { DashboardCard } from '@/components/cards/DashboardCard';

type Role = 'ai' | 'user';

interface Message {
  id:        string;
  role:      Role;
  content:   string;
  timestamp: Date;
}

// Quick-action prompts shown above the input bar
const QUICK_ACTIONS = [
  { label: 'Summarize Sales',       prompt: 'Summarize today\'s sales performance and key metrics.',      icon: BarChart3  },
  { label: 'Check Inventory',       prompt: 'What inventory items are running low or at risk?',            icon: Package   },
  { label: 'Analyse Cash Flow',     prompt: 'Analyse this week\'s cash flow trends and flag anomalies.',   icon: DollarSign },
  { label: 'Top 3 Priorities',      prompt: 'What are the top 3 business priorities I should act on now?', icon: Star       },
  { label: 'Active Alerts',         prompt: 'Summarize all active alerts and their severity.',             icon: AlertTriangle },
  { label: 'Best Margin Products',  prompt: 'Which products have the best profit margin right now?',       icon: Zap        },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id:        'welcome',
    role:      'ai',
    content:   "Hello! I'm your OpsPulse AI assistant.\n\nI have access to your live business data — inventory, sales, cash flow, and support metrics. Ask me anything about your business performance.",
    timestamp: new Date(),
  },
];

// Simulate a realistic AI response based on the user prompt
function getAIResponse(prompt: string): string {
  const lp = prompt.toLowerCase();
  if (lp.includes('sales') || lp.includes('revenue'))
    return "📊 **Sales Summary (Today)**\n\n- Total Revenue: ₹42,200 (+14.2% vs yesterday)\n- Orders: 4 transactions\n- Best-selling SKU: Blue Denim Jacket (₹8,400)\n- Peak hour: 2 PM – 4 PM\n\nRevenue is trending above your 7-day average. Consider extending the top-performing promotion.";
  if (lp.includes('inventory') || lp.includes('stock'))
    return "📦 **Inventory Alert Summary**\n\n- 3 SKUs below reorder point (Blue Denim L/XL, Canvas Sneakers)\n- Estimated stock-out in <2 hours for Blue Denim XL\n- Suggested reorder: 50 units @ ₹340/unit from Supplier A\n\nWould you like me to draft the emergency purchase order?";
  if (lp.includes('cash') || lp.includes('flow'))
    return "💰 **Cash Flow Analysis (7-day)**\n\n- Inflow: ₹2.8L | Outflow: ₹1.9L | Net: +₹90K\n- Tuesday had the highest single-day outflow (₹65K — restocking)\n- Forecast: Positive cash position for next 14 days\n\nNo critical anomalies detected. Your burn rate is stable.";
  if (lp.includes('alert') || lp.includes('crisis'))
    return "🚨 **Active Alerts (2 total)**\n\n1. **CRISIS** — Inventory: 22 SKUs projected to stock out within 2 hours (probability: 90%)\n2. **WARNING** — Support ticket surge: High-priority tickets 3× above normal rate (65%)\n\nThe inventory crisis requires immediate action. Should I trigger the Emergency Reorder workflow?";
  if (lp.includes('priority') || lp.includes('priorities'))
    return "⚡ **Top 3 Business Priorities Right Now**\n\n1. 🔴 **Trigger emergency supplier reorder** — 22 SKUs will hit zero stock in under 2 hours.\n2. 🟡 **Escalate support ticket queue** — 3× spike in high-priority tickets needs senior staff.\n3. 🟢 **Extend today's sales campaign** — Revenue is up 14% and momentum is strong.\n\nWant me to initiate War Room mode to act on priority #1?";
  if (lp.includes('margin'))
    return "💎 **Top Margin Products**\n\n1. Leather Wallet (81% margin) — ₹1,200 revenue today\n2. Canvas Tote Bag (74% margin) — ₹840 revenue today\n3. Ceramic Mug Set (69% margin) — trending upwards\n\nConsider promoting these in your next campaign for maximum profitability.";
  return `I've analysed your query: "*${prompt}*"\n\nBased on your current business data, I can provide insights on sales, inventory, cash flow, support, and alerts. Could you be more specific? For example:\n- "Why did sales drop last hour?"\n- "Which SKUs need restocking?"\n- "What's my net cash position?"`;
}

export default function AIAssistantPage() {
  const [messages, setMessages]     = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput]           = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const bottomRef                   = useRef<HTMLDivElement>(null);
  const inputRef                    = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id:        `u-${Date.now()}`,
      role:      'user',
      content:   trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing delay (800–1500ms)
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const aiMsg: Message = {
        id:        `a-${Date.now()}`,
        role:      'ai',
        content:   getAIResponse(trimmed),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in" style={{ height: '100%' }}>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-[#0F172A]">AI Assistant</h1>
          <p className="text-[12px] text-[#64748B] mt-1 flex items-center gap-1.5">
            <Bot size={12} />
            Powered by OpsPulse AI · Analysing real-time ops
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11.5px] font-600 text-[#10B981] bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse inline-block" />
            Live Context
          </span>
          <span className="flex items-center gap-1.5 text-[11.5px] font-600 text-[#2563EB] bg-[rgba(37,99,235,0.08)] border border-[rgba(37,99,235,0.18)] px-3 py-1 rounded-full">
            <Zap size={11} />
            Claude AI
          </span>
        </div>
      </div>

      {/* ── Main Chat Area ── */}
      <DashboardCard
        variant="flat"
        className="flex flex-col"
        style={{ height: 'calc(100vh - 240px)', minHeight: 480, padding: 0 } as any}
      >
        {/* Chat header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0]"
          style={{ borderRadius: '14px 14px 0 0', background: 'linear-gradient(90deg, #F8FAFC, #FFFFFF)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #1D4ED8, #6366F1)',
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              }}
            >
              <Bot size={16} style={{ color: 'white' }} />
            </div>
            <div>
              <p className="text-[13.5px] font-700 text-[#0F172A]" style={{ letterSpacing: '-0.02em' }}>
                OpsPulse AI
              </p>
              <p className="text-[11px] text-[#64748B]">10 queries remaining today</p>
            </div>
          </div>
          <div
            className="text-[11px] font-600 px-2.5 py-1 rounded-full border"
            style={{ color: '#6366F1', background: 'rgba(99,102,241,0.07)', borderColor: 'rgba(99,102,241,0.2)' }}
          >
            Pro Plan
          </div>
        </div>

        {/* Messages list */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ padding: '20px 24px', gap: 0 }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ marginBottom: 18 }}
              >
                {/* AI avatar */}
                {msg.role === 'ai' && (
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-xl"
                    style={{
                      width: 34, height: 34, marginTop: 2,
                      background: 'linear-gradient(135deg, #1D4ED8, #6366F1)',
                      boxShadow: '0 2px 8px rgba(37,99,235,0.2)',
                    }}
                  >
                    <Bot size={14} style={{ color: 'white' }} />
                  </div>
                )}

                {/* Bubble */}
                <div style={{ maxWidth: '75%' }}>
                  <div
                    style={{
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #1D4ED8, #2563EB)'
                        : '#FFFFFF',
                      color: msg.role === 'user' ? '#FFFFFF' : '#0F172A',
                      border: msg.role === 'user' ? 'none' : '1px solid #E2E8F0',
                      borderRadius: msg.role === 'user'
                        ? '16px 16px 4px 16px'
                        : '4px 16px 16px 16px',
                      padding: '12px 16px',
                      fontSize: 13.5,
                      lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                      boxShadow: msg.role === 'ai'
                        ? '0 2px 8px rgba(15,23,42,0.06)'
                        : '0 4px 14px rgba(37,99,235,0.25)',
                    }}
                  >
                    {msg.content}
                  </div>
                  <p
                    style={{
                      fontSize: 10.5,
                      color: '#94A3B8',
                      marginTop: 4,
                      textAlign: msg.role === 'user' ? 'right' : 'left',
                    }}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* User avatar */}
                {msg.role === 'user' && (
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-xl"
                    style={{
                      width: 34, height: 34, marginTop: 2,
                      background: 'linear-gradient(135deg, #0F172A, #334155)',
                    }}
                  >
                    <User size={14} style={{ color: 'white' }} />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
                style={{ marginBottom: 18 }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-xl"
                  style={{
                    width: 34, height: 34, marginTop: 2,
                    background: 'linear-gradient(135deg, #1D4ED8, #6366F1)',
                  }}
                >
                  <Bot size={14} style={{ color: 'white' }} />
                </div>
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '4px 16px 16px 16px',
                    padding: '14px 18px',
                    boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
                  }}
                >
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: 7, height: 7,
                          borderRadius: '50%',
                          background: '#94A3B8',
                          display: 'inline-block',
                          animation: `kPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* ── Input area (sticky bottom) ── */}
        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            padding: '14px 20px 18px',
            background: '#FFFFFF',
            borderRadius: '0 0 14px 14px',
          }}
        >
          {/* Quick action chips */}
          <div className="flex gap-2 flex-wrap" style={{ marginBottom: 12 }}>
            {QUICK_ACTIONS.map((qa) => {
              const QIcon = qa.icon;
              return (
                <button
                  key={qa.label}
                  onClick={() => sendMessage(qa.prompt)}
                  disabled={isTyping}
                  className="flex items-center gap-1.5 text-[11.5px] font-500 px-3 py-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-[#334155]"
                  style={{
                    transition: 'all 0.15s ease',
                    cursor: isTyping ? 'not-allowed' : 'pointer',
                    opacity: isTyping ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isTyping) {
                      e.currentTarget.style.background = '#EFF6FF';
                      e.currentTarget.style.borderColor = '#BFDBFE';
                      e.currentTarget.style.color = '#2563EB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.color = '#334155';
                  }}
                >
                  <QIcon size={11} />
                  {qa.label}
                </button>
              );
            })}
          </div>

          {/* Text input row */}
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about your business..."
              rows={1}
              disabled={isTyping}
              className="inputField flex-1 resize-none text-[13.5px]"
              style={{
                minHeight: 42, maxHeight: 120,
                lineHeight: 1.5,
                paddingTop: 10, paddingBottom: 10,
                overflowY: 'auto',
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="btnPrimary flex-shrink-0"
              style={{
                width: 42, height: 42,
                padding: 0,
                borderRadius: 12,
                justifyContent: 'center',
                opacity: !input.trim() || isTyping ? 0.4 : 1,
                cursor: !input.trim() || isTyping ? 'not-allowed' : 'pointer',
              }}
            >
              <Send size={15} />
            </button>
          </div>
          <p style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 8 }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </DashboardCard>
    </div>
  );
}
