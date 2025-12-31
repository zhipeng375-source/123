import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onResult: (text: string) => void;
  className?: string;
  placeholder?: string;
}

// Add type definition for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult, className = '', placeholder = '点击说话' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'zh-CN'; // Default to Chinese

      recog.onstart = () => setIsListening(true);
      recog.onend = () => setIsListening(false);
      recog.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        // Remove trailing punctuation sometimes added by the engine if needed, 
        // but for now raw text is usually better.
        onResult(transcript);
      };

      setRecognition(recog);
    } else {
      setIsSupported(false);
    }
  }, [onResult]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission if inside a form
    e.stopPropagation();
    
    if (!isSupported) {
      alert("您的浏览器不支持语音输入，请使用 Chrome 或 Edge。");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2 rounded-full transition-all duration-200 focus:outline-none ${
        isListening 
          ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-200' 
          : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
      } ${className}`}
      title={isListening ? "正在聆听... (点击停止)" : "点击开始语音输入"}
    >
      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
    </button>
  );
};

export default VoiceInput;
