'use client';

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { ReactNode } from 'react';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
});

const wsLink = typeof window !== 'undefined'
  ? new GraphQLWsLink(
      createClient({
        url: process.env.NEXT_PUBLIC_WS_URL + '/graphql',
        on: {
          connected: () => console.log('[WS] Connected'),
          closed: (event) => console.log('[WS] Closed', event),
          error: (error) => console.error('[WS] Error', error),
          connecting: () => console.log('[WS] Connecting...'),
        },
      }),
    )
  : null;

const nonceLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'x-nonce': Date.now().toString(),
    },
  }));

  return forward(operation);
});

const splitLink = wsLink
  ? ApolloLink.split(
      ({ query }) => {
        const def = getMainDefinition(query);
        return def.kind === 'OperationDefinition' && def.operation === 'subscription';
      },
      wsLink,
      nonceLink.concat(httpLink),
    )
  : nonceLink.concat(httpLink);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}