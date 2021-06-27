import React from 'react'
import ReactDOM from 'react-dom'
import {useApollo} from './apollo'
import {ApolloProvider} from '@apollo/client'
import App from './App'
import './styles.less'

const AbacApp = () => {
  const client = useApollo()

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <AbacApp />
  </React.StrictMode>,
  document.getElementById('root'),
)
