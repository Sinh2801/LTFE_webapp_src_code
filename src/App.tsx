import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAppDispatch } from './app/hook'
import { useAppSelector } from './app/hook'
import { restoreSession } from './app/slices/authSlice'
import { fetchLibrary } from './app/slices/librarySlice'
import { ToastProvider } from './components/common/Toast'
import router from './app/router'
import './App.css'
import './styles/auth.css'
import './styles/buyer.css'
import './styles/account.css'

function App() {
    const dispatch = useAppDispatch()
    const userId = useAppSelector((state) => state.auth.user?.id)

    useEffect(() => {
        dispatch(restoreSession())
    }, [dispatch])
    useEffect(() => {
        if (userId) dispatch(fetchLibrary())
    }, [dispatch, userId])

    return (
        <ToastProvider>
            <RouterProvider router={router} />
        </ToastProvider>
    )
}

export default App
