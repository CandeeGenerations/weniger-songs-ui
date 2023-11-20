const {CracoAliasPlugin, configPaths} = require('react-app-alias')
const CracoWebpackResolve = require('craco-webpack-resolve')

const aliasMap = configPaths('./tsconfig.paths.json')

module.exports = {
  eslint: {
    enable: process.env.NODE_ENV !== 'production',
  },
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {
        tsConfig: './tsconfig.json',
        baseUrl: './',
        alias: aliasMap,
      },
    },
    {
      plugin: CracoWebpackResolve,
      options: {
        resolve: {
          fallback: {
            'react/jsx-runtime': 'react/jsx-runtime.js',
            'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
          },
        },
      },
    },
  ],
}
