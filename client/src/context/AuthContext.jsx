import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('mp_token')
    if (token) {
      api.get('/auth/me')
        .then(r => setUser(r.data))
        .catch(() => { localStorage.removeItem('mp_token'); localStorage.removeItem('mp_user') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('mp_token', data.token)
    localStorage.setItem('mp_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    // No JWT returned — user must verify email first
    return data
  }

  const loginWithGoogle = async (idToken) => {
    const { data } = await api.post('/auth/google', { idToken })
    localStorage.setItem('mp_token', data.token)
    localStorage.setItem('mp_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('mp_token')
    localStorage.removeItem('mp_user')
    setUser(null)
    window.location.href = '/'
  }

  const refreshUser = async () => {
    const { data } = await api.get('/auth/me')
    setUser(data)
    return data
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
