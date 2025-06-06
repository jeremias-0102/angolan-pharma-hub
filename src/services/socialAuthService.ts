
export interface SocialAuthProvider {
  id: string;
  name: string;
  url: string;
}

export const socialProviders: SocialAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    url: '#'
  },
  {
    id: 'facebook',
    name: 'Facebook', 
    url: '#'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    url: '#'
  }
];

// Função para simular login social - cria usuário automaticamente
export const handleSocialLogin = async (provider: string): Promise<{ user: any; token: string }> => {
  console.log(`🔄 Iniciando login com ${provider}...`);
  
  return new Promise((resolve) => {
    // Simula um delay de autenticação
    setTimeout(() => {
      // Simula dados do usuário retornados pelo provedor social
      const socialUser = {
        id: `${provider}-${Date.now()}`,
        name: `Usuário ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
        email: `usuario.${provider}@exemplo.com`,
        avatar: '',
        provider: provider,
        role: 'client',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const token = `fake-jwt-token-${provider}-${Date.now()}`;

      console.log(`✅ Login com ${provider} bem-sucedido!`);
      console.log('👤 Usuário:', socialUser);
      
      resolve({ user: socialUser, token });
    }, 1500);
  });
};

// Função placeholder para processar callback
export const handleAuthCallback = async (
  provider: string, 
  code: string, 
  state: string
): Promise<any> => {
  console.log(`✅ Processando callback de ${provider}`);
  return handleSocialLogin(provider);
};
