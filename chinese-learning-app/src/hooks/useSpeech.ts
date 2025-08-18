import { useState, useEffect, useCallback } from 'react';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

interface UseSpeechReturn {
  speak: (text: string, options?: SpeechOptions) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
}

export const useSpeech = (): UseSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const isSupported = 'speechSynthesis' in window;

  const loadVoices = useCallback(() => {
    if (!isSupported) return;
    
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);
    
    // Try to find a Chinese voice as default
    const chineseVoice = availableVoices.find(voice => 
      voice.lang.includes('zh') || 
      voice.lang.includes('cmn') ||
      voice.name.toLowerCase().includes('chinese') ||
      voice.name.toLowerCase().includes('mandarin')
    );
    
    if (chineseVoice && !selectedVoice) {
      setSelectedVoice(chineseVoice);
    } else if (availableVoices.length > 0 && !selectedVoice) {
      setSelectedVoice(availableVoices[0]);
    }
  }, [isSupported, selectedVoice]);

  useEffect(() => {
    if (!isSupported) return;

    loadVoices();

    // Some browsers need to wait for voices to load
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [loadVoices, isSupported]);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!isSupported || !text.trim()) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Set language - default to Chinese
    utterance.lang = options.lang || selectedVoice?.lang || 'zh-CN';
    
    // Set speech parameters
    utterance.rate = options.rate || 0.8; // Slightly slower for learning
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice
  };
};