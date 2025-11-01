/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const path = require('path')

module.exports = {
  eslint: {
    // Disable ESLint webpack plugin due to incompatibility with ESLint 9
    // Run linting separately with: pnpm eslint
    enable: false,
  },
  webpack: {
    alias: {
      '@gql': path.resolve(__dirname, 'src/graphql/index.tsx'),
    },
    configure: (webpackConfig) => {
      // Add fallback resolution for React JSX runtime
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        'react/jsx-runtime': require.resolve('react/jsx-runtime'),
        'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
      }

      // Fix Babel runtime import issue by removing ModuleScopePlugin restriction
      const ModuleScopePlugin = webpackConfig.resolve.plugins.find(
        (plugin) => plugin.constructor && plugin.constructor.name === 'ModuleScopePlugin',
      )
      if (ModuleScopePlugin) {
        webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter((plugin) => plugin !== ModuleScopePlugin)
      }

      return webpackConfig
    },
  },
  devServer: (devServerConfig) => {
    // Convert deprecated onAfterSetupMiddleware to setupMiddlewares
    if (devServerConfig.onAfterSetupMiddleware) {
      const afterMiddleware = devServerConfig.onAfterSetupMiddleware
      delete devServerConfig.onAfterSetupMiddleware

      devServerConfig.setupMiddlewares = (middlewares, devServer) => {
        // Call the old middleware function
        afterMiddleware(devServer)
        return middlewares
      }
    }

    // Convert deprecated onBeforeSetupMiddleware to setupMiddlewares
    if (devServerConfig.onBeforeSetupMiddleware) {
      const beforeMiddleware = devServerConfig.onBeforeSetupMiddleware
      delete devServerConfig.onBeforeSetupMiddleware

      const existingSetup = devServerConfig.setupMiddlewares
      devServerConfig.setupMiddlewares = (middlewares, devServer) => {
        // Call the old middleware function
        beforeMiddleware(devServer)
        // Call existing setup if it exists
        return existingSetup ? existingSetup(middlewares, devServer) : middlewares
      }
    }

    // Convert deprecated https to server
    if (devServerConfig.https !== undefined) {
      devServerConfig.server = devServerConfig.https ? 'https' : 'http'
      delete devServerConfig.https
    }

    return devServerConfig
  },
}
