import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      setStatus('error')
      setMessage('No verification token found in this link.')
      return
    }

    api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(({ data }) => {
        localStorage.setItem('mp_token', data.token)
        localStorage.setItem('mp_user', JSON.stringify(data.user))
        setStatus('success')
        toast.success('Email verified! Welcome to AspireAlly 🎉')
        setTimeout(() => {
          const role = data.user.role
          navigate(role === 'mentor' ? '/mentor/dashboard' : role === 'admin' ? '/admin' : '/mentee/dashboard')
        }, 2000)
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.')
      })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 48, textDecoration: 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>AA</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-.02em' }}>Aspire<span style={{ color: 'var(--gold-b)' }}>Ally</span></span>
        </Link>

        <div style={{ background: '#fff', borderRadius: 20, padding: '48px 40px', boxShadow: 'var(--sh)', border: '1px solid var(--border)' }}>
          {status === 'loading' && (
            <>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F8FAFF', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FiLoader size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>Verifying your email…</h1>
              <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Just a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F0FDF4', border: '2px solid #86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FiCheckCircle size={34} color="#16A34A" />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Email verified!</h1>
              <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.7 }}>
                Your account is now active. Taking you to your dashboard…
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#FFF1F2', border: '2px solid #FECDD3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <FiAlertCircle size={34} color="#BE123C" />
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Link invalid or expired</h1>
              <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
                {message}
              </p>
              <Link to="/login" className="btn btn-primary btn-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px' }}>
                Request a new link
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
