'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { 
  Bot, Send, Mic, Volume2, VolumeX, Image as ImageIcon, 
  Sparkles, Plus, Trash2, StopCircle
} from 'lucide-react';
import { Conversation, ChatMessage } from '@/types';
import { generateAssistantResponse } from '@/lib/ai/assistant';
import { ttsEngine } from '@/lib/speech/tts';
import { useScreenContext } from '@/context/ScreenContext';
import { VoiceRecorderModal } from '@/components/voice/VoiceRecorderModal';

export default function AssistantPage() {
  const { currentScreen, latestCropAnalysis, currentWeather, userFields } = useScreenContext();

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      title: 'Crop & Weather Help',
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg-1',
          sender: 'assistant',
          text: 'Hello Farmer! I am AgriPulse AI, your farming companion. How can I assist you with your crops, disease protection, or weather today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState('conv-1');
  const [inputText, setInputText] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  // Clean up audio playback when leaving page
  useEffect(() => {
    return () => {
      ttsEngine.stop();
    };
  }, []);

  const handleSendMessage = async (textToSend?: string, imageBase64?: string) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim() && !imageBase64) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageText,
      imageUrl: imageBase64,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...activeConv.messages, userMsg];
    
    setConversations(prev => prev.map(c => 
      c.id === activeConvId 
        ? { ...c, messages: updatedMessages, updatedAt: new Date().toISOString() }
        : c
    ));

    setInputText('');
    setIsThinking(true);

    try {
      const responseText = await generateAssistantResponse(
        messageText,
        updatedMessages,
        {
          activeScreen: currentScreen,
          latestCropAnalysis,
          currentWeather,
          userFields
        }
      );

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => prev.map(c => 
        c.id === activeConvId 
          ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: new Date().toISOString() }
          : c
      ));

      if (autoSpeak) {
        handlePlayAudio(responseText);
      }
    } catch (err) {
      console.error('Failed to get AI assistant answer', err);
    } finally {
      setIsThinking(false);
    }
  };

  const handlePlayAudio = (text: string) => {
    setIsPlayingAudio(true);
    ttsEngine.speak(
      text,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const handleStopAudio = () => {
    ttsEngine.stop();
    setIsPlayingAudio(false);
  };

  const handleCreateNewConv = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: `Conversation ${conversations.length + 1}`,
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: 'Hello Farmer! How can I assist you with your crops or weather today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newId);
  };

  const handleDeleteConv = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) return;
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    if (activeConvId === id) {
      setActiveConvId(filtered[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-[#071C14] flex">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-65px)]">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#76B85A] tracking-wider uppercase">🌱 AGRIPULSE ASSISTANT</span>
              <Badge variant="healthy">AI Farming Companion</Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-[#F7FAF4] mt-0.5">AgriPulse Assistant</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                autoSpeak
                  ? 'bg-[#76B85A]/20 text-[#76B85A] border-[#76B85A]/40'
                  : 'bg-white/5 text-[#EEF3E5]/60 border-white/10'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Auto Speak</span>
            </button>
          </div>
        </div>

        {/* Main Chat Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Conversation History Drawer (3 cols) */}
          <GlassCard className="hidden lg:flex flex-col lg:col-span-3 p-4 space-y-4">
            <button
              onClick={handleCreateNewConv}
              className="w-full py-2.5 rounded-xl gradient-btn-green font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(118,184,90,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>

            <span className="text-[10px] font-bold text-[#A8C99A] uppercase tracking-wider px-2">RECENT CHATS</span>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {conversations.map(c => (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                    c.id === activeConvId
                      ? 'bg-[#3D8B55]/30 border-[#76B85A]/50 text-[#F7FAF4]'
                      : 'bg-white/5 border-transparent text-[#EEF3E5]/70 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs font-semibold truncate">{c.title}</span>
                  {conversations.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteConv(c.id, e)}
                      className="p-1 text-[#EEF3E5]/40 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Chat Messages & Input (9 cols) */}
          <GlassCard className="lg:col-span-9 flex flex-col p-4 relative border-[#76B85A]/30">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-4">
              {activeConv.messages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                      isAssistant
                        ? 'bg-gradient-to-tr from-[#3D8B55] to-[#76B85A] text-[#F7FAF4] border-[#76B85A]'
                        : 'bg-[#123C29] text-[#76B85A] border-white/10'
                    }`}>
                      {isAssistant ? <Bot className="w-4 h-4" /> : '🌾'}
                    </div>

                    {/* Message Bubble */}
                    <div className={`max-w-[80%] space-y-2 ${
                      isAssistant ? 'items-start' : 'items-end'
                    }`}>
                      <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-[#0B2A1D] border-[#76B85A]/30 text-[#EEF3E5] rounded-tl-none'
                          : 'bg-[#3D8B55] border-[#76B85A]/50 text-[#F7FAF4] rounded-tr-none'
                      }`}>
                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            alt="Uploaded crop leaf"
                            className="max-w-xs rounded-xl mb-3 border border-white/20"
                          />
                        )}

                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>

                      {/* Controls Bar under Message */}
                      <div className="flex items-center gap-2 text-[10px] text-[#A8C99A] px-1">
                        <span>{msg.timestamp}</span>

                        {isAssistant && (
                          <button
                            onClick={() => isPlayingAudio ? handleStopAudio() : handlePlayAudio(msg.text)}
                            className="flex items-center gap-1 text-[#76B85A] hover:underline ml-2"
                          >
                            {isPlayingAudio ? (
                              <>
                                <StopCircle className="w-3 h-3 text-amber-400 animate-pulse" />
                                <span className="text-amber-400 font-bold">Stop Voice</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div className="flex items-center gap-3 text-xs text-[#76B85A]">
                  <div className="w-8 h-8 rounded-full bg-[#76B85A]/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 animate-spin text-[#76B85A]" />
                  </div>
                  <span className="italic animate-pulse">AgriPulse AI is analyzing your question...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                title="Speak Query via Microphone"
                className="p-3 rounded-xl bg-gradient-to-tr from-[#3D8B55] to-[#76B85A] text-[#F7FAF4] shadow-[0_0_15px_rgba(118,184,90,0.3)] hover:scale-105 transition-transform shrink-0"
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  const sampleImg = '/images/leaf_blight_sample.png';
                  handleSendMessage('Please analyze this crop leaf image.', sampleImg);
                }}
                title="Attach Crop Photo"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#EEF3E5] transition-all shrink-0"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask AgriPulse about your crop, disease, or weather..."
                className="glass-input flex-1 p-3 text-xs"
              />

              <button
                onClick={() => handleSendMessage()}
                className="p-3 rounded-xl gradient-btn-green font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </GlassCard>

        </div>

      </div>

      {/* English Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSendTranscript={(transcript) => handleSendMessage(transcript)}
      />
    </div>
  );
}
