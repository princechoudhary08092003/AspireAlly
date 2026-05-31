import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import api from '../utils/api'

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unverifiedEmail, setUnverifiedEmail] = useState(null)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setUnverifiedEmail(null); setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.firstName}!`)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'mentor') navigate('/mentor/dashboard')
      else navigate('/mentee/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(data.email || form.email)
        setError('Please verify your email address before signing in.')
      } else {
        setError(data?.message || 'Invalid credentials')
      }
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    setResendLoading(true)
    try {
      await api.post('/auth/resend-verification', { email: unverifiedEmail })
      setResendSent(true)
      toast.success('Verification email sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend email')
    } finally { setResendLoading(false) }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = await loginWithGoogle(credentialResponse.credential)
      toast.success(`Welcome back, ${user.firstName}!`)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'mentor') navigate('/mentor/dashboard')
      else navigate('/mentee/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left panel */}
      <div style={{ background: 'var(--grad-hero)', padding: 48, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }} className="hide-md">
        <div style={{ position: 'absolute', top: '20%', left: '-20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(37,99,235,.2),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(136,19,55,.15),transparent 70%)', pointerEvents: 'none' }} />

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(37,99,235,.4)' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>AA</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-.02em' }}>Aspire<span style={{ color: 'var(--gold-b)' }}>Ally</span></span>
        </Link>

        <div style={{ marginTop: 'auto', marginBottom: 'auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-.03em' }}>
            Welcome<br />Back
          </h2>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 320 }}>
            Your personalised career journey continues here. Connect with your mentor and keep building momentum.
          </p>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['1-on-1 sessions with industry leaders', 'Structured career roadmap', 'Personalised guidance & feedback'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(245,158,11,.2)', border: '1px solid rgba(245,158,11,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: 'var(--gold-b)' }}>✓</span>
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,.65)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.25)', position: 'relative', zIndex: 1 }}>© 2025 AspireAlly</p>
      </div>

      {/* Right panel */}
      <div style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <div className="hide-lg" style={{ marginBottom: 32, textAlign: 'center' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>AA</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)', letterSpacing: '-.02em' }}>Aspire<span style={{ color: 'var(--gold-b)' }}>Ally</span></span>
            </Link>
          </div>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-.02em' }}>Sign in</h1>
            <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Join Aspire Ally →</Link>
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              {error}
              {unverifiedEmail && !resendSent && (
                <button onClick={handleResend} disabled={resendLoading}
                  style={{ display: 'block', marginTop: 8, background: 'none', border: 'none', color: 'inherit', fontWeight: 700, cursor: 'pointer', fontSize: 13, textDecoration: 'underline', padding: 0 }}>
                  {resendLoading ? 'Sending…' : 'Resend verification email →'}
                </button>
              )}
              {resendSent && (
                <p style={{ marginTop: 6, fontSize: 13, fontWeight: 600 }}>Verification email sent — check your inbox.</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} size={15} />
                <input type="email" required className="form-input" style={{ paddingLeft: 40 }} placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} size={15} />
                <input type="password" required className="form-input" style={{ paddingLeft: 40 }} placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 6, borderRadius: 10 }}>
              {loading ? 'Signing in…' : <><span>Continue</span><FiArrowRight /></>}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-4)', whiteSpace: 'nowrap' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Google Sign-In */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed. Please try again.')}
              text="signin_with"
              shape="pill"
              width="360"
            />
          </div>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--text-4)' }}>Secure, encrypted login</p>
          </div>
        </div>
      </div>
    </div>
  )
}
