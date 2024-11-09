import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { ChatProvider } from './contexts/ChatContext.tsx'
import { SocketProvider } from './contexts/SocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <ChatProvider>
        <QueryClientProvider client={new QueryClient()}>
            <Toaster />
            <BrowserRouter>
              <App />
            </BrowserRouter>
          {/* <ReactQueryDevtools initialIsOpen = {false} /> */}
        </QueryClientProvider>
      </ChatProvider>
    </SocketProvider>
  </StrictMode>
)
