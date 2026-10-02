import react from '@vitejs/plugin-react'
import {fileURLToPath} from 'node:url'
import {defineConfig} from 'vite'

export default defineConfig({
  plugins: [react()],
  // Keep the CRA-era REACT_APP_ names so Phase and Netlify env vars need no renaming
  envPrefix: 'REACT_APP_',
  resolve: {
    alias: {
      '@gql': fileURLToPath(new URL('./src/graphql/index.tsx', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/graphql': 'http://localhost:5502',
    },
  },
  build: {
    // Netlify publishes build/, matching the CRA output directory
    outDir: 'build',
  },
})
