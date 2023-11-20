import {ApolloProvider} from '@apollo/client'
import {ConfigProvider} from 'antd'
import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App'
import {useApollo} from './apollo'

const MainApp = () => {
  const client = useApollo()

  return (
    <ApolloProvider client={client}>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 10,
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </ApolloProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
)
