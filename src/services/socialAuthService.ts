
export interface SocialAuthProvider {
  id: string;
  name: string;
  url: string;
}

export const socialProviders: SocialAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    url: 'https://accounts.google.com/oauth/authorize'
  },
  {
    id: 'facebook',
    name: 'Facebook', 
    url: 'https://www.facebook.com/v18.0/dialog/oauth'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    url: 'https://twitter.com/i/oauth2/authorize'
  }
];

// Função melhorada para lidar com autenticação social real
export const handleSocialLogin = async (provider: string): Promise<void> => {
  console.log(`Iniciando login com ${provider}...`);
  
  try {
    switch (provider) {
      case 'google':
        await initiateGoogleLogin();
        break;
        
      case 'facebook':
        await initiateFacebookLogin();
        break;
        
      case 'twitter':
        await initiateTwitterLogin();
        break;
        
      default:
        throw new Error(`Provedor ${provider} não suportado`);
    }
  } catch (error) {
    console.error(`Erro no login ${provider}:`, error);
    throw error;
  }
};

// Google OAuth
const initiateGoogleLogin = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id';
    const redirectUri = `${window.location.origin}/auth/callback/google`;
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state: generateStateToken(),
      access_type: 'offline',
      prompt: 'consent'
    });

    const authUrl = `https://accounts.google.com/oauth/authorize?${params}`;
    
    // Abrir popup para autenticação
    const popup = window.open(authUrl, 'googleAuth', 'width=500,height=600');
    
    if (!popup) {
      reject(new Error('Popup bloqueado. Permita popups para este site.'));
      return;
    }

    // Escutar o retorno do popup
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        reject(new Error('Login cancelado pelo utilizador'));
      }
    }, 1000);

    // Escutar mensagem do popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        resolve();
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        reject(new Error(event.data.error || 'Erro na autenticação'));
      }
    };

    window.addEventListener('message', messageListener);
  });
};

// Facebook OAuth
const initiateFacebookLogin = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID || 'demo-app-id';
    const redirectUri = `${window.location.origin}/auth/callback/facebook`;
    
    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email,public_profile',
      state: generateStateToken()
    });

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
    
    const popup = window.open(authUrl, 'facebookAuth', 'width=500,height=600');
    
    if (!popup) {
      reject(new Error('Popup bloqueado. Permita popups para este site.'));
      return;
    }

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        reject(new Error('Login cancelado pelo utilizador'));
      }
    }, 1000);

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'FACEBOOK_AUTH_SUCCESS') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        resolve();
      } else if (event.data.type === 'FACEBOOK_AUTH_ERROR') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        reject(new Error(event.data.error || 'Erro na autenticação'));
      }
    };

    window.addEventListener('message', messageListener);
  });
};

// Twitter OAuth
const initiateTwitterLogin = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const clientId = import.meta.env.VITE_TWITTER_CLIENT_ID || 'demo-client-id';
    const redirectUri = `${window.location.origin}/auth/callback/twitter`;
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'tweet.read users.read',
      state: generateStateToken(),
      code_challenge: generateCodeChallenge(),
      code_challenge_method: 'S256'
    });

    const authUrl = `https://twitter.com/i/oauth2/authorize?${params}`;
    
    const popup = window.open(authUrl, 'twitterAuth', 'width=500,height=600');
    
    if (!popup) {
      reject(new Error('Popup bloqueado. Permita popups para este site.'));
      return;
    }

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        reject(new Error('Login cancelado pelo utilizador'));
      }
    }, 1000);

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'TWITTER_AUTH_SUCCESS') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        resolve();
      } else if (event.data.type === 'TWITTER_AUTH_ERROR') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        reject(new Error(event.data.error || 'Erro na autenticação'));
      }
    };

    window.addEventListener('message', messageListener);
  });
};

// Funções auxiliares
const generateStateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

const generateCodeChallenge = (): string => {
  const array = new Uint32Array(28);
  crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
};

// Função para processar o retorno da autenticação
export const handleAuthCallback = async (
  provider: string, 
  code: string, 
  state: string
): Promise<any> => {
  console.log(`Processando callback de ${provider}...`);
  
  try {
    // Em produção, aqui faria a troca do código por token no backend
    const response = await fetch(`/api/auth/${provider}/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    if (!response.ok) {
      throw new Error('Erro na autenticação');
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error(`Erro no callback ${provider}:`, error);
    throw error;
  }
};
