import {ApolloClient, ApolloLink, HttpLink, InMemoryCache, from} from '@apollo/client'
import {useMemo} from 'react'

// eslint-disable-next-line no-undef
const {REACT_APP_SERVER_URL} = process.env

let client: ApolloClient

const createApolloClient = (): ApolloClient => {
  // Strip __typename from variables
  const omitTypename = new ApolloLink((operation, forward) => {
    if (operation.variables) {
      const omitTypename = (key, value) => (key === '__typename' ? undefined : value)
      operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename)
    }
    return forward(operation)
  })

  const httpLink = new HttpLink({
    uri: `${REACT_APP_SERVER_URL}/graphql`, // Server URL (must be absolute)
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  })

  return new ApolloClient({
    link: from([omitTypename, httpLink]),
    cache: new InMemoryCache({}),
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initializeApollo = (initialState: Record<string, any> = null): ApolloClient => {
  const _apolloClient = client ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingCache = _apolloClient.extract() as Record<string, any>

    // Restore the cache with the merged data
    _apolloClient.cache.restore({...existingCache, ...initialState})
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!client) client = _apolloClient

  return _apolloClient
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useApollo = (initialState?: Record<string, any>): ApolloClient =>
  useMemo(() => initializeApollo(initialState), [initialState])
