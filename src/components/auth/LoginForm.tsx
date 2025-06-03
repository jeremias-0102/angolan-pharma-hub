
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Get user from context after login
      if (user) {
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${user.name}!`,
        });

        // Redirecionar baseado no role do usuário
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'pharmacist':
            navigate('/pharmacist');
            break;
          case 'delivery':
            navigate('/delivery');
            break;
          case 'client':
            navigate('/');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Email ou senha incorretos. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implementar recuperação de senha
    toast({
      title: "Recuperação de senha",
      description: "Funcionalidade em desenvolvimento. Entre em contato com o administrador.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Entrar</CardTitle>
          <CardDescription className="text-center">
            Entre com seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-pharma-primary hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-pharma-primary hover:bg-pharma-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-pharma-primary hover:underline"
                >
                  Registre-se
                </button>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
