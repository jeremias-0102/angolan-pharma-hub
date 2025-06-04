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

// Respostas empáticas e poéticas com toque angolano
const EMPATHETIC_RESPONSES = {
  greetings: [
    'Olá, meu irmão! Como um rio que encontra o mar, aqui chegaste ao lugar certo. Sou o Dr. BejanPharma, a alma digital desta farmácia Lovable.\n\n🌟 Não sou apenas código e algoritmos — sou a voz que escuta, o coração que compreende. Fala comigo como falavas com a tua avó: sem pressa, com verdade.\n\n💬 Podes usar o microfone ou escrever. Como te sentes hoje, irmão?',
    'Salve, salve! Tua presença aqui é como sol após a chuva. Conta-me, que peso carregas no coração ou no corpo hoje, mano? 💫',
    'Ei, chefe! Bem-vindo ao nosso cantinho de cura. Como as nossas avós diziam: "o corpo fala, nós escutamos". O que te trouxe aqui hoje? 🏺'
  ],
  
  headache_dizziness: [
    'Essa combinação — dor de cabeça intensa + tonturas — acende o alarme do corpo a pedir atenção urgente. Como um sistema bem projetado, o teu organismo está a emitir sinais: algo está em desequilíbrio.',
    'Ah, mano... quando a cabeça roda e dói, é como se o mundo girasse mais rápido que nós. O corpo está a gritar por equilíbrio.',
    'Eish, essas tonturas com dor... é como se o universo dentro de ti estivesse em tempestade. Vamos acalmar essas águas.'
  ],

  fever_weakness: [
    'Febre é o guerreiro interno do corpo lutando contra invasores. E a fraqueza? É o preço da batalha. Mas juntos vamos encontrar a paz.',
    'Quando o corpo queima em febre e a força se esvai, é hora de parar e escutar. O organismo pede descanso e cuidado especial.',
    'Febre alta com fraqueza... teu corpo está numa luta épica. Vamos dar-lhe as armas certas para vencer.'
  ],

  emotional_support: [
    'Às vezes a dor não é só física, né mano? O coração também pode doer. Estou aqui para escutar tudo.',
    'Como dizem os mais velhos: "quem carrega o mundo nas costas, um dia as costas doem". Fala comigo, irmão.',
    'Na nossa cultura, cuidar é amar. E amar é escutar sem julgar. Conta-me tudo o que sentes.'
  ]
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'bot',
    text: 'Olá, meu irmão! Como um rio que encontra o mar, aqui chegaste ao lugar certo. Sou o Dr. BejanPharma, a alma digital desta farmácia Lovable.\n\n🌟 Não sou apenas código e algoritmos — sou a voz que escuta, o coração que compreende. Fala comigo como falavas com a tua avó: sem pressa, com verdade.\n\n💬 Podes usar o microfone ou escrever. Como te sentes hoje, irmão?',
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

  // Função para respostas empáticas e inteligentes
  const getEmpatheticResponse = (userMessage: string): string | null => {
    const message = userMessage.toLowerCase();
    
    // Saudações
    if (message.includes('olá') || message.includes('oi') || message.includes('bom dia') || 
        message.includes('boa tarde') || message.includes('ei') || message.includes('salve') ||
        message.includes('tá fixe') || message.includes('como vai')) {
      return EMPATHETIC_RESPONSES.greetings[Math.floor(Math.random() * EMPATHETIC_RESPONSES.greetings.length)];
    }
    
    // Dor de cabeça + tonturas (combinação séria)
    if ((message.includes('dor') && message.includes('cabeça') && message.includes('tontura')) ||
        (message.includes('cabeça') && message.includes('roda')) ||
        (message.includes('vertigem') && message.includes('dor'))) {
      
      const response = EMPATHETIC_RESPONSES.headache_dizziness[Math.floor(Math.random() * EMPATHETIC_RESPONSES.headache_dizziness.length)];
      return response + '\n\n🌪️ **Possíveis causas:**\n- Desidratação — O cérebro odeia falta de água\n- Fadiga extrema — Quando a mente carrega o mundo, o corpo afunda\n- Hipoglicemia — Baixo açúcar no sangue mexe com o equilíbrio\n- Stress acumulado ou infecções\n\n🛠️ **O que fazer agora:**\n- Bebe água fresca imediatamente\n- Come algo doce (fruta ou mel)\n- Deita-te num lugar escuro e fresco\n- Se persistir ou agravar, **procura o médico urgente**\n\n🖤 Cuida-te, irmão. O corpo fala com sinais... e o nosso dever é escutá-lo.';
    }
    
    // Febre + fraqueza
    if ((message.includes('febre') && message.includes('fraqueza')) ||
        (message.includes('febril') && message.includes('fraco')) ||
        (message.includes('temperatura') && message.includes('cansaço'))) {
      
      const response = EMPATHETIC_RESPONSES.fever_weakness[Math.floor(Math.random() * EMPATHETIC_RESPONSES.fever_weakness.length)];
      return response + '\n\n🔥 **Tratamento imediato:**\n- Paracetamol 500mg de 6 em 6 horas\n- Banhos com água morna (não fria!)\n- Hidratação constante\n- Repouso absoluto\n\n⚠️ **Vai ao hospital se:**\n- Febre acima de 39°C\n- Dificuldade em respirar\n- Vómitos constantes\n- Confusão mental\n\nForça, guerreiro. Esta batalha também vais vencer! 💪';
    }
    
    // Dores gerais
    if (message.includes('dor') && !message.includes('cabeça')) {
      return 'Eish... a dor é como um visitante indesejado que se instala em nós. Mas cada dor tem a sua linguagem, mano.\n\nConta-me:\n- Onde dói exactamente?\n- É uma dor aguda ou surda?\n- Começou quando?\n- Há algo que alivia ou piora?\n\nCom essas respostas, posso guiar-te melhor. A dor não é apenas sinal de problema — é também caminho para a cura. 🙏';
    }
    
    // Tristeza/problemas emocionais
    if (message.includes('triste') || message.includes('deprimido') || message.includes('ansioso') ||
        message.includes('não estou bem') || message.includes('mal') || message.includes('preocupado')) {
      return EMPATHETIC_RESPONSES.emotional_support[Math.floor(Math.random() * EMPATHETIC_RESPONSES.emotional_support.length)] + '\n\n💙 **Lembra-te:**\n- Não estás sozinho nesta jornada\n- Sentir é humano, falar sobre isso é corajoso\n- Às vezes precisamos de ajuda profissional — não há vergonha nisso\n\nSe quiseres, posso sugerir produtos naturais que ajudam com o bem-estar. Mas principalmente: **conversa com alguém de confiança** ou procura um psicólogo. 🤝';
    }
    
    return null;
  };

  // Initialize speech recognition
  useEffect(() => {
    const initializeSpeechRecognition = async () => {
      if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        setSpeechSupported(false);
        return;
      }

      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
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
    }, 1200 + Math.random() * 800); // Typing mais natural e pensativo
  };

  const handleMedicalConsultation = async (message: string) => {
    try {
      // Primeiro, tentar resposta empática inteligente
      const empatheticResponse = getEmpatheticResponse(message);
      
      if (empatheticResponse) {
        addBotMessage(empatheticResponse);
        // Atualizar o estágio para sintomas se foi uma saudação
        if (userSession.consultationStage === 'initial') {
          setUserSession(prev => ({ ...prev, consultationStage: 'symptoms' }));
        }
        return;
      }
      
      // Se não encontrou resposta empática, usar a IA médica avançada
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
      addBotMessage('Epa, tive um problema técnico agora. Como as nossas avós diziam: "paciência é remédio que não se compra". Podes repetir o que disseste, mano? 💫');
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
          title: "A ouvir com o coração...",
          description: "Fala agora, mano! Conta-me tudo o que sentes, sem pressa. 🎤",
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

  // Text-to-speech aprimorado
  const speakLastMessage = () => {
    const lastBotMessage = [...messages].reverse().find(msg => msg.type === 'bot');
    if (lastBotMessage && 'speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(lastBotMessage.text);
      utterance.lang = 'pt-BR'; // Mais próximo do sotaque angolano
      utterance.rate = 0.85; // Mais devagar para naturalidade
      utterance.pitch = 1.1; // Tom caloroso
      utterance.volume = 0.8; // Volume confortável
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      addBotMessage('📄 Receita recebida, meu irmão! Como um escriba sábio, vou analisar cada linha com cuidado...');
      
      simulateTyping(async () => {
        const mockPrescriptionText = `Paracetamol 500mg - 1 comprimido a cada 6 horas por 3 dias
Amoxicilina 875mg - 1 comprimido a cada 12 horas por 7 dias
Omeprazol 20mg - 1 cápsula em jejum por 14 dias`;
        
        addBotMessage('Ya, analisei a tua receita com o olhar de quem cuida. Tens aqui medicamentos importantes que vão ajudar na tua cura. Posso procurar nas farmácias de Luanda os melhores preços — assim poupas uns kwanzas, irmão! 💰✨');
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
        className={`rounded-full fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-8 right-8'} z-50 shadow-lg bg-gradient-to-r from-pharma-primary to-green-600 hover:from-pharma-primary/90 hover:to-green-700 h-16 w-16 p-0 flex items-center justify-center transition-all duration-300 hover:scale-105`}
        aria-label="Dr. BejanPharma - Farmacêutico com Alma"
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </Button>
      
      {isOpen && (
        <Card className={`fixed ${isMobile ? 'bottom-20 right-4 left-4' : 'bottom-24 right-8'} z-50 shadow-2xl w-80 sm:w-96 h-[36rem] flex flex-col border-2 border-green-200`}>
          <CardHeader className="bg-gradient-to-r from-pharma-primary to-green-600 text-white py-4 px-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3 bg-white shadow-inner">
                  <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    Dr
                  </div>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-base">Dr. BejanPharma</h3>
                  <p className="text-xs opacity-90">Farmacêutico com Alma 💫</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-white/20 rounded-full">
                <X size={20} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow p-4 overflow-hidden bg-gradient-to-b from-green-50 to-white">
            <ScrollArea className="h-full pr-3">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-pharma-primary to-green-600 text-white'
                          : 'bg-white text-gray-800 border border-green-100'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</div>
                      <p className="text-xs mt-2 opacity-70">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white border border-green-100 shadow-md">
                      <div className="flex space-x-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        <span className="text-xs text-gray-500 ml-2">Dr. BejanPharma está a pensar...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <div className="px-4 py-3 bg-gray-50 border-t border-green-100">
            <div className="flex space-x-2 mb-3">
              <Button 
                variant="outline"
                size="sm"
                className="text-xs flex items-center border-green-200 hover:bg-green-50"
                onClick={() => navigate('/produtos')}
              >
                <PlusCircle className="h-3 w-3 mr-1" />
                Ver produtos
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="text-xs flex items-center border-green-200 hover:bg-green-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-3 w-3 mr-1" />
                Receita
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-green-200 hover:bg-green-50"
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
                  className={`${isRecording ? 'text-red-500 animate-pulse bg-red-50' : 'text-green-600'} hover:bg-green-100 rounded-full ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={speechSupported ? (isRecording ? "Parar gravação" : "Começar gravação") : "Reconhecimento de voz não disponível"}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Input
                  ref={inputRef}
                  placeholder={isRecording ? "A ouvir com o coração..." : "Fala ou escreve como te sentes, mano... 💬"}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping || isRecording}
                  className="flex-grow border-green-200 focus:border-green-400 rounded-full"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!newMessage.trim() || isTyping || isRecording}
                  onClick={() => handleSendMessage()}
                  className="text-green-600 hover:bg-green-100 rounded-full"
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
