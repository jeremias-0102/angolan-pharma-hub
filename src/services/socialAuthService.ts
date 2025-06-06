
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

// Função para simular escolha de conta Google
const simulateGoogleAccountSelection = (): Promise<{ name: string; email: string; avatar: string }> => {
  return new Promise((resolve) => {
    // Simula as contas Google disponíveis no computador
    const googleAccounts = [
      {
        name: 'João Silva',
        email: 'joao.silva@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Joao+Silva&background=4285f4&color=ffffff'
      },
      {
        name: 'Maria Santos',
        email: 'maria.santos@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=4285f4&color=ffffff'
      },
      {
        name: 'Pedro Costa',
        email: 'pedro.costa@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Pedro+Costa&background=4285f4&color=ffffff'
      }
    ];

    // Simula uma interface de seleção de conta
    setTimeout(() => {
      const accountNames = googleAccounts.map((acc, index) => `${index + 1}. ${acc.name} (${acc.email})`).join('\n');
      
      const choice = prompt(
        `Escolha uma conta Google:\n\n${accountNames}\n\nDigite o número da conta (1-${googleAccounts.length}):`
      );

      const accountIndex = parseInt(choice || '1') - 1;
      const selectedAccount = googleAccounts[accountIndex] || googleAccounts[0];
      
      console.log('✅ Conta Google selecionada:', selectedAccount.name, selectedAccount.email);
      resolve(selectedAccount);
    }, 500);
  });
};

// Função para simular login social - cria usuário automaticamente
export const handleSocialLogin = async (provider: string): Promise<{ user: any; token: string }> => {
  console.log(`🔄 Iniciando login com ${provider}...`);
  
  return new Promise(async (resolve) => {
    let socialUserData;

    if (provider === 'google') {
      // Para Google, permite escolher a conta
      try {
        const selectedAccount = await simulateGoogleAccountSelection();
        socialUserData = {
          id: `google-${Date.now()}`,
          name: selectedAccount.name,
          email: selectedAccount.email,
          avatar: selectedAccount.avatar,
          provider: 'google',
          role: 'client',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      } catch (error) {
        // Se o usuário cancelar a seleção, usa dados padrão
        socialUserData = {
          id: `google-${Date.now()}`,
          name: 'Usuário Google',
          email: 'usuario.google@gmail.com',
          avatar: 'https://ui-avatars.com/api/?name=Usuario+Google&background=4285f4&color=ffffff',
          provider: 'google',
          role: 'client',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
    } else {
      // Para outros provedores, usa dados simulados
      socialUserData = {
        id: `${provider}-${Date.now()}`,
        name: `Usuário ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
        email: `usuario.${provider}@exemplo.com`,
        avatar: `https://ui-avatars.com/api/?name=Usuario+${provider}&background=random&color=ffffff`,
        provider: provider,
        role: 'client',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    // Simula um delay de autenticação
    setTimeout(() => {
      const token = `fake-jwt-token-${provider}-${Date.now()}`;

      console.log(`✅ Login com ${provider} bem-sucedido!`);
      console.log('👤 Usuário:', socialUserData);
      
      resolve({ user: socialUserData, token });
    }, 1000);
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
