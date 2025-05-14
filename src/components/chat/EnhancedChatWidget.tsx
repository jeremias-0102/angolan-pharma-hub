
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Mic, Volume2, PlusCircle, ArrowRightCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'bot',
    text: 'Olá! Sou a assistente virtual da BegjnpPharma. Como posso ajudá-lo hoje?',
    timestamp: new Date(),
  },
];

// Base de conhecimento para respostas inteligentes
const KNOWLEDGE_BASE = {
  greeting: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'ei', 'como vai'],
  products: ['medicamento', 'remédio', 'produto', 'vitamina', 'suplemento', 'comprar', 'venda'],
  delivery: ['entrega', 'entregar', 'quando', 'tempo', 'prazo', 'chegada'],
  payment: ['pagamento', 'pagar', 'multicaixa', 'cartão', 'transferência', 'dinheiro', 'preço'],
  prescription: ['receita', 'prescrição', 'médico', 'preciso de receita', 'sem receita'],
  schedule: ['horário', 'funcionamento', 'aberto', 'fechado', 'trabalho', 'expediente'],
  locations: ['localização', 'endereço', 'onde', 'loja', 'farmácia', 'filial'],
  account: ['conta', 'cadastro', 'perfil', 'registrar', 'login', 'senha', 'entrar']
};

// Respostas do chatbot para diferentes intenções
const RESPONSES = {
  greeting: [
    'Olá! É um prazer atendê-lo. Em que posso ajudar hoje?',
    'Oi! Bem-vindo à BegjnpPharma. Como posso ser útil?',
    'Olá! Estou aqui para ajudar com qualquer dúvida sobre nossos produtos e serviços.'
  ],
  products: [
    'Temos uma ampla variedade de medicamentos e produtos de saúde. Posso ajudá-lo a encontrar algo específico?',
    'Nossa farmácia oferece medicamentos, vitaminas, suplementos e produtos de cuidados pessoais. Qual produto você está procurando?',
    'Posso ajudá-lo a encontrar e comprar o produto que precisa. Qual medicamento você está buscando?'
  ],
  delivery: [
    'Nossas entregas são realizadas em até 24 horas para Luanda. Para outras províncias, o prazo é de 2 a 5 dias úteis.',
    'Fazemos entregas rápidas! Para o município de Luanda, entregamos no mesmo dia para pedidos feitos até às 16h.',
    'O tempo de entrega depende da sua localização. Posso verificar o prazo exato se me informar seu bairro.'
  ],
  payment: [
    'Aceitamos Multicaixa Express, cartões de crédito/débito e pagamento na entrega em dinheiro.',
    'Temos várias opções de pagamento: Multicaixa Express, cartões e dinheiro na entrega. Qual você prefere?',
    'Para sua conveniência, oferecemos pagamento online via Multicaixa Express, cartões ou pode pagar em dinheiro quando receber seu pedido.'
  ],
  prescription: [
    'Alguns medicamentos exigem prescrição médica, que pode ser enviada na hora da compra através do nosso sistema de upload.',
    'Para medicamentos controlados, você precisará enviar a receita médica válida durante o processo de checkout.',
    'Temos produtos que não necessitam de receita e outros que precisam. Posso verificar um produto específico para você?'
  ],
  schedule: [
    'Nossa farmácia virtual funciona 24 horas por dia! Você pode fazer pedidos a qualquer momento pelo site.',
    'O atendimento online está disponível 24/7. Nossa equipe de farmacêuticos está disponível das 8h às 20h todos os dias.',
    'Você pode fazer seus pedidos a qualquer momento através do nosso site, e nossa equipe processa os pedidos das 8h às 22h.'
  ],
  locations: [
    'Nossa farmácia principal está localizada no Centro de Luanda. Também temos filiais em Talatona e Viana.',
    'Temos lojas físicas em Luanda, mas você pode comprar online e receber em qualquer lugar de Angola.',
    'Nossa sede fica em Luanda, mas atendemos todo o país através do nosso serviço de entregas.'
  ],
  account: [
    'Você pode criar uma conta facilmente clicando em "Login" no topo da página e depois em "Registrar".',
    'Para acessar sua conta, use o botão de login no canto superior direito. Se ainda não tem uma conta, é rápido criar uma!',
    'Com uma conta em nosso site, você pode acompanhar seus pedidos e ter um histórico de compras.'
  ],
  fallback: [
    'Não entendi completamente. Poderia explicar de outra forma?',
    'Desculpe, não consegui compreender. Poderia reformular sua pergunta?',
    'Hmm, não tenho certeza do que você está perguntando. Pode dar mais detalhes?'
  ],
  help_purchase: [
    'Posso ajudá-lo a realizar uma compra agora mesmo! Me diga qual produto você precisa.',
    'Ficarei feliz em guiá-lo no processo de compra. Qual medicamento ou produto você está procurando?',
    'Vamos fazer sua compra juntos! Você já sabe o que deseja comprar ou precisa de recomendações?'
  ]
};

const EnhancedChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { addToCart } = useCart();

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

  const detectIntent = (message: string): string => {
    const lowercaseMsg = message.toLowerCase();
    
    // Verificar se a mensagem contém palavras-chave relacionadas a compras
    if (lowercaseMsg.includes('comprar') || 
        lowercaseMsg.includes('quero fazer uma compra') || 
        lowercaseMsg.includes('como compro') ||
        lowercaseMsg.includes('ajuda para comprar')) {
      return 'help_purchase';
    }
    
    // Verificar outras intenções
    for (const [intent, keywords] of Object.entries(KNOWLEDGE_BASE)) {
      for (const keyword of keywords) {
        if (lowercaseMsg.includes(keyword)) {
          return intent;
        }
      }
    }
    
    return 'fallback';
  };

  const getResponse = (intent: string): string => {
    const responses = RESPONSES[intent as keyof typeof RESPONSES] || RESPONSES.fallback;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSpecialCommands = (message: string): boolean => {
    // Comando para navegar para produtos
    if (message.toLowerCase().includes('mostrar produtos') || 
        message.toLowerCase().includes('ver produtos') ||
        message.toLowerCase().includes('produtos disponíveis')) {
      addBotMessage('Claro! Vou direcionar você para nossa página de produtos.');
      setTimeout(() => {
        navigate('/produtos');
        setIsOpen(false);
      }, 1000);
      return true;
    }
    
    // Comando para ir para o carrinho
    if (message.toLowerCase().includes('meu carrinho') || 
        message.toLowerCase().includes('ver carrinho') || 
        message.toLowerCase().includes('ir para o carrinho')) {
      addBotMessage('Vou mostrar seu carrinho de compras!');
      setTimeout(() => {
        navigate('/carrinho');
        setIsOpen(false);
      }, 1000);
      return true;
    }
    
    // Comando para checkout
    if (message.toLowerCase().includes('finalizar compra') || 
        message.toLowerCase().includes('fazer checkout') ||
        message.toLowerCase().includes('concluir pedido')) {
      addBotMessage('Vou direcionar você para o checkout para finalizar sua compra.');
      setTimeout(() => {
        navigate('/checkout');
        setIsOpen(false);
      }, 1000);
      return true;
    }
    
    return false;
  };

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'bot',
      text,
      timestamp: new Date()
    }]);
  };

  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000 + Math.random() * 1500);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      text: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Processar mensagem do usuário
    if (!handleSpecialCommands(userMessage.text)) {
      const intent = detectIntent(userMessage.text);
      
      simulateTyping(() => {
        const response = getResponse(intent);
        addBotMessage(response);
        
        // Para intenção de compra, oferecer navegação adicional
        if (intent === 'help_purchase') {
          simulateTyping(() => {
            addBotMessage('Posso mostrar nossa página de produtos ou você prefere me dizer especificamente o que está procurando?');
            
            simulateTyping(() => {
              addBotMessage('Você pode dizer "mostrar produtos" para ver todos os produtos disponíveis.');
            });
          });
        }
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
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

  // Simular reconhecimento de voz (em um app real usaríamos a Web Speech API)
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast({
        title: "Reconhecimento de voz",
        description: "Ouvindo... Diga 'mostrar produtos' para ver os produtos disponíveis.",
      });
      
      // Simulação de reconhecimento de voz - em um app real usaríamos a Web Speech API
      setTimeout(() => {
        setIsRecording(false);
        setNewMessage("mostrar produtos");
        setTimeout(handleSendMessage, 500);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  // Navegação direta para produtos a partir do chatbot
  const handleNavigateToProducts = () => {
    addBotMessage('Vou mostrar nossos produtos disponíveis...');
    setTimeout(() => {
      navigate('/produtos');
      setIsOpen(false);
    }, 1000);
  };

  // Navegação para o carrinho a partir do chatbot
  const handleNavigateToCart = () => {
    addBotMessage('Vou mostrar seu carrinho de compras...');
    setTimeout(() => {
      navigate('/carrinho');
      setIsOpen(false);
    }, 1000);
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className={`rounded-full fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-8 right-8'} z-50 shadow-lg bg-pharma-primary hover:bg-pharma-primary/90 h-14 w-14 p-0 flex items-center justify-center`}
        aria-label="Suporte ao cliente"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>
      
      {isOpen && (
        <Card className={`fixed ${isMobile ? 'bottom-20 right-4 left-4' : 'bottom-24 right-8'} z-50 shadow-xl w-80 sm:w-96 h-[30rem] flex flex-col`}>
          <CardHeader className="bg-pharma-primary text-white py-3 px-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-white">
                  <img src="/placeholder.svg" alt="BegjnpPharma Assistant" />
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">Assistente BEGJNP</h3>
                  <p className="text-xs opacity-80">Sempre online</p>
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
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.type === 'user'
                          ? 'bg-pharma-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
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
                onClick={handleNavigateToProducts}
              >
                <PlusCircle className="h-3 w-3 mr-1" />
                Ver produtos
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="text-xs flex items-center"
                onClick={handleNavigateToCart}
              >
                <ArrowRightCircle className="h-3 w-3 mr-1" />
                Ver carrinho
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={isSpeaking ? stopSpeaking : speakLastMessage}
              >
                {isSpeaking ? (
                  <X className="h-3 w-3" />
                ) : (
                  <Volume2 className="h-3 w-3" />
                )}
              </Button>
            </div>
            
            <CardFooter className="flex items-center p-0">
              <div className="flex items-center w-full space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isTyping}
                  onClick={toggleRecording}
                  className={`${isRecording ? 'text-red-500 animate-pulse' : ''}`}
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Input
                  ref={inputRef}
                  placeholder="Escreva sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  className="flex-grow"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!newMessage.trim() || isTyping}
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </div>
        </Card>
      )}
    </>
  );
};

export default EnhancedChatWidget;
