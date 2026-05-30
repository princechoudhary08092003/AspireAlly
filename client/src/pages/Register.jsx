import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiArrowRight, FiUser, FiMail, FiLock } from 'react-icons/fi'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: params.get('role') || 'mentee' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (form.password.length < 8) return setError('Password must be at least 8 characters')
    setLoading(true)
    try {
      const user = await register(form)
      toast.success(`Welcome to Aspire Ally, ${user.firstName}!`)
      navigate(user.role === 'mentor' ? '/mentor/dashboard' : '/mentee/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left panel */}
      <div style={{ background: 'linear-gradient(135deg,#080E1D,#1E2D4F)', padding: 48, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }} className="hide-md">
        <div style={{ position: 'absolute', top: '20%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(136,19,55,.2),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(37,99,235,.18),transparent 70%)', pointerEvents: 'none' }} />

        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>AA</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-.02em' }}>Aspire<span style={{ color: 'var(--gold-b)' }}>Ally</span></span>
        </Link>

        <div style={{ marginTop: 'auto', marginBottom: 'auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-.03em' }}>
            Start Your<br />
            <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Journey Today</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 16, lineHeight: 1.7, maxWidth: 320, marginBottom: 40 }}>
            Join as a mentee and get matched with senior industry leaders, or register as a mentor to give back and shape the next generation.
          </p>
          {[
            { role: 'mentee', emoji: '🎓', title: 'Join as Mentee', desc: 'Get guided, structured, and empowered' },
            { role: 'mentor', emoji: '👔', title: 'Join as Mentor', desc: 'Share expertise, build legacy' },
          ].map(opt => (
            <div key={opt.role} style={{ padding: '14px 18px', borderRadius: 12, background: form.role === opt.role ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.04)', border: `1px solid ${form.role === opt.role ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.07)'}`, marginBottom: 10, cursor: 'pointer', transition: 'all .18s' }}
              onClick={() => setForm(p => ({ ...p, role: opt.role }))}>
              <p style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 2 }}>{opt.emoji} {opt.title}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>{opt.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.25)', position: 'relative', zIndex: 1 }}>© 2025 AspireAlly</p>
      </div>

      {/* Right panel */}
      <div style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="hide-lg" style={{ marginBottom: 28, textAlign: 'center' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>AA</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.02em' }}>Aspire<span style={{ color: 'var(--gold-b)' }}>Ally</span></span>
            </Link>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: '-.02em' }}>Create your account</h1>
            <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
              Already have one?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in →</Link>
            </p>
          </div>

          {/* Role toggle (mobile visible too) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24, padding: 5, background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
            {['mentee', 'mentor'].map(role => (
              <button key={role} type="button" onClick={() => setForm(p => ({ ...p, role }))}
                style={{ padding: '10px 0', borderRadius: 9, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .2s', background: form.role === role ? (role === 'mentee' ? 'var(--primary)' : 'var(--maroon)') : 'transparent', color: form.role === role ? '#fff' : 'var(--text-3)', boxShadow: form.role === role ? 'var(--sh)' : 'none' }}>
                {role === 'mentee' ? '🎓 I\'m a Mentee' : '👔 I\'m a Mentor'}
              </button>
            ))}
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 18 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">First name</label>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} size={14} />
                  <input type="text" required className="form-input" style={{ paddingLeft: 36 }} placeholder="First" value={form.firstName} onChange={set('firstName')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last name</label>
                <input type="text" required className="form-input" placeholder="Last" value={form.lastName} onChange={set('lastName')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} size={14} />
                <input type="email" required className="form-input" style={{ paddingLeft: 36 }} placeholder="you@example.com" value={form.email} onChange={set('email')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} size={14} />
                <input type="password" required className="form-input" style={{ paddingLeft: 36 }} placeholder="Min. 8 characters" value={form.password} onChange={set('password')} />
              </div>
            </div>
            <button type="submit" className={`btn btn-full btn-lg ${form.role === 'mentee' ? 'btn-primary' : 'btn-maroon'}`} disabled={loading} style={{ marginTop: 6, borderRadius: 10 }}>
              {loading ? 'Creating account…' : <><span>Create Account</span><FiArrowRight /></>}
            </button>
            <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', lineHeight: 1.6 }}>
              By joining you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
