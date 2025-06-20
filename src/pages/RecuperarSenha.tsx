
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

// Lista dos emails cadastrados no sistema (mesma do AuthContext)
const REGISTERED_EMAILS = [
  'supervisor@pharma.com',
  'admin@pharma.com', 
  'farmaceutico@pharma.com',
  'cliente@pharma.com'
];

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'reset' | 'invalid-email'>('request');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Se tiver token na URL, mostrar formulário de reset
  React.useEffect(() => {
    if (token) {
      setStep('reset');
    }
  }, [token]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError('');

    try {
      // Verificar se o email existe no sistema
      const emailExists = REGISTERED_EMAILS.includes(email.toLowerCase());
      
      if (!emailExists) {
        setEmailError('Email inválido. Este email não está cadastrado no sistema.');
        setStep('invalid-email');
        setIsLoading(false);
        return;
      }

      // Simular envio de email para emails válidos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Link de recuperação enviado!",
        description: "Verifique seu email para o link de redefinição de senha.",
      });
      
      // Em desenvolvimento, vamos simular o processo
      toast({
        title: "Modo de desenvolvimento",
        description: "Clique aqui para simular o reset de senha",
        action: (
          <Button 
            size="sm" 
            onClick={() => setStep('reset')}
            className="bg-pharma-primary"
          >
            Simular Reset
          </Button>
        ),
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao enviar o email. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem.",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simular reset de senha (em produção seria uma chamada real ao backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Senha redefinida!",
        description: "A sua senha foi alterada com sucesso. Pode agora fazer login.",
      });
      
      // Redirecionar para página de login
      navigate('/login');
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao redefinir a senha. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setStep('request');
    setEmailError('');
    setEmail('');
  };

  const handleCreateAccount = () => {
    navigate('/login?tab=register');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="mb-4 text-pharma-primary hover:text-pharma-primary/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Login
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 'request' || step === 'invalid-email' ? 'Recuperar Senha' : 'Redefinir Senha'}
              </CardTitle>
              <CardDescription>
                {step === 'request' || step === 'invalid-email'
                  ? 'Digite o seu email para receber um link de recuperação'
                  : 'Digite a sua nova senha'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {(step === 'request' || step === 'invalid-email') ? (
                <form onSubmit={handleRequestReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="o.seu@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError('');
                          if (step === 'invalid-email') {
                            setStep('request');
                          }
                        }}
                        className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="text-sm text-red-500">{emailError}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-pharma-primary hover:bg-pharma-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verificando...' : 'Enviar Link de Recuperação'}
                  </Button>

                  {step === 'invalid-email' && (
                    <div className="space-y-3 pt-4 border-t">
                      <p className="text-sm text-gray-600 text-center">
                        Não tem uma conta? Crie uma agora:
                      </p>
                      <div className="space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCreateAccount}
                          className="w-full"
                        >
                          Criar Conta
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleTryAgain}
                          className="w-full text-pharma-primary"
                        >
                          Tentar Outro Email
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Digite a nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirme a nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-pharma-primary hover:bg-pharma-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default RecuperarSenha;
