import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiCheck, FiArrowRight, FiZap } from 'react-icons/fi'

const PLANS = [
  {
    key: 'monthly',
    label: 'Monthly',
    price: '₹999',
    per: 'per month',
    amount: 99900,
    features: ['Access to all mentors', 'Book up to 4 sessions/month', 'Session recordings', 'Email support'],
    accentColor: '#2563EB',
    btnClass: 'btn-primary',
    popular: false,
  },
  {
    key: 'quarterly',
    label: 'Quarterly',
    price: '₹2,499',
    per: 'per quarter',
    amount: 249900,
    save: 'Save 16%',
    features: ['Access to all mentors', 'Book up to 15 sessions', 'Session recordings', 'Priority support', 'Career assessment tools'],
    accentColor: '#881337',
    btnClass: 'btn-maroon',
    popular: true,
  },
  {
    key: 'annual',
    label: 'Annual',
    price: '₹7,999',
    per: 'per year',
    amount: 799900,
    save: 'Save 33%',
    features: ['Access to all mentors', 'Unlimited sessions', 'Session recordings', 'Dedicated support', 'Career assessment tools', 'Exclusive workshops'],
    accentColor: '#C9920B',
    btnClass: 'btn-gold',
    popular: false,
  },
]

export default function Pricing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)

  const handleSubscribe = async (plan) => {
    if (!user) { navigate('/register?role=mentee'); return }
    if (user.role !== 'mentee') return toast.error('Only mentees can subscribe')

    setLoading(plan.key)
    try {
      const { data } = await api.post('/payment/create-order', { plan: plan.key })
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Mentor Rise',
        description: `${plan.label} Subscription`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId: data.subscriptionId,
            })
            toast.success('Subscription activated!')
            navigate('/mentee/dashboard')
          } catch {
            toast.error('Payment verification failed')
          }
        },
        prefill: { name: `${user.firstName} ${user.lastName}`, email: user.email },
        theme: { color: '#2563EB' },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'var(--grad-hero)', padding: '80px 0 110px', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 60%,rgba(37,99,235,.2),transparent 55%),radial-gradient(circle at 70% 30%,rgba(136,19,55,.15),transparent 55%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label section-label-gold" style={{ display: 'inline-flex', marginBottom: 20 }}>Pricing</div>
          <h1 className="h1" style={{ color: '#fff', marginBottom: 14 }}>
            Invest in Your <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Future</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', maxWidth: 440, margin: '0 auto', fontSize: 16, lineHeight: 1.7 }}>
            Choose a plan that fits your journey. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="container" style={{ marginTop: -60, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, maxWidth: 980, margin: '0 auto' }}>
          {PLANS.map(plan => (
            <div key={plan.key} style={{
              background: '#fff',
              borderRadius: 20,
              overflow: 'hidden',
              border: plan.popular ? `2px solid ${plan.accentColor}` : '1px solid var(--border)',
              boxShadow: plan.popular ? `0 24px 48px ${plan.accentColor}22` : 'var(--sh)',
              transform: plan.popular ? 'translateY(-6px)' : 'none',
              transition: 'all .25s',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Banner */}
              {plan.popular && (
                <div style={{ background: plan.accentColor, padding: '9px 0', textAlign: 'center', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '.1em' }}>
                  <FiZap style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                  MOST POPULAR
                </div>
              )}

              <div style={{ padding: '28px 28px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{plan.label}</h3>
                  {plan.save && (
                    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: '#DCFCE7', color: '#166534' }}>{plan.save}</span>
                  )}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, color: plan.accentColor, letterSpacing: '-.03em' }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-3)', marginLeft: 6 }}>{plan.per}</span>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--text-2)' }}>
                      <FiCheck size={15} style={{ color: plan.accentColor, flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '0 28px 28px', marginTop: 'auto' }}>
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.key}
                  className={`btn btn-full btn-lg btn-pill ${plan.btnClass}`}>
                  {loading === plan.key ? 'Loading…' : <><span>Get Started</span><FiArrowRight /></>}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-3)', fontSize: 13 }}>
          Secure payments powered by <strong>Razorpay</strong>. All plans include a 7-day refund policy.
        </p>
      </div>

      {/* Redirect to full FAQs */}
      <div style={{ textAlign: 'center', padding: '40px 0 80px' }}>
        <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 14 }}>Have questions about how the programme works?</p>
        <Link to="/#faqs" className="btn btn-ghost btn-pill">View All FAQs on Homepage →</Link>
      </div>
    </div>
  )
}
