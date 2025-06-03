
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

export const handleSocialLogin = (provider: string): void => {
  console.log(`Initiating ${provider} login...`);
  
  switch (provider) {
    case 'google':
      // In a real app, you would configure OAuth with your Google credentials
      const googleParams = new URLSearchParams({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        redirect_uri: `${window.location.origin}/auth/callback/google`,
        response_type: 'code',
        scope: 'openid email profile',
        state: 'random_state_string'
      });
      window.open(`https://accounts.google.com/oauth/authorize?${googleParams}`, '_self');
      break;
      
    case 'facebook':
      const facebookParams = new URLSearchParams({
        client_id: 'YOUR_FACEBOOK_APP_ID',
        redirect_uri: `${window.location.origin}/auth/callback/facebook`,
        response_type: 'code',
        scope: 'email,public_profile',
        state: 'random_state_string'
      });
      window.open(`https://www.facebook.com/v18.0/dialog/oauth?${facebookParams}`, '_self');
      break;
      
    case 'twitter':
      const twitterParams = new URLSearchParams({
        client_id: 'YOUR_TWITTER_CLIENT_ID',
        redirect_uri: `${window.location.origin}/auth/callback/twitter`,
        response_type: 'code',
        scope: 'tweet.read users.read',
        state: 'random_state_string',
        code_challenge: 'challenge',
        code_challenge_method: 'plain'
      });
      window.open(`https://twitter.com/i/oauth2/authorize?${twitterParams}`, '_self');
      break;
      
    default:
      console.error('Unsupported social provider:', provider);
  }
};
