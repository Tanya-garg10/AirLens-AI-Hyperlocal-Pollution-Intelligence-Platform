import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Maximize2, 
  Minimize2, 
  CornerDownLeft, 
  Mic, 
  ExternalLink,
  ShieldAlert,
  Flame,
  Wind,
  CheckCircle2,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { CityRegion, CopilotMessage } from '../types';

interface AirLensCopilotProps {
  city: CityRegion;
  isOpen: boolean;
  onToggle: () => void;
  onNavigateToTab?: (tab: any) => void;
  onSelectReportId?: (reportId: string) => void;
}

const PRESET_QUERIES = [
  { label: 'Pending high-priority reports', text: 'Show all pending high-priority incidents in my city.' },
  { label: 'Mere area mein kitni reports hain?', text: 'Mere area mein kitni recent pollution reports aayi hain?' },
  { label: 'Active Hotspots breakdown', text: 'What are the main spatial pollution hotspots active right now?' },
  { label: 'Downwind smoke drift summary', text: 'Which residential areas are downwind of active biomass fires?' },
];

export function AirLensCopilot({
  city,
  isOpen,
  onToggle,
  onNavigateToTab,
  onSelectReportId
}: AirLensCopilotProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **AirLens AI Copilot**, your real-time environmental intelligence assistant for **${city.name}**.\n\nI have direct access to live citizen reports, Open-Meteo meteorological vectors, and spatial cluster algorithms. You can ask me questions in **English**, **Hindi**, or **Hinglish**!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSimulated: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await api.askCopilot(textToSend, city.id);
      const assistantMsg: CopilotMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedReports: result.groundedReports,
        isSimulated: result.is_simulated
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: CopilotMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an issue analyzing telemetry data: ${err.message || 'Network error'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#0C1513] to-[#123C30] border border-[#5CF2B2]/40 shadow-2xl shadow-[#5CF2B2]/20 hover:border-[#5CF2B2] hover:shadow-[0_0_25px_rgba(92,242,178,0.3)] transition-all duration-300 text-left cursor-pointer"
          title="Open AirLens AI Copilot"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#5CF2B2]/20 text-[#5CF2B2]">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#5CF2B2] ring-2 ring-[#071713]" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-heading font-bold text-[#F4F8F5]">AirLens Copilot</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#5CF2B2]/20 text-[#5CF2B2]">AI</span>
            </div>
            <span className="text-[10px] font-mono text-[#8A9A92] block">
              Ask about {city.name} conditions
            </span>
          </div>
        </button>
      )}

      {/* Slide-over Copilot Drawer / Modal */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-[#0C1513] border border-[#5CF2B2]/30 shadow-2xl shadow-black/80 ${
            isExpanded 
              ? 'inset-4 sm:inset-10 md:inset-16 rounded-3xl' 
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[640px] max-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="p-4 px-5 border-b border-[#5CF2B2]/15 flex items-center justify-between bg-[#071713]/80 rounded-t-3xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#123C30] border border-[#5CF2B2]/30 flex items-center justify-center text-[#5CF2B2]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-heading font-bold text-[#F4F8F5]">
                    AirLens AI Copilot
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#5CF2B2]/20 text-[#5CF2B2] border border-[#5CF2B2]/30">
                    LIVE GROUNDED
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[#8A9A92]">
                  {city.name} Environmental Intelligence Stream
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-xl text-[#8A9A92] hover:text-[#F4F8F5] hover:bg-[#123C30]/50 transition-colors"
                title={isExpanded ? 'Restore size' : 'Expand panel'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-xl text-[#8A9A92] hover:text-[#FF6B65] hover:bg-[#123C30]/50 transition-colors"
                title="Close Copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Query Pills */}
          <div className="px-4 py-2.5 bg-[#071713]/50 border-b border-[#5CF2B2]/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A9A92] shrink-0">
              Suggestions:
            </span>
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(preset.text)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#123C30]/60 hover:bg-[#123C30] text-[#A6C7B5] hover:text-[#5CF2B2] border border-[#5CF2B2]/20 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-xl bg-[#123C30] border border-[#5CF2B2]/30 flex items-center justify-center shrink-0 text-[#5CF2B2] mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                      isAssistant
                        ? 'bg-[#0E1D19] border border-[#5CF2B2]/20 text-[#F4F8F5]'
                        : 'bg-[#5CF2B2] text-[#071713] font-medium ml-auto shadow-md'
                    }`}
                  >
                    <div className="prose prose-invert prose-xs max-w-none
                      [&_strong]:text-[#5CF2B2] [&_strong]:font-bold
                      [&_em]:text-[#A6C7B5] [&_em]:italic
                      [&_h1]:text-[#F4F8F5] [&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-2 [&_h1]:mb-1
                      [&_h2]:text-[#F4F8F5] [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1
                      [&_h3]:text-[#5CF2B2] [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:mt-1.5 [&_h3]:mb-0.5
                      [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-0.5 [&_ul]:my-1
                      [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-0.5 [&_ol]:my-1
                      [&_li]:text-[#F4F8F5]
                      [&_code]:bg-[#123C30] [&_code]:text-[#5CF2B2] [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[11px] [&_code]:font-mono
                      [&_pre]:bg-[#0C1513] [&_pre]:border [&_pre]:border-[#5CF2B2]/20 [&_pre]:rounded-lg [&_pre]:p-2 [&_pre]:overflow-x-auto [&_pre]:my-1
                      [&_blockquote]:border-l-2 [&_blockquote]:border-[#5CF2B2]/50 [&_blockquote]:pl-3 [&_blockquote]:text-[#8A9A92] [&_blockquote]:my-1
                      [&_p]:my-0.5 [&_p]:leading-relaxed
                      [&_a]:text-[#5CF2B2] [&_a]:underline
                      [&_hr]:border-[#5CF2B2]/20 [&_hr]:my-2">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    {/* Grounded Incident Citations */}
                    {isAssistant && msg.groundedReports && msg.groundedReports.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-[#5CF2B2]/15 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono text-[#8A9A92]">Grounded Reports:</span>
                        {msg.groundedReports.map((repId) => (
                          <button
                            key={repId}
                            onClick={() => {
                              onSelectReportId?.(repId);
                              onNavigateToTab?.('authority');
                            }}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#123C30] hover:bg-[#5CF2B2] text-[#5CF2B2] hover:text-[#071713] border border-[#5CF2B2]/30 flex items-center gap-1 transition-colors"
                          >
                            <span>{repId}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] font-mono opacity-60 pt-1">
                      <span>{msg.timestamp}</span>
                      {isAssistant && msg.isSimulated && (
                        <span>Offline Grounded Fallback</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-center">
                <div className="w-7 h-7 rounded-xl bg-[#123C30] border border-[#5CF2B2]/30 flex items-center justify-center shrink-0 text-[#5CF2B2]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#0E1D19] border border-[#5CF2B2]/20 text-[#8A9A92] flex items-center gap-2 text-xs">
                  <span>Consulting Gemini & regional telemetry models...</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2B2] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2B2] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5CF2B2] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="px-4 py-2 border-t border-[#5CF2B2]/10 bg-[#071713]/40 flex items-center justify-between text-[11px]">
            <span className="text-[#8A9A92] font-mono">Quick Navigate:</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onNavigateToTab?.('simulator')}
                className="text-[#5CF2B2] hover:underline flex items-center gap-1"
              >
                <Wind className="w-3 h-3" />
                Spread Simulator
              </button>
              <span className="text-[#8A9A92]">•</span>
              <button 
                onClick={() => onNavigateToTab?.('authority')}
                className="text-[#5CF2B2] hover:underline flex items-center gap-1"
              >
                <ShieldAlert className="w-3 h-3" />
                Authority Center
              </button>
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#071713] border-t border-[#5CF2B2]/20 rounded-b-3xl">
            <div className="relative flex items-center">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask AirLens Copilot about pollution in ${city.name} (English / हिन्दी)...`}
                rows={1}
                disabled={isLoading}
                className="w-full pl-4 pr-24 py-3 bg-[#0C1513] border border-[#5CF2B2]/25 focus:border-[#5CF2B2] rounded-2xl text-xs text-[#F4F8F5] placeholder-[#8A9A92] resize-none outline-none transition-colors"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 rounded-xl bg-[#5CF2B2] text-[#071713] disabled:opacity-40 hover:brightness-110 transition-all cursor-pointer"
                  title="Send message (Enter)"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
