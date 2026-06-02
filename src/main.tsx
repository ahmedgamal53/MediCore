import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Authprovider from './context/Authprovider.tsx'
import QueryProvider from './context/QueryProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authprovider>
  <QueryProvider>
    <App />
  </QueryProvider>
    </Authprovider>
  </StrictMode>,
)
