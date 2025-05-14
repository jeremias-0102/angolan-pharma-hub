
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageSquare, X, Mic, StopCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: Date;
  type?: 'text' | 'audio';
  audioUrl?: string;
}

interface AIResponse {
  message: string;
  instructions?: string[];
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Simular mensagem de boas-vindas do suporte
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          content: "Olá! Sou o assistente virtual da BEGJNP Pharma. Como posso ajudar você hoje?",
          sender: 'support',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Scrollar para o final da conversa quando receber novas mensagens
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Função para processar a pergunta com IA
  const processWithAI = async (question: string): Promise<AIResponse> => {
    // Simulação de resposta IA - Numa implementação real, isto seria uma chamada para um API como OpenAI
    const commonResponses: Record<string, AIResponse> = {
      "cadastro": {
        message: "Para se cadastrar no BEGJNP Pharma, siga estes passos:",
        instructions: [
          "1. Clique no botão 'Entrar' no canto superior direito",
          "2. Na tela de login, clique em 'Criar conta'",
          "3. Preencha seus dados pessoais no formulário",
          "4. Confirme seu email através do link enviado",
          "5. Pronto! Agora você pode fazer compras na nossa farmácia"
        ]
      },
      "horário": {
        message: "A BEGJNP Pharma funciona nos seguintes horários:",
        instructions: [
          "Segunda a Sexta: 8h às 22h",
          "Sábados: 8h às 20h",
          "Domingos e Feriados: 9h às 18h"
        ]
      },
      "entrega": {
        message: "Sobre nossas entregas:",
        instructions: [
          "Realizamos entregas em toda a cidade",
          "O prazo médio é de 1-2 horas após a confirmação do pedido",
          "Entregas para região metropolitana podem levar até 24 horas",
          "Pedidos com prescrição médica têm prioridade"
        ]
      },
      "medicamentos": {
        message: "Sobre nossos medicamentos:",
        instructions: [
          "Trabalhamos com medicamentos genéricos e de marca",
          "Temos uma ampla variedade de produtos nacionais e importados",
          "Para medicamentos controlados, é necessária a receita médica",
          "Oferecemos desconto em medicamentos para tratamentos contínuos"
        ]
      }
    };
    
    // Busca por palavras-chave na pergunta
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("cadastr") || lowerQuestion.includes("registr") || lowerQuestion.includes("criar conta")) {
      return commonResponses["cadastro"];
    } else if (lowerQuestion.includes("horário") || lowerQuestion.includes("hora") || lowerQuestion.includes("funcionamento")) {
      return commonResponses["horário"];
    } else if (lowerQuestion.includes("entrega") || lowerQuestion.includes("receber") || lowerQuestion.includes("delivery")) {
      return commonResponses["entrega"];
    } else if (lowerQuestion.includes("medicamento") || lowerQuestion.includes("remédio") || lowerQuestion.includes("produto")) {
      return commonResponses["medicamentos"];
    }
    
    // Resposta genérica se nenhuma palavra-chave for encontrada
    return { 
      message: "Obrigado por sua pergunta. Posso ajudar com informações sobre nossos produtos, serviços, horários de funcionamento, processo de cadastro e entregas. Como posso te auxiliar melhor?"
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      // Processar com IA
      const aiResponse = await processWithAI(inputValue);
      
      // Criar mensagem de resposta
      let responseContent = aiResponse.message;
      
      // Adicionar instruções à resposta, se houver
      if (aiResponse.instructions && aiResponse.instructions.length > 0) {
        responseContent += "\n\n" + aiResponse.instructions.join("\n");
      }
      
      const supportMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: 'support',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, supportMessage]);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      
      // Mensagem de erro em caso de falha
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Desculpe, estou com dificuldades para processar sua mensagem no momento. Por favor, tente novamente mais tarde.",
        sender: 'support',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      audioChunksRef.current = [];
      
      recorder.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });
      
      recorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Add user audio message
        const audioMessage: Message = {
          id: Date.now().toString(),
          content: "Mensagem de áudio",
          sender: 'user',
          timestamp: new Date(),
          type: 'audio',
          audioUrl
        };
        
        setMessages(prev => [...prev, audioMessage]);
        
        // Simulate AI response to audio
        setTimeout(() => {
          const supportAudioMessage: Message = {
            id: Date.now().toString(),
            content: "Recebi seu áudio. Nesta versão de demonstração, estou respondendo com um texto, mas em uma implementação completa, eu retornaria um áudio também. Como posso ajudar?",
            sender: 'support',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, supportAudioMessage]);
        }, 1500);
      });
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone. Por favor, verifique as permissões do navegador.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Stop all tracks on the stream
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {/* Botão flutuante de chat */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-pharma-primary hover:bg-pharma-primary/90 z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Widget de chat */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 md:w-96 h-96 shadow-xl z-50 flex flex-col">
          <CardHeader className="py-3 px-4 border-b flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-medium">Assistente Virtual</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0 flex-grow overflow-hidden">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'support' && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/assets/pharmacy-logo.png" alt="Suporte" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-pharma-primary text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.type === 'audio' ? (
                      <div className="my-1">
                        <audio src={message.audioUrl} controls className="max-w-full h-8"></audio>
                      </div>
                    ) : (
                      <p className="text-sm">{formatMessage(message.content)}</p>
                    )}
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarImage src={user?.avatar || undefined} alt={user?.name || 'Usuário'} />
                      <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-3 border-t">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-grow"
                disabled={isRecording}
              />
              {!isRecording ? (
                <>
                  <Button
                    onClick={startRecording}
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    title="Enviar mensagem de áudio"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!inputValue.trim()}
                    size="icon"
                    className="h-8 w-8 bg-pharma-primary hover:bg-pharma-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={stopRecording}
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  title="Parar gravação"
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;
