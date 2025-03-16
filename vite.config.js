import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      include: '**/*.jsx',
      jsxRuntime: 'automatic',
      fastRefresh: true
    }),
    tailwindcss(),
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json']
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  server: {
    host: "0.0.0.0",
    fs: {
      strict: false,
    },
  }
})
