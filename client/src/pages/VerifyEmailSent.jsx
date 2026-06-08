import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiMail, FiRefreshCw, FiArrowLeft, FiCheck } from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function VerifyEmailSent() {
  const [params] = useSearchParams()
  const email = params.get('email') || 'your inbox'
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleResend = async () => {
    setLoading(true)
    try {
      await api.post('/auth/resend-verification', { email })
      setSent(true)
      toast.success('Verification email sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 48, textDecoration: 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>MR</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-.02em' }}>Mentor<span style={{ color: 'var(--gold-b)' }}>Rise</span></span>
        </Link>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '48px 40px', boxShadow: 'var(--sh)', border: '1px solid var(--border)' }}>
          {/* Icon */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border: '2px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <FiMail size={32} color="#2563EB" />
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 12, letterSpacing: '-.02em' }}>
            Check your inbox
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
            We've sent a verification link to
          </p>
          <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15, marginBottom: 28, wordBreak: 'break-all' }}>
            {email}
          </p>
          <p style={{ color: 'var(--text-3)', fontSize: 13, lineHeight: 1.7, marginBottom: 32 }}>
            Click the link in the email to activate your account. The link expires in <strong>24 hours</strong>. Don't forget to check your spam folder.
          </p>

          {/* Resend */}
          {!sent ? (
            <button onClick={handleResend} disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 50, border: '1.5px solid var(--border)', background: '#fff', color: 'var(--text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>
              <FiRefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Sending…' : 'Resend verification email'}
            </button>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 50, background: '#F0FDF4', color: '#166534', fontSize: 14, fontWeight: 600 }}>
              <FiCheck size={14} />
              Email sent!
            </div>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-3)', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              <FiArrowLeft size={14} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
