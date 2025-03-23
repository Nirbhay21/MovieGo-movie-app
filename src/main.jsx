// Import passive events module first to ensure it runs before any other code
import './utils/passiveEvents';

import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

// Core state and routing
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

// Application imports
import store from './redux/store.js'
import router from './routes/index'
import ErrorBoundary from './components/ErrorBoundary'
import PageLoader from './components/PageLoader'

// Styles
import './index.css'

// Create accessibility announcer
const announcer = document.createElement('div')
announcer.setAttribute('aria-live', 'polite')
announcer.setAttribute('aria-atomic', 'true')
announcer.setAttribute('class', 'sr-only')
document.body.appendChild(announcer)

// Set root element role
const root = document.getElementById('root')
root.setAttribute('role', 'application')
root.setAttribute('aria-label', 'MovieGo application')

// Initialize root
createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <Suspense fallback={
          <div aria-busy="true">
            <PageLoader />
          </div>
        }>
          <RouterProvider router={router} />
        </Suspense>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
)

// Service worker registration
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(error => {
      console.error('Service worker registration failed:', error)
      announcer.textContent = 'Offline mode is currently unavailable'
    })
  })
}
