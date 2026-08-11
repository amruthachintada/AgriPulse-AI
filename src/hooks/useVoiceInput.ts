'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { WebSpeechRecognizer } from '@/lib/speech/stt';

export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognizerRef = useRef<WebSpeechRecognizer | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    recognizerRef.current = new WebSpeechRecognizer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognizerRef.current) recognizerRef.current.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    setErrorMessage(null);
    setTranscript('');
    setRecordingDuration(0);

    if (!recognizerRef.current || !recognizerRef.current.isSupported()) {
      setErrorMessage('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);

    setIsListening(true);

    recognizerRef.current.start(
      (text, _isFinal) => {
        setTranscript(text);
      },
      (err) => {
        setErrorMessage(`Microphone notice: ${err}`);
        setIsListening(false);
        if (timerRef.current) clearInterval(timerRef.current);
      },
      () => {
        setIsListening(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    );
  }, []);

  const stopListening = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }
    setIsListening(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    isListening,
    transcript,
    setTranscript,
    recordingDuration,
    errorMessage,
    startListening,
    stopListening,
  };
}
