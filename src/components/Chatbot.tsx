import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLang } from '@/contexts/LangContext';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const Chatbot = () => {
  const { t, lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: 1, text: t('chatbotWelcome'), isBot: true }]);
    }
  }, [isOpen, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Apply/Registration keywords
    if (lowerMessage.includes('تسجيل') || lowerMessage.includes('التقديم') || 
        lowerMessage.includes('apply') || lowerMessage.includes('register') ||
        lowerMessage.includes('قدم')) {
      return t('chatbotApplyReply');
    }
    
    // Competition keywords
    if (lowerMessage.includes('مسابقة') || lowerMessage.includes('مسابقات') ||
        lowerMessage.includes('competition') || lowerMessage.includes('contest')) {
      return t('chatbotCompetitionReply');
    }
    
    // Upload keywords
    if (lowerMessage.includes('رفع') || lowerMessage.includes('ملف') || 
        lowerMessage.includes('ملفات') || lowerMessage.includes('upload') || 
        lowerMessage.includes('file')) {
      return t('chatbotUploadReply');
    }
    
    return t('chatbotDefaultReply');
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        isBot: true,
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 z-50 w-14 h-14 rounded-full shadow-lg shadow-primary/30',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          'transition-all duration-300 hover:scale-110',
          lang === 'ar' ? 'start-6' : 'end-6'
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-24 z-50 w-[350px] max-w-[calc(100vw-2rem)]',
            'bg-card border border-border rounded-2xl shadow-2xl',
            'animate-fade-in overflow-hidden',
            lang === 'ar' ? 'start-6' : 'end-6'
          )}
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">{t('chatbotTitle')}</h3>
              <p className="text-xs text-primary-foreground/70">
                {lang === 'ar' ? 'متصل الآن' : 'Online'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2',
                  message.isBot ? 'justify-start' : 'justify-end'
                )}
              >
                {message.isBot && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[75%] p-3 rounded-2xl text-sm',
                    message.isBot
                      ? 'bg-muted text-foreground rounded-ts-none'
                      : 'bg-primary text-primary-foreground rounded-te-none'
                  )}
                >
                  {message.text}
                </div>
                {!message.isBot && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted p-3 rounded-2xl rounded-ts-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatbotPlaceholder')}
                className="flex-1 bg-background border-border"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="bg-primary hover:bg-primary/90"
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
