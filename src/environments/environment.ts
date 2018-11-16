// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  tokenWhitelistedDomains: [ new RegExp('localhost:8080') ], // dominios em que permito que meu token pode ser enviado
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ]    // local para onde não quero enviar o token
};
