import { ApolloServer } from 'apollo-server-cloudflare';
import { graphqlCloudflare } from 'apollo-server-cloudflare/dist/cloudflareApollo';
import { Request as ApolloRequest, Response } from 'apollo-server-env';
import { schema } from '../schema';

export type CorsConfig = {
  allowCredentials?: string;
  allowHeaders?: string;
  allowMethods?: string;
  allowOrigin?: string;
};

export type GraphQLConfig = {
  baseEndpoint: string;
  playgroundEndpoint: string;
  forwardUnmatchedRequestsToOrigin: boolean;
  debug: boolean;
  cors: CorsConfig;
};

export const graphQLOptions: GraphQLConfig = {
  baseEndpoint: '/graphql',
  playgroundEndpoint: '/graphql/playground',
  // When a request's path isn't matched, forward it to the origin
  forwardUnmatchedRequestsToOrigin: false,
  // Enable debug mode to return script errors directly in browser
  // TODO: disable in prod deploys
  debug: true,
  // Enable CORS headers on GraphQL requests
  // or pass an object to configure each header
  cors: {
    allowCredentials: 'true',
    allowHeaders: 'Content-type',
    allowOrigin: '*',
    allowMethods: 'GET, POST, PUT',
  },
};

const createServer = (_graphQLOptions: GraphQLConfig) =>
  new ApolloServer({
    schema,
    introspection: true,
  });

export const handleGraphQLRequest = async (
  request: Request,
  graphQLOptions: GraphQLConfig
): Promise<Response> => {
  const server = createServer(graphQLOptions);
  await server.start();
  return graphqlCloudflare(() =>
    server.createGraphQLServerOptions(request as unknown as ApolloRequest)
  )(request as unknown as ApolloRequest);
};
