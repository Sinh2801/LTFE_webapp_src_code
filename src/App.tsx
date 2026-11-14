import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAppDispatch } from './app/hook'
import { restoreSession } from './app/slices/authSlice'
import { ToastProvider } from './components/common/Toast'
import router from './app/router'
import './App.css'
import './styles/auth.css'

function App() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(restoreSession())
    }, [dispatch])

    return (
        <ToastProvider>
            <RouterProvider router={router} />
        </ToastProvider>
    )
}

export default App
