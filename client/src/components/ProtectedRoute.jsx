import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="loading-center"><div className="spinner" /></div>
  )

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    const redirect = user.role === 'admin' ? '/admin' : user.role === 'mentor' ? '/mentor/dashboard' : '/mentee/dashboard'
    return <Navigate to={redirect} replace />
  }

  return children
}
