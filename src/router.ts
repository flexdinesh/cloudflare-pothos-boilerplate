import { Router } from 'itty-router';
import { handleGraphQLRequest } from './apollo';
import { handlePlaygroundRequest } from './apollo/playground';
import { setCors } from './apollo/cors';
import { graphQLOptions } from './apollo';

const router = Router();

router.get('/', () => {
  const data = {
    status: 'ok',
    NODE_ENV: process.env.NODE_ENV,
  };
  const json = JSON.stringify(data, null, 2);
  return new Response(json, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
});

router.post(graphQLOptions.baseEndpoint, async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('', {
      status: 204,
    });
  }
  try {
    const response = await handleGraphQLRequest(request, graphQLOptions);
    if (graphQLOptions.cors) {
      setCors(response, graphQLOptions.cors);
    }
    return response;
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Response(graphQLOptions.debug ? (err as unknown as any) : 'Something went wrong', {
      status: 500,
    });
  }
});

router.get(graphQLOptions.playgroundEndpoint, (request: Request) => {
  // TODO: disable in prod
  return handlePlaygroundRequest(request, graphQLOptions);
});

router.all(
  '*',
  () =>
    new Response('404, not found!', {
      status: 404,
    })
);

export const handleRequest = (request: Request) => router.handle(request);
