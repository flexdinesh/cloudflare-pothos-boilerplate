import { Response as ApolloResponse } from 'apollo-server-env';
import { CorsConfig } from './index';

export const setCors = (response: Response | ApolloResponse, config: CorsConfig): void => {
  // Change to use the nullish coalescing operator (||) after upgrade to webpack 5
  // https://github.com/webpack/webpack/issues/10227
  response.headers.set('Access-Control-Allow-Credentials', config.allowCredentials || 'true');

  response.headers.set(
    'Access-Control-Allow-Headers',
    config.allowHeaders || 'application/json, Content-type'
  );

  response.headers.set('Access-Control-Allow-Methods', config.allowMethods || 'GET, POST');

  // Todo: Add request domain matching for multiple origins
  response.headers.set('Access-Control-Allow-Origin', config.allowOrigin || '*');

  response.headers.set('X-Content-Type-Options', 'nosniff');
};
