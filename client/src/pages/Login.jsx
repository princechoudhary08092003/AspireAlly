import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.firstName}!`)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'mentor') navigate('/mentor/dashboard')
      else navigate('/mentee/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally { setLoading(false) }
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

          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

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

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: 'var(--text-4)' }}>Secure, encrypted login</p>
          </div>
        </div>
      </div>
    </div>
  )
}
