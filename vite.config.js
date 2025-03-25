import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
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
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom'],
            'home': ['./src/pages/HomePage.jsx'],
            'explore': ['./src/pages/ExplorePage.jsx'],
            'details': ['./src/pages/DetailsPage.jsx'],
            'search': ['./src/pages/SearchPage.jsx']
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: true
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx'
        }
      }
    },
    server: {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
      },
      proxy: {
        '/api/tmdb': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/tmdb/, ''),
          headers: {
            'Authorization': `Bearer ${env.VITE_API_ACCESS_TOKEN}`
          }
        }
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Cross-Origin-Embedder-Policy': 'credentialless',
        'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
      },
    },
    preview: {
      port: 3000
    }
  };
});
