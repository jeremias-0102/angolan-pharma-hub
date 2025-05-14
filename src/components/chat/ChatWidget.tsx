
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger
} from "@/components/ui/sheet";
import { MessageCircle, Send, Mic, X, Volume2, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isAudio?: boolean;
  audioUrl?: string;
}

// Common questions and answers for the AI chatbot
const knowledgeBase = {
  greeting: [
    "Olá! Como posso ajudar você hoje?",
    "Bem-vindo à BEGJNP Pharma! Como posso ser útil?",
    "Olá! Sou o assistente virtual da BEGJNP Pharma. Como posso ajudar?"
  ],
  register: [
    "Para se cadastrar no nosso sistema, siga estes passos:\n\n1. Clique no botão 'Entrar' no canto superior direito\n2. Selecione 'Criar nova conta'\n3. Preencha seus dados pessoais\n4. Confirme seu email\n5. Pronto! Você já pode fazer compras"
  ],
  find_products: [
    "Você pode encontrar nossos produtos de várias maneiras:\n\n1. Use a barra de pesquisa no topo da página\n2. Navegue pelas categorias no menu principal\n3. Verifique as ofertas em destaque na página inicial",
    "Para encontrar um produto específico, use a barra de pesquisa no topo da página. Você também pode filtrar por categoria, preço ou disponibilidade na página de produtos."
  ],
  prescription: [
    "Para medicamentos que exigem prescrição médica, você pode:\n\n1. Adicionar o item ao carrinho normalmente\n2. Durante o checkout, você terá a opção de fazer upload da sua receita médica\n3. Nossa equipe farmacêutica verificará a prescrição antes da aprovação final",
    "Medicamentos com receita exigem que você envie uma foto da sua prescrição médica durante o processo de checkout. Não se preocupe, o processo é simples e seguro!"
  ],
  delivery: [
    "Realizamos entregas em toda Angola! O prazo de entrega depende da sua localização:\n\n- Luanda: 1-2 dias úteis\n- Capitais provinciais: 2-4 dias úteis\n- Outras localidades: 3-7 dias úteis\n\nO valor do frete é calculado com base no seu endereço e é mostrado antes da finalização da compra.",
    "Nossa política de entrega inclui entregas gratuitas para compras acima de 20.000 AOA em Luanda. Para outras regiões, o frete é calculado baseado na sua localização."
  ],
  payment: [
    "Aceitamos diversos métodos de pagamento:\n\n- Cartões de crédito/débito (Visa, Mastercard)\n- Multicaixa Express\n- Transferência bancária\n- Pagamento em dinheiro na entrega (apenas Luanda)",
    "Você pode pagar usando Multicaixa, cartões Visa/Mastercard ou transferência bancária. Para compras em Luanda, também oferecemos a opção de pagamento em dinheiro na entrega."
  ],
  return_policy: [
    "Nossa política de devolução permite:\n\n- Devolução em até 7 dias para produtos não abertos\n- Troca imediata em caso de produtos danificados ou incorretos\n- Reembolso total para medicamentos com defeitos de fabricação\n\nPara iniciar uma devolução, entre em contato com nosso suporte."
  ],
  contact: [
    "Você pode entrar em contato conosco através dos seguintes canais:\n\n- Telefone: +244 923 456 789\n- Email: contato@begjnppharma.co.ao\n- WhatsApp: +244 923 456 789\n- Endereço: Av. 4 de Fevereiro, 123, Luanda, Angola\n\nNosso horário de atendimento é de segunda a sexta, das 8h às 18h, e aos sábados das 9h às 13h."
  ],
  hours: [
    "Nosso horário de funcionamento é:\n\n- Segunda a Sexta: 8h às 18h\n- Sábados: 9h às 13h\n- Domingos e Feriados: Fechado"
  ],
  fallback: [
    "Não tenho certeza sobre isso. Posso ajudar com informações sobre nossos produtos, entregas, pagamentos ou posso conectar você com um farmacêutico para questões mais específicas.",
    "Essa é uma pergunta interessante. Para obter informações mais detalhadas sobre esse assunto, recomendo falar com um de nossos farmacêuticos. Posso te conectar agora?",
    "Peço desculpas, mas não tenho informações suficientes sobre isso. Gostaria que eu encaminhasse sua pergunta para um de nossos especialistas?",
    "Entendo sua dúvida. Este é um tema que pode exigir a análise de um profissional. Posso encaminhar você para um de nossos farmacêuticos para melhor assistência."
  ]
};

// Function to get appropriate response from knowledgeBase
const getAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Check for basic greetings
  if (/olá|oi|ei|bom dia|boa tarde|boa noite|oi tudo bem|como vai|saudações|bem vindo|bemvindo/i.test(lowerMessage)) {
    return getRandomResponse(knowledgeBase.greeting);
  }
  
  // Check for registration questions
  if (/cadastr|registr|cri(ar|e) (uma )?conta|como (me)? cadastr|como (me)? registr/i.test(lowerMessage)) {
    return getRandomResponse(knowledgeBase.register);
  }
  
  // Check for product search questions
  if (/encontr|procur|busc|achar|pesquis|onde (está|fica|tem)|como (eu )?acho|como (eu )?encontro|onde (eu )?compro/i.test(lowerMessage)) {
    return getRandomResponse(knowledgeBase.find_products);
  }
  
  // Check for prescription related questions
  if (/receit|prescrição|prescri(ç|c)(ao|ão)|remédio( com | de )receit/i.test(lowerMessage)) {
    return getRandomResponse(knowledgeBase.prescription);
  }
  
  // Check for delivery questions
  if (/entreg|receb|frete|transport|prazo|quanto tempo|quando chega/i.test(lowerMessage)) {
    return getRandomResponse(knowledgeBase.delivery);
  }
  
  // Check for payment questions
  if (/pag(ar|amento)|cartão|crédito|débito|multicaixa|transfer(ê|e)ncia|como (eu )?(posso )?pagar/i.test(lowerMessage)) {
    return getRandomResponse(knowledgeBase.payment);
  }
  
  // Check for return policy questions
  if (/devolu(ç|c)(ao|ão)|troc(a|ar)|reembols/i.test(lowerMessage)) {
    return getRandomResponse(knowledgeBase.return_policy);
  }
  
  // Check for contact information questions
  if (/contato|contac?t(ar|o)|telefone|email|endereço|whatsapp|falar com/i.test(lowerMessage)) {
    return getRandomResponse(knowledgeBase.contact);
  }
  
  // Check for hours of operation questions
  if (/hor(á|a)rio|funcionamento|aberto|quando (abre|fecha)|hora (abre|fecha)/i.test(lowerMessage)) {
    return getRandomResponse(knowledgeBase.hours);
  }
  
  // Fallback response
  return getRandomResponse(knowledgeBase.fallback);
};

// Helper function to get random response from array
const getRandomResponse = (responses: string[]): string => {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
};

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioChunks = useRef<BlobPart[]>([]);

  // Initialize with a welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          text: "Olá! Bem-vindo à BEGJNP Pharma. Como posso ajudar você hoje?",
          isUser: false
        }
      ]);
    }
  }, [messages]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle media recorder setup
  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.removeEventListener('dataavailable', handleDataAvailable);
        mediaRecorder.removeEventListener('stop', handleStop);
      }
    };
  }, [mediaRecorder]);

  const handleDataAvailable = (e: BlobEvent) => {
    if (e.data.size > 0) {
      audioChunks.current.push(e.data);
    }
  };

  const handleStop = () => {
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Add the audio message to the chat
    const newMessage: Message = {
      id: Date.now().toString(),
      text: "Mensagem de áudio",
      isUser: true,
      isAudio: true,
      audioUrl
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate the AI processing the audio
    handleAIResponse("Mensagem de áudio recebida", true);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      audioChunks.current = [];
      
      recorder.addEventListener('dataavailable', handleDataAvailable);
      recorder.addEventListener('stop', handleStop);
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      toast({
        title: "Gravando áudio",
        description: "Fale sua mensagem e clique novamente para parar."
      });
    } catch (err) {
      console.error('Error starting recording:', err);
      toast({
        title: "Erro ao gravar",
        description: "Não foi possível acessar seu microfone.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;
    
    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    handleAIResponse(inputMessage);
    setInputMessage("");
  };

  const handleAIResponse = (userMessage: string, isAudioResponse = false) => {
    setIsLoading(true);
    
    // Simulate AI thinking with a slight delay
    setTimeout(() => {
      // Get AI response based on user message
      let aiResponse = "";
      
      if (isAudioResponse) {
        aiResponse = "Recebi sua mensagem de áudio! Para melhor entender sua solicitação, pode digitar sua pergunta? Estou aqui para ajudar com qualquer dúvida sobre produtos, entregas ou qualquer outro assunto relacionado à BEGJNP Pharma.";
      } else {
        aiResponse = getAIResponse(userMessage);
      }
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: aiResponse,
        isUser: false
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          className="rounded-full h-14 w-14 fixed bottom-6 right-6 shadow-lg bg-pharma-primary hover:bg-pharma-primary/90 z-50"
          size="icon"
        >
          <MessageCircle size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[400px] p-0 flex flex-col h-full">
        <SheetHeader className="px-4 py-4 border-b bg-pharma-primary text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-2 border-2 border-white">
                <img src="/logo.png" alt="BEGJNP Pharma" onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder.svg';
                }}/>
              </Avatar>
              <SheetTitle className="text-white">Suporte ao Cliente</SheetTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div 
                className={`max-w-[85%] rounded-lg p-3 ${
                  msg.isUser 
                    ? 'bg-pharma-primary text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 rounded-tl-none'
                }`}
              >
                {msg.isAudio ? (
                  <div className="flex items-center cursor-pointer" onClick={() => msg.audioUrl && playAudio(msg.audioUrl)}>
                    <Volume2 size={18} className="mr-2" />
                    <span>Reproduzir áudio</span>
                  </div>
                ) : (
                  <p className="whitespace-pre-line">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-gray-200 rounded-lg rounded-tl-none p-3 max-w-[85%]">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>Digitando...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-t bg-white">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className={`flex-shrink-0 ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
              onClick={toggleRecording}
            >
              <Mic size={20} />
            </Button>
            <Input
              placeholder="Digite sua mensagem..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1"
              disabled={isRecording}
            />
            <Button 
              size="icon" 
              className="flex-shrink-0 bg-pharma-primary hover:bg-pharma-primary/90" 
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === '' || isRecording}
            >
              <Send size={18} />
            </Button>
          </div>
          <div className="text-xs text-center mt-2 text-gray-500">
            BEGJNP Pharma • Suporte 24/7 • Farmácia Online
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatWidget;
