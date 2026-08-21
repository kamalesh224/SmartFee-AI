// agent-notes: { ctx: "Interactive RAG AI Assistant floating chat widget with knowledge citations and direct action triggers", deps: ["src/types/ragTypes.ts", "src/services/ragAssistantService.ts", "src/types.ts"], state: active, last: "antigravity@2026-08-21" }
import React, { useState, useRef, useEffect } from 'react';
import type { User, FeeItem, Transaction, AIRiskPrediction } from '../types';
import type { ChatMessage, KnowledgeChunk, RAGQueryOptions } from '../types/ragTypes';
import { processRAGQuery } from '../services/ragAssistantService';
import {
  Sparkles,
  Bot,
  User as UserIcon,
  X,
  Send,
  BookOpen,
  ChevronRight,
  ExternalLink,
  CreditCard,
  Receipt,
  AlertTriangle,
  RefreshCw,
  Info,
} from 'lucide-react';

interface RAGAssistantWidgetProps {
  currentUser: User;
  feeItems?: FeeItem[];
  transactions?: Transaction[];
  riskPredictions?: AIRiskPrediction[];
  onOpenPayment?: (feeItem: FeeItem) => void;
  onViewReceipt?: (txn: Transaction) => void;
  onNavigateToRisk?: () => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export const RAGAssistantWidget: React.FC<RAGAssistantWidgetProps> = ({
  currentUser,
  feeItems = [],
  transactions = [],
  riskPredictions = [],
  onOpenPayment,
  onViewReceipt,
  onNavigateToRisk,
  isOpenExternal,
  onCloseExternal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Sync external open request from Header
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseExternal) onCloseExternal();
  };

  // Selected knowledge chunk for citation inspector modal
  const [selectedChunk, setSelectedChunk] = useState<KnowledgeChunk | null>(null);

  // Initial welcome message
  const initialWelcomeText =
    currentUser.role === 'student'
      ? `Hello ${currentUser.name}! I am your **SmartFee RAG AI Assistant**.\n\nI am connected to the **Vaigai College / Anna University Institutional Handbook** and your active fee account. How can I help you today?`
      : `Welcome Dr. ${currentUser.name.split(' ').pop()}! I am your **SmartFee Financial RAG AI Assistant**.\n\nI can retrieve institutional fee policies, scholarship rules, installment guidelines, or summarize **AI Default Risk Predictions** across departments.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'MSG-INIT',
      sender: 'assistant',
      text: initialWelcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Suggested Prompts based on User Role
  const studentPrompts = [
    'What is my pending fee amount?',
    'What is the penalty for late fee payment?',
    'How to apply for merit fee scholarship?',
    'What is the fee refund policy?',
  ];

  const adminPrompts = [
    'Which students are High Default Risk?',
    'Explain the AI Default Risk scoring model',
    'How do installment payment approvals work?',
    'What is the late fee grace period policy?',
  ];

  const activePrompts = currentUser.role === 'student' ? studentPrompts : adminPrompts;

  const handleSendQuery = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim()) return;

    // 1. Append User Message
    const userMsg: ChatMessage = {
      id: `USER-MSG-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Prepare query options
    const pendingTotal = feeItems.filter((i) => i.status !== 'paid').reduce((a, c) => a + c.amount, 0);
    const options: RAGQueryOptions = {
      userRole: currentUser.role,
      studentName: currentUser.name,
      studentId: currentUser.id,
      pendingFeeTotal: pendingTotal,
      feeItems,
      recentTransactions: transactions,
      riskPredictions,
      topK: 3,
    };

    // 2. Process query via RAG Engine
    try {
      const assistantMsg = await processRAGQuery(query, options);
      // Simulate typing delay for smooth user experience
      setTimeout(() => {
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, 600);
    } catch (err) {
      console.error('RAG Query Error:', err);
      setIsTyping(false);
    }
  };

  const handleActionTrigger = (action: ChatMessage['actionTrigger']) => {
    if (!action) return;

    if (action.type === 'PAY_FEE' && onOpenPayment) {
      const feeToPay = feeItems.find((f) => f.id === action.feeId) || feeItems.find((f) => f.status !== 'paid') || feeItems[0];
      if (feeToPay) onOpenPayment(feeToPay);
    } else if (action.type === 'VIEW_RECEIPT' && onViewReceipt) {
      const txn = transactions[0];
      if (txn) onViewReceipt(txn);
    } else if (action.type === 'VIEW_RISK_ANALYTICS' && onNavigateToRisk) {
      onNavigateToRisk();
    }
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group border border-white/20"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
          </div>
          <span className="text-sm font-semibold tracking-wide hidden sm:inline">RAG AI Assistant</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/20 text-white font-bold border border-white/20">
            RAG v2.4
          </span>
        </button>
      )}

      {/* 2. EXPANDABLE CHAT DRAWER WINDOW */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden ${
            isExpanded
              ? 'inset-4 lg:inset-10 max-w-5xl mx-auto my-auto h-[90vh]'
              : 'bottom-4 right-4 w-full sm:w-[440px] h-[600px] max-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Header Bar */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">SmartFee RAG AI</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Grounded RAG
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Knowledge Corpus & Live Account Context Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all hidden sm:block"
                title={isExpanded ? 'Minimize Window' : 'Expand Window'}
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Ask RAG:
            </span>
            {activePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(prompt)}
                className="text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-blue-600/30 border border-slate-700/80 hover:border-blue-500/50 px-3 py-1 rounded-full whitespace-nowrap transition-all shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-indigo-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-md'
                  }`}
                >
                  {/* Message Content with simple Markdown rendering */}
                  <div className="whitespace-pre-line text-slate-100 font-sans leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Knowledge Sources / Citation Chips */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-400" /> Retrieved Context Sources:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((chunk) => (
                          <button
                            key={chunk.id}
                            onClick={() => setSelectedChunk(chunk)}
                            className="flex items-center gap-1 text-[10px] bg-slate-900/80 hover:bg-slate-700/90 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-md transition-all"
                            title="Click to view full knowledge document text"
                          >
                            <span>{chunk.sourceRef}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Action Trigger Button */}
                  {msg.actionTrigger && (
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => handleActionTrigger(msg.actionTrigger)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all border border-emerald-400/30"
                      >
                        {msg.actionTrigger.type === 'PAY_FEE' && <CreditCard className="w-4 h-4" />}
                        {msg.actionTrigger.type === 'VIEW_RECEIPT' && <Receipt className="w-4 h-4" />}
                        {msg.actionTrigger.type === 'VIEW_RISK_ANALYTICS' && <AlertTriangle className="w-4 h-4" />}
                        <span>{msg.actionTrigger.label}</span>
                      </button>
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-2 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-600/40 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4 text-blue-200" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 text-indigo-300 animate-spin" />
                </div>
                <div className="bg-slate-800/80 border border-slate-700/80 text-slate-400 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs">
                  <span>Searching vector index & synthesizing grounded answer...</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask RAG about ${currentUser.role === 'student' ? 'fees, late fines, refunds...' : 'default risk, compliance, policies...'}`}
              className="flex-1 bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 3. CITATION INSPECTOR MODAL */}
      {selectedChunk && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedChunk(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                  {selectedChunk.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">{selectedChunk.title}</h4>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed font-mono">
              <div className="text-[10px] text-slate-500 uppercase font-bold border-b border-slate-800 pb-1">
                Source: {selectedChunk.sourceRef}
              </div>
              <p className="whitespace-pre-line font-sans text-xs text-slate-200">{selectedChunk.content}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-wrap gap-1">
                {selectedChunk.tags.map((tag) => (
                  <span key={tag} className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedChunk(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 transition-all"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
