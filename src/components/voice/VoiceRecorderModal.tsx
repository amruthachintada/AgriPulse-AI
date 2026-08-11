'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Send, RotateCcw, Edit3, X } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendTranscript: (transcript: string) => void;
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onSendTranscript,
}) => {
  const {
    isListening,
    transcript,
    setTranscript,
    recordingDuration,
    errorMessage,
    startListening,
    stopListening
  } = useVoiceInput();

  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    if (transcript.trim().length > 0) {
      onSendTranscript(transcript);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-card border border-[#76B85A]/40 p-6 shadow-[0_0_50px_rgba(118,184,90,0.25)]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#76B85A]/20 flex items-center justify-center border border-[#76B85A]/40">
              <Mic className="w-4 h-4 text-[#76B85A]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#F7FAF4]">AgriPulse Voice Input</h3>
              <p className="text-xs text-[#A8C99A]">Speak naturally into your microphone</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopListening();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#EEF3E5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recording Controls */}
        <div className="flex flex-col items-center justify-center py-6 gap-4">
          
          {/* Pulsing Mic Circle */}
          <button
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? 'bg-gradient-to-tr from-red-600 to-amber-500 shadow-[0_0_40px_rgba(216,106,91,0.6)] scale-105'
                : 'bg-gradient-to-tr from-[#3D8B55] to-[#76B85A] shadow-[0_0_30px_rgba(118,184,90,0.4)] hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-[#F7FAF4] animate-pulse" />
            ) : (
              <Mic className="w-10 h-10 text-[#F7FAF4]" />
            )}

            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75" />
                <span className="absolute -inset-3 rounded-full border border-amber-400/50 animate-pulse" />
              </>
            )}
          </button>

          {/* Status & Timer */}
          <div className="text-center">
            <p className="text-sm font-bold text-[#F7FAF4]">
              {isListening ? '🎙 Listening...' : 'Tap Mic to Start Speaking'}
            </p>
            {isListening && (
              <p className="text-xs font-mono text-[#E8B85A] mt-1">
                Duration: 00:{recordingDuration < 10 ? `0${recordingDuration}` : recordingDuration}
              </p>
            )}
          </div>

          {/* Waveform Visualization */}
          {isListening && (
            <div className="flex items-center gap-1.5 h-8 mt-2">
              <span className="w-1.5 bg-[#76B85A] rounded-full animate-wave-bar" style={{ animationDelay: '0s' }} />
              <span className="w-1.5 bg-[#76B85A] rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 bg-[#E8B85A] rounded-full animate-wave-bar" style={{ animationDelay: '0.4s' }} />
              <span className="w-1.5 bg-[#76B85A] rounded-full animate-wave-bar" style={{ animationDelay: '0.1s' }} />
              <span className="w-1.5 bg-[#76B85A] rounded-full animate-wave-bar" style={{ animationDelay: '0.3s' }} />
            </div>
          )}

          {errorMessage && (
            <p className="text-xs text-[#E8B85A] bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 text-center">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Transcript Input Box */}
        {(transcript || isListening) && (
          <div className="mt-4 p-4 rounded-2xl bg-[#0B2A1D] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#A8C99A] tracking-wider uppercase">YOUR TRANSCRIPT</span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-[#76B85A] flex items-center gap-1 hover:underline"
              >
                <Edit3 className="w-3 h-3" />
                {isEditing ? 'Done Editing' : 'Edit Text'}
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full bg-[#123C29] p-3 rounded-xl border border-[#76B85A]/40 text-sm text-[#F7FAF4] focus:outline-none focus:ring-1 focus:ring-[#76B85A]"
                rows={3}
              />
            ) : (
              <p className="text-sm text-[#EEF3E5] italic">
                &quot;{transcript || 'Listening for speech...'}&quot;
              </p>
            )}

            {/* Action Buttons */}
            {transcript && !isListening && (
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={startListening}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#EEF3E5] flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Record Again
                </button>
                <button
                  onClick={handleSend}
                  className="px-4 py-2 rounded-xl gradient-btn-green text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(118,184,90,0.3)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Question
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
