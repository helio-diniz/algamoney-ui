export const environment = {
  production: true,
  apiUrl: 'https://algamoney-helio-diniz-api.herokuapp.com',
  tokenWhitelistedDomains: [ new RegExp('algamoney-helio-diniz-api.herokuapp.com') ],
  // dominios em que permito que meu token pode ser enviado
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token')]
   // local para onde não quero enviar o token
};
