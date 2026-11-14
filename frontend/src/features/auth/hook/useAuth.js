import { setError, setLoading, setUser } from '../state/auth.slice'
import { register,login } from '../services/auth.api'
import { useDispatch, useSelector } from 'react-redux'

export const useAuth = () => {
    const dispatch = useDispatch()
    const { user, loading, error } = useSelector((state) => state.auth)

    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await register({ email, contact, password, fullname, isSeller })
            dispatch(setUser(data.user))
            return { success: true, data }
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Registration failed'
            dispatch(setError(message))
            return { success: false, error: message }
        } finally {
            dispatch(setLoading(false))
        }
    }
    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return { success: true, data }
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Login failed'
            dispatch(setError(message))
            return { success: false, error: message }
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { handleRegister, user, loading, error ,handleLogin}
}
