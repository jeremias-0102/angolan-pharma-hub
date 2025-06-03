import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Mic, Volume2, PlusCircle, ArrowRightCircle, Upload, FileText } from 'lucide-react';
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

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'bot',
    text: 'Olá! Sou seu assistente farmacêutico virtual. Posso ajudar com: análise de receitas, sugestões de medicamentos, informações sobre produtos, orientações de uso e muito mais. Como posso ajudá-lo hoje?',
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
  const [userAllergies, setUserAllergies] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    
    // Medical consultation patterns
    if (lowercaseMsg.includes('dor') || lowercaseMsg.includes('sintoma') || 
        lowercaseMsg.includes('sinto') || lowercaseMsg.includes('tenho')) {
      return 'medical_consultation';
    }
    
    if (lowercaseMsg.includes('receita') || lowercaseMsg.includes('prescrição') ||
        lowercaseMsg.includes('médico receitou')) {
      return 'prescription_help';
    }
    
    if (lowercaseMsg.includes('alergia') || lowercaseMsg.includes('alérgico')) {
      return 'allergy_check';
    }
    
    if (lowercaseMsg.includes('como tomar') || lowercaseMsg.includes('dosagem') ||
        lowercaseMsg.includes('quantas vezes')) {
      return 'medication_instructions';
    }
    
    if (lowercaseMsg.includes('informação') || lowercaseMsg.includes('composição') ||
        lowercaseMsg.includes('fabricante') || lowercaseMsg.includes('validade')) {
      return 'product_info';
    }
    
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

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      text: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageText = newMessage;
    setNewMessage('');
    
    if (!handleSpecialCommands(messageText)) {
      const intent = detectIntent(messageText);
      
      simulateTyping(async () => {
        switch (intent) {
          case 'medical_consultation':
            await handleMedicalConsultation(messageText);
            break;
          case 'prescription_help':
            addBotMessage('Posso ajudar com sua receita! Você pode:\n\n1. Digitar os medicamentos da receita\n2. Usar o botão 📎 para enviar uma foto da receita\n3. Descrever o que está prescrito\n\nComo prefere proceder?');
            break;
          case 'allergy_check':
            addBotMessage('É muito importante verificar alergias! Você pode me informar a quais medicamentos é alérgico? Dessa forma posso sugerir alternativas seguras.');
            // Extract allergies from message
            const allergies = messageText.match(/alérgico?\s+a?\s*([^.!?]+)/i);
            if (allergies) {
              setUserAllergies(prev => [...prev, allergies[1].trim()]);
            }
            break;
          case 'product_info':
            addBotMessage('Posso fornecer informações detalhadas sobre nossos produtos! Me diga o nome do medicamento que você gostaria de saber mais informações (composição, fabricante, validade, como usar, etc.).');
            break;
          default:
            addBotMessage('Como seu assistente farmacêutico, posso ajudar com:\n\n• 💊 Análise de receitas médicas\n• 🔍 Sugestões de medicamentos para sintomas\n• ℹ️ Informações detalhadas sobre produtos\n• ⚠️ Verificação de alergias e contraindicações\n• 📋 Orientações de uso e dosagem\n• 🛒 Ajuda com compras\n\nO que você gostaria de saber?');
        }
      });
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
        
        await handlePrescriptionAnalysis(mockPrescriptionText);
      });
    }
  };

  const handleMedicalConsultation = async (message: string) => {
    try {
      const suggestions = await aiAssistant.suggestTreatment(message, userAllergies);
      
      let response = `Com base nos sintomas que você descreveu, aqui estão algumas sugestões:\n\n`;
      
      if (suggestions.length > 0) {
        suggestions.forEach((suggestion, index) => {
          response += `${index + 1}. **${suggestion.name}**\n`;
          response += `   • Dosagem: ${suggestion.dosage}\n`;
          response += `   • Frequência: ${suggestion.frequency}\n`;
          response += `   • Instruções: ${suggestion.instructions}\n`;
          if (suggestion.warnings.length > 0) {
            response += `   • Atenção: ${suggestion.warnings.join(', ')}\n`;
          }
          response += `\n`;
        });
        
        response += `⚠️ **IMPORTANTE**: Estas são apenas sugestões baseadas em sintomas comuns. Consulte sempre um médico ou farmacêutico para diagnóstico e tratamento adequados.`;
      } else {
        response = `Para os sintomas que você descreveu, recomendo que consulte um médico ou farmacêutico para uma avaliação adequada. Posso ajudar com informações sobre produtos específicos se você tiver uma receita médica.`;
      }
      
      addBotMessage(response);
    } catch (error) {
      console.error('Error in medical consultation:', error);
      addBotMessage('Desculpe, ocorreu um erro ao processar sua consulta. Por favor, tente novamente ou consulte diretamente um farmacêutico.');
    }
  };

  const handlePrescriptionAnalysis = async (prescriptionText: string) => {
    try {
      const analysis = await aiAssistant.analyzePrescription(prescriptionText);
      
      let response = `📋 **Análise da Receita:**\n\n`;
      
      if (analysis.medications.length > 0) {
        response += `**Medicamentos identificados:**\n`;
        analysis.medications.forEach((med, index) => {
          response += `${index + 1}. ${med.name} - ${med.dosage} ${med.frequency}`;
          if (med.duration) response += ` por ${med.duration}`;
          response += `\n`;
        });
        
        if (analysis.recommendations.length > 0) {
          response += `\n**Produtos disponíveis em nossa farmácia:**\n`;
          analysis.recommendations.forEach((rec, index) => {
            response += `${index + 1}. ${rec.name}\n`;
            response += `   • ${rec.instructions}\n`;
          });
        }
        
        if (analysis.allergiesCheck.length > 0) {
          response += `\n⚠️ **Verificação de Alergias:**\n`;
          response += `Os medicamentos podem conter: ${analysis.allergiesCheck.join(', ')}\n`;
          response += `Informe se você tem alergia a alguma dessas substâncias.\n`;
        }
        
        if (analysis.warnings.length > 0) {
          response += `\n💡 **Orientações importantes:**\n`;
          analysis.warnings.forEach(warning => {
            response += `• ${warning}\n`;
          });
        }
      } else {
        response = `Não consegui identificar medicamentos claramente nesta receita. Você pode me dizer quais medicamentos estão prescritos ou enviar uma imagem mais clara?`;
      }
      
      addBotMessage(response);
    } catch (error) {
      console.error('Error analyzing prescription:', error);
      addBotMessage('Desculpe, ocorreu um erro ao analisar a receita. Por favor, tente novamente ou consulte diretamente um farmacêutico.');
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
        description: "Ouvindo... Descreva seus sintomas ou pergunte sobre medicamentos.",
      });
      
      // Simulação de reconhecimento de voz - em um app real usaríamos a Web Speech API
      setTimeout(() => {
        setIsRecording(false);
        setNewMessage("Tenho dor de cabeça e febre");
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
        aria-label="Assistente farmacêutico"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>
      
      {isOpen && (
        <Card className={`fixed ${isMobile ? 'bottom-20 right-4 left-4' : 'bottom-24 right-8'} z-50 shadow-xl w-80 sm:w-96 h-[35rem] flex flex-col`}>
          <CardHeader className="bg-pharma-primary text-white py-3 px-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-white">
                  <img src="/placeholder.svg" alt="Assistente Farmacêutico" />
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">Assistente Farmacêutico</h3>
                  <p className="text-xs opacity-80">Sempre disponível</p>
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
                onClick={handleNavigateToProducts}
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
                  placeholder="Descreva seus sintomas ou perguntas..."
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
