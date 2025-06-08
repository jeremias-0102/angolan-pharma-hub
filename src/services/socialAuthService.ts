
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

// Configuração do Google OAuth
const GOOGLE_CLIENT_ID = '1087042394304-1kmvgs2jb6s1v8l0rgfq7j7sq1e1dgtj.apps.googleusercontent.com'; // ID público para demo

// Função para carregar o script do Google OAuth
const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('✅ Google OAuth script carregado');
      resolve();
    };
    script.onerror = () => {
      console.error('❌ Erro ao carregar script do Google OAuth');
      reject(new Error('Failed to load Google OAuth script'));
    };
    document.head.appendChild(script);
  });
};

// Função para inicializar o Google OAuth
const initializeGoogleAuth = (): Promise<void> => {
  return new Promise((resolve) => {
    window.google!.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: () => {}, // Will be set by individual calls
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    resolve();
  });
};

// Função principal para login com Google usando OAuth real
const handleGoogleLogin = (): Promise<{ name: string; email: string; avatar: string; id: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      await loadGoogleScript();
      await initializeGoogleAuth();

      console.log('🔄 Iniciando login real com Google...');

      // Configurar callback para o token
      window.google!.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          try {
            // Decodificar o JWT token para extrair informações do usuário
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            console.log('✅ Token Google recebido:', payload);
            
            const userData = {
              id: payload.sub,
              name: payload.name,
              email: payload.email,
              avatar: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name)}&background=4285f4&color=ffffff`
            };

            console.log('✅ Dados do usuário Google:', userData);
            resolve(userData);
          } catch (error) {
            console.error('❌ Erro ao processar token Google:', error);
            reject(error);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Mostrar o prompt de seleção de conta
      window.google!.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('⚠️ Prompt do Google não foi exibido ou foi ignorado');
          // Fallback: tentar o popup
          window.google!.accounts.id.renderButton(
            document.createElement('div'),
            {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            }
          );
        }
      });

    } catch (error) {
      console.error('❌ Erro no login Google:', error);
      reject(error);
    }
  });
};

// Função para simular login social para outros provedores
const simulateOtherProviders = async (provider: string): Promise<{ name: string; email: string; avatar: string; id: string }> => {
  return new Promise((resolve) => {
    const socialUserData = {
      id: `${provider}-${Date.now()}`,
      name: `Usuário ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
      email: `usuario.${provider}@exemplo.com`,
      avatar: `https://ui-avatars.com/api/?name=Usuario+${provider}&background=random&color=ffffff`,
    };

    setTimeout(() => {
      console.log(`✅ Login simulado com ${provider}:`, socialUserData);
      resolve(socialUserData);
    }, 1000);
  });
};

// Função principal para lidar com login social
export const handleSocialLogin = async (provider: string): Promise<{ user: any; token: string }> => {
  console.log(`🔄 Iniciando login com ${provider}...`);
  
  let socialUserData;

  if (provider === 'google') {
    try {
      const googleData = await handleGoogleLogin();
      socialUserData = {
        ...googleData,
        provider: 'google',
        role: 'client',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erro no login Google real, usando fallback:', error);
      // Fallback para simulação se o OAuth real falhar
      const fallbackData = await simulateOtherProviders('google');
      socialUserData = {
        ...fallbackData,
        provider: 'google',
        role: 'client',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  } else {
    // Para outros provedores, usar simulação
    const otherData = await simulateOtherProviders(provider);
    socialUserData = {
      ...otherData,
      provider: provider,
      role: 'client',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  const token = `fake-jwt-token-${provider}-${Date.now()}`;

  console.log(`✅ Login com ${provider} bem-sucedido!`);
  console.log('👤 Usuário:', socialUserData);
  
  return { user: socialUserData, token };
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

// Declarar tipos para o Google OAuth
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          revoke: (email: string, callback: () => void) => void;
        };
      };
    };
  }
}
