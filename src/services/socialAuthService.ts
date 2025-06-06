
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

// Função simplificada para demo - não tenta fazer login real
export const handleSocialLogin = async (provider: string): Promise<void> => {
  console.log(`🔄 Login com ${provider} solicitado...`);
  
  // Para demo, apenas simula o processo
  return new Promise((resolve, reject) => {
    // Simula um delay
    setTimeout(() => {
      console.log(`ℹ️ Login social com ${provider} não está configurado`);
      console.log(`ℹ️ Use as credenciais demo: admin@pharma.com / admin123`);
      
      // Rejeita com mensagem informativa
      reject(new Error(`Login com ${provider} não está disponível na versão demo. Use as credenciais: admin@pharma.com / admin123`));
    }, 1000);
  });
};

// Função placeholder para processar callback
export const handleAuthCallback = async (
  provider: string, 
  code: string, 
  state: string
): Promise<any> => {
  console.log(`ℹ️ Callback de ${provider} não implementado na versão demo`);
  throw new Error('Autenticação social não disponível na versão demo');
};
