
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
  onstart?: () => void;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

// Local UserSession interface that matches the service
interface LocalUserSession {
  symptoms: string[];
  allergies: string[];
  currentMedications: string[];
  age: number | null;
  consultationStage: 'initial' | 'symptoms' | 'details' | 'recommendations' | 'pharmacy_search';
  patientInfo: {
    gender?: 'M' | 'F';
    weight?: number;
    chronicConditions?: string[];
    lastSymptomOnset?: string;
  };
}

// Respostas naturais angolanas
const ANGOLAN_RESPONSES = {
  greetings: [
    'Ei chefe! Tá tudo nice? Bem-vindo à farmácia Lovable. Em que posso ajudar hoje, mano?',
    'Olá irmão! Tudo fixe? Sou o teu farmacêutico virtual. Diz-me como te sentes.',
    'Bom dia meu bró! Tranquilo? Como posso dar-te uma força hoje?',
    'Epa, salve salve! Tá na boa? Conta-me o que se passa contigo.'
  ],
  pain: [
    'Eish, isso não tá bom não... Diz-me onde dói exactamente pra te ajudar, ya?',
    'Ah mano, dor é chato mesmo. Conta-me mais sobre essa dor - onde é e há quanto tempo?',
    'Ya, entendo... A dor incomoda muito. Explica-me melhor pra ver como te posso ajudar.',
    'Tranquilo irmão, vamos resolver isso. Onde exactamente sentes essa dor?'
  ],
  fever: [
    'Febre não é brincadeira, meu bró. Há quanto tempo tens febre? Tás a medir a temperatura?',
    'Epa, febre... isso pode ser várias coisas. Conta-me - tens mais algum sintoma além da febre?',
    'Ya, febre é sinal que o corpo tá a lutar contra algo. Diz-me, tens dores no corpo também?'
  ],
  confusion: [
    'Desculpa mano, não entendi bem. Podes explicar melhor o que se passa contigo?',
    'Hum... fala-me mais devagar, irmão. Qual é exactamente o problema?',
    'Epa, não percebi bem. Conta-me outra vez - que sintomas tens?',
    'Ya, explica melhor isso. Qual é o teu problema hoje?'
  ]
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'bot',
    text: 'Ei mano! Tudo bem? Sou o Dr. BejanPharma, o teu farmacêutico virtual aqui em Angola. Posso ajudar-te com sintomas, medicamentos e até encontrar os melhores preços nas farmácias. Podes falar comigo usando o microfone ou escrever. Como te sentes hoje, irmão?',
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
  const [speechSupported, setSpeechSupported] = useState(false);
  const [userSession, setUserSession] = useState<LocalUserSession>({
    symptoms: [] as string[],
    allergies: [] as string[],
    currentMedications: [] as string[],
    age: null as number | null,
    consultationStage: 'initial' as const,
    patientInfo: {}
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Função para obter resposta natural angolana
  const getAngolanResponse = (userMessage: string): string | null => {
    const message = userMessage.toLowerCase();
    
    // Saudações
    if (message.includes('olá') || message.includes('oi') || message.includes('bom dia') || 
        message.includes('boa tarde') || message.includes('ei') || message.includes('salve') ||
        message.includes('tá fixe') || message.includes('como vai')) {
      return ANGOLAN_RESPONSES.greetings[Math.floor(Math.random() * ANGOLAN_RESPONSES.greetings.length)];
    }
    
    // Dores
    if (message.includes('dor') || message.includes('doi') || message.includes('doendo')) {
      return ANGOLAN_RESPONSES.pain[Math.floor(Math.random() * ANGOLAN_RESPONSES.pain.length)];
    }
    
    // Febre
    if (message.includes('febre') || message.includes('febril') || message.includes('temperatura')) {
      return ANGOLAN_RESPONSES.fever[Math.floor(Math.random() * ANGOLAN_RESPONSES.fever.length)];
    }
    
    return null;
  };

  // Initialize speech recognition with Portuguese (Angola)
  useEffect(() => {
    const initializeSpeechRecognition = async () => {
      // Check if speech recognition is supported
      if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        setSpeechSupported(false);
        return;
      }

      try {
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false; // Mudei para false para melhor precisão
        recognitionInstance.lang = 'pt-AO'; // Português de Angola
        
        recognitionInstance.onstart = () => {
          console.log('Speech recognition started - Português de Angola');
          setIsRecording(true);
        };
        
        recognitionInstance.onresult = (event: any) => {
          if (event.results.length > 0) {
            const transcript = event.results[0][0].transcript;
            console.log('Reconheceu:', transcript);
            setNewMessage(transcript);
            setIsRecording(false);
            
            // Auto-send the message after speech recognition
            setTimeout(() => {
              handleSendMessage(transcript);
            }, 300);
          }
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          
          let errorMessage = "Erro no reconhecimento de voz";
          let description = "Tenta novamente, mano";
          
          switch (event.error) {
            case 'not-allowed':
              errorMessage = "Permissão negada";
              description = "Permite o acesso ao microfone e recarrega a página, irmão";
              break;
            case 'no-speech':
              errorMessage = "Não ouvi nada";
              description = "Fala mais alto ou mais perto do microfone, ya";
              break;
            case 'audio-capture':
              errorMessage = "Microfone não encontrado";
              description = "Verifica se o microfone tá conectado, mano";
              break;
            case 'network':
              errorMessage = "Problema de rede";
              description = "Verifica a tua internet, irmão";
              break;
            default:
              description = "Tenta falar mais devagar ou usar o teclado";
          }
          
          toast({
            title: errorMessage,
            description: description,
            variant: "destructive"
          });
        };
        
        recognitionInstance.onend = () => {
          console.log('Speech recognition ended');
          setIsRecording(false);
        };
        
        setRecognition(recognitionInstance);
        setSpeechSupported(true);
        console.log('Speech recognition initialized successfully for Portuguese Angola');
        
      } catch (error) {
        console.error('Failed to get microphone permission:', error);
        setSpeechSupported(false);
        toast({
          title: "Microfone não disponível",
          description: "Permite o acesso ao microfone para usar o reconhecimento de voz, mano",
          variant: "destructive"
        });
      }
    };

    initializeSpeechRecognition();
  }, []);

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus on input when chat opens
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
    }, 800 + Math.random() * 1000); // Mais rápido e natural
  };

  const handleMedicalConsultation = async (message: string) => {
    try {
      // Primeiro, tentar resposta natural angolana
      const angolanResponse = getAngolanResponse(message);
      
      if (angolanResponse) {
        addBotMessage(angolanResponse);
        // Atualizar o estágio para sintomas se foi uma saudação
        if (userSession.consultationStage === 'initial') {
          setUserSession(prev => ({ ...prev, consultationStage: 'symptoms' }));
        }
        return;
      }
      
      // Se não encontrou resposta natural, usar a IA médica
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
      addBotMessage('Epa, tive um problema técnico agora. Podes repetir o que disseste, mano?');
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

  const toggleRecording = async () => {
    if (!speechSupported) {
      toast({
        title: "Reconhecimento de voz não suportado",
        description: "O teu navegador não suporta reconhecimento de voz ou não tens microfone, mano. Usa o teclado para escrever.",
        variant: "destructive"
      });
      return;
    }

    if (!recognition) {
      toast({
        title: "Reconhecimento de voz não inicializado",
        description: "Recarrega a página e permite o acesso ao microfone, irmão.",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      try {
        recognition.stop();
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setIsRecording(false);
      }
    } else {
      try {
        setNewMessage('');
        recognition.start();
        toast({
          title: "A ouvir...",
          description: "Fala agora, mano! Conta-me como te sentes.",
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Erro ao iniciar gravação",
          description: "Tenta novamente ou verifica as permissões do microfone, irmão.",
          variant: "destructive"
        });
      }
    }
  };

  // Text-to-speech para ler a última mensagem do bot com sotaque angolano
  const speakLastMessage = () => {
    const lastBotMessage = [...messages].reverse().find(msg => msg.type === 'bot');
    if (lastBotMessage && 'speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(lastBotMessage.text);
      utterance.lang = 'pt-BR'; // Mais próximo do sotaque angolano
      utterance.rate = 0.9; // Um pouco mais devagar para sotaque natural
      utterance.pitch = 1.1; // Tom um pouco mais alto
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  // Stop text-to-speech
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      addBotMessage('📄 Receita recebida, mano! Deixa-me analisar isso...');
      
      // Simulate OCR processing
      simulateTyping(async () => {
        // In a real app, you would use OCR service here
        const mockPrescriptionText = `Paracetamol 500mg - 1 comprimido a cada 6 horas por 3 dias
Amoxicilina 875mg - 1 comprimido a cada 12 horas por 7 dias
Omeprazol 20mg - 1 cápsula em jejum por 14 dias`;
        
        addBotMessage('Ya, analisei a tua receita. Tens aqui alguns medicamentos importantes. Posso ajudar-te a encontrar nas farmácias de Luanda com os melhores preços, irmão!');
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
                  <h3 className="font-medium text-sm">Dr. BejanPharma</h3>
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
                onClick={isSpeaking ? stopSpeaking : speakLastMessage}
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            </div>
            
            <CardFooter className="flex items-center p-0">
              <div className="flex items-center w-full space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isTyping || !speechSupported}
                  onClick={toggleRecording}
                  className={`${isRecording ? 'text-red-500 animate-pulse bg-red-50' : 'text-gray-600'} hover:bg-gray-100 ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={speechSupported ? (isRecording ? "Parar gravação" : "Começar gravação") : "Reconhecimento de voz não disponível"}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Input
                  ref={inputRef}
                  placeholder={isRecording ? "A ouvir..." : "Fala ou escreve como te sentes, mano..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
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
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Card>
      )}
    </>
  );
};

export default EnhancedChatWidget;
