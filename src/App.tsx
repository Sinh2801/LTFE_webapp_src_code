import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './components/contexts/AuthContext'
import { ToastProvider } from './components/common/Toast'
import router from './app/router'
import './App.css'

function App() {
  return (
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
  )
}

export default App
