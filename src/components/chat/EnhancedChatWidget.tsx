import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Mic, Volume2, PlusCircle, FileText, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { aiAssistant } from '@/services/aiAssistantService';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  data?: any;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'bot',
    text: 'Olá meu irmão! Sou o teu farmacêutico virtual. Posso ajudar-te com sintomas, receitas médicas e encontrar medicamentos. Podes falar comigo usando o botão do microfone ou escrever. Como te sentes hoje?',
    timestamp: new Date(),
  },
];

const EnhancedChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [userSession, setUserSession] = useState({
    symptoms: [] as string[],
    allergies: [] as string[],
    currentMedications: [] as string[],
    age: null as number | null,
    consultationStage: 'initial' as 'initial' | 'symptoms' | 'details' | 'recommendations'
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'pt-PT'; // Portuguese from Portugal/Angola
      
      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setNewMessage(finalTranscript);
          setIsRecording(false);
          // Auto-send the message after speech recognition
          setTimeout(() => {
            handleSendMessage(finalTranscript);
          }, 500);
        } else if (interimTranscript) {
          setNewMessage(interimTranscript);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          title: "Erro no reconhecimento de voz",
          description: "Não consegui ouvir bem. Tenta falar mais alto ou usar o teclado.",
          variant: "destructive"
        });
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Rolar para a mensagem mais recente
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focar no input quando o chat é aberto
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  };

  const addBotMessage = (text: string, data?: any) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'bot',
      text,
      timestamp: new Date(),
      data
    }]);
  };

  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000 + Math.random() * 1500);
  };

  const handleMedicalConsultation = async (message: string) => {
    try {
      // Update user session based on conversation stage
      const updatedSession = { ...userSession };
      
      if (userSession.consultationStage === 'initial') {
        updatedSession.consultationStage = 'symptoms';
        updatedSession.symptoms.push(message);
      }
      
      setUserSession(updatedSession);
      
      const response = await aiAssistant.conductMedicalConsultation(message, updatedSession);
      addBotMessage(response.message, response.data);
      
      if (response.sessionUpdate) {
        setUserSession(prev => ({ ...prev, ...response.sessionUpdate }));
      }
    } catch (error) {
      console.error('Error in medical consultation:', error);
      addBotMessage('Desculpa meu irmão, tive um problema técnico. Podes repetir o que disseste?');
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || newMessage.trim();
    if (textToSend === '') return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      text: textToSend,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setNewMessage('');
    
    simulateTyping(async () => {
      await handleMedicalConsultation(textToSend);
    });
  };

  const toggleRecording = () => {
    if (!recognition) {
      toast({
        title: "Reconhecimento de voz não suportado",
        description: "O teu navegador não suporta reconhecimento de voz. Usa o teclado para escrever.",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setNewMessage('');
      recognition.start();
      setIsRecording(true);
      toast({
        title: "A ouvir...",
        description: "Fala agora! Descreve os teus sintomas ou o que precisas.",
      });
    }
  };

  // Síntese de voz para ler a última mensagem do bot
  const speakLastMessage = () => {
    const lastBotMessage = [...messages].reverse().find(msg => msg.type === 'bot');
    if (lastBotMessage && 'speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(lastBotMessage.text);
      utterance.lang = 'pt-BR';
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  // Parar síntese de voz
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      addBotMessage('📄 Receita recebida! Analisando...');
      
      // Simulate OCR processing
      simulateTyping(async () => {
        // In a real app, you would use OCR service here
        const mockPrescriptionText = `Paracetamol 500mg - 1 comprimido a cada 6 horas por 3 dias
Amoxicilina 875mg - 1 comprimido a cada 12 horas por 7 dias
Omeprazol 20mg - 1 cápsula em jejum por 14 dias`;
        
        //await handlePrescriptionAnalysis(mockPrescriptionText);
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className={`rounded-full fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-8 right-8'} z-50 shadow-lg bg-pharma-primary hover:bg-pharma-primary/90 h-14 w-14 p-0 flex items-center justify-center`}
        aria-label="Farmacêutico Virtual"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>
      
      {isOpen && (
        <Card className={`fixed ${isMobile ? 'bottom-20 right-4 left-4' : 'bottom-24 right-8'} z-50 shadow-xl w-80 sm:w-96 h-[35rem] flex flex-col`}>
          <CardHeader className="bg-pharma-primary text-white py-3 px-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-white">
                  <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    Dr
                  </div>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">Dr. BegjnpPharma</h3>
                  <p className="text-xs opacity-80">Farmacêutico Virtual</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-pharma-primary/90">
                <X size={18} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow p-3 overflow-hidden">
            <ScrollArea className="h-full pr-3">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        msg.type === 'user'
                          ? 'bg-pharma-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-line">{msg.text}</div>
                      <p className="text-xs mt-1 opacity-70">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-3 py-2 bg-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <div className="px-3 py-2 bg-gray-50">
            <div className="flex space-x-2 mb-2">
              <Button 
                variant="outline"
                size="sm"
                className="text-xs flex items-center"
                onClick={() => navigate('/produtos')}
              >
                <PlusCircle className="h-3 w-3 mr-1" />
                Ver produtos
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="text-xs flex items-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-3 w-3 mr-1" />
                Receita
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={isSpeaking ? () => speechSynthesis.cancel() : () => {}}
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            </div>
            
            <CardFooter className="flex items-center p-0">
              <div className="flex items-center w-full space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isTyping}
                  onClick={toggleRecording}
                  className={`${isRecording ? 'text-red-500 animate-pulse bg-red-50' : 'text-gray-600'} hover:bg-gray-100`}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Input
                  ref={inputRef}
                  placeholder={isRecording ? "A ouvir..." : "Fala ou escreve os teus sintomas..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isTyping || isRecording}
                  className="flex-grow"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!newMessage.trim() || isTyping || isRecording}
                  onClick={() => handleSendMessage()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={() => {}} // Will be implemented
              className="hidden"
            />
          </div>
        </Card>
      )}
    </>
  );
};

export default EnhancedChatWidget;
