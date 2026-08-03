import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiCalendar, FiUsers, FiCreditCard, FiArrowRight, FiVideo, FiClock, FiCheckCircle, FiStar, FiMessageSquare } from 'react-icons/fi'
import { format } from 'date-fns'

export default function MenteeDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [testimonialForm, setTestimonialForm] = useState({ quote: '', rating: 5, tag: '' })
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false)
  const [testimonialDone, setTestimonialDone] = useState(false)

  useEffect(() => {
    if (!user?.isApproved) { setLoading(false); return }
    Promise.all([
      api.get('/bookings/my').then(r => setBookings(r.data)).catch(() => {}),
      api.get('/payment/subscription').then(r => setSubscription(r.data.subscription)).catch(() => setSubscription(null)),
    ]).finally(() => setLoading(false))
  }, [user?.isApproved])

  const upcoming = bookings.filter(b => b.status === 'confirmed')
  const past = bookings.filter(b => b.status === 'completed')

  const handleTestimonialSubmit = async () => {
    if (!testimonialForm.quote.trim() || testimonialForm.quote.trim().length < 20) {
      return toast.error('Please write at least 20 characters')
    }
    setSubmittingTestimonial(true)
    try {
      await api.post('/testimonials', testimonialForm)
      toast.success('Thank you! Your testimonial is pending review.')
      setTestimonialDone(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit')
    } finally { setSubmittingTestimonial(false) }
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  if (!user?.isApproved) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A8A)', padding: '40px 0 60px', color: 'white' }}>
          <div className="container">
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 6 }}>Welcome</p>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>{user?.firstName} {user?.lastName}</h1>
          </div>
        </div>
        <div className="container" style={{ marginTop: -32, paddingBottom: 60 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: '40px 32px', maxWidth: 560, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: '#FEF3C7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>⏳</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Account Pending Approval</h2>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 20 }}>
              Your mentee account has been registered and is currently awaiting admin approval. You will be able to browse mentors and book sessions once your account is approved.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Questions? Email us at <a href="mailto:mentorrise47@gmail.com" style={{ color: 'var(--primary)' }}>mentorrise47@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A8A)', padding: '40px 0 60px', color: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 6 }}>Welcome back</p>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>{user?.firstName} {user?.lastName}</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Continue your mentorship journey</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/mentors" className="btn btn-gold">Find a Mentor <FiArrowRight /></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -32, paddingBottom: 60 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: <FiCalendar />, label: 'Upcoming Sessions', value: upcoming.length, color: 'var(--primary)' },
            { icon: <FiCheckCircle />, label: 'Completed Sessions', value: past.length, color: 'var(--success)' },
            { icon: <FiCreditCard />, label: 'Subscription', value: subscription ? 'Active' : 'None', color: subscription ? 'var(--success)' : 'var(--error)' },
            { icon: <FiUsers />, label: 'Total Bookings', value: bookings.length, color: 'var(--maroon)' },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, background: `${stat.color}15`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, fontSize: 18 }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: 2 }}>Ready to find your mentor?</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Browse available mentors and book your first session</p>
            </div>
            <Link to="/mentors" className="btn btn-primary btn-sm">Find a Mentor</Link>
          </div>
        )}

        <div className="layout-2col">
          {/* Upcoming */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Upcoming Sessions</h3>
              <span className="badge badge-primary">{upcoming.length}</span>
            </div>
            <div style={{ padding: 0 }}>
              {upcoming.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
                  <FiCalendar size={28} style={{ marginBottom: 10, opacity: 0.3 }} />
                  <p style={{ fontSize: 14 }}>No upcoming sessions</p>
                  <Link to="/mentors" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>Find a mentor →</Link>
                </div>
              ) : (
                upcoming.map(b => <BookingRow key={b.id} booking={b} type="upcoming" />)
              )}
            </div>
          </div>

          {/* Past */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Past Sessions</h3>
              <span className="badge badge-gray">{past.length}</span>
            </div>
            <div style={{ padding: 0 }}>
              {past.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
                  <FiCheckCircle size={28} style={{ marginBottom: 10, opacity: 0.3 }} />
                  <p style={{ fontSize: 14 }}>No past sessions yet</p>
                </div>
              ) : (
                past.slice(0, 5).map(b => <BookingRow key={b.id} booking={b} type="past" />)
              )}
            </div>
          </div>
        </div>

        {/* Testimonial form — only if has at least one booking */}
        {bookings.length > 0 && (
          <div className="card" style={{ marginTop: 24, padding: 28 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: 'var(--primary-xl)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <FiMessageSquare size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Share Your Experience</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Your testimonial helps others discover MentorRise</p>
              </div>
            </div>
            {testimonialDone ? (
              <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 10, padding: '16px 20px', color: '#166534', fontSize: 14 }}>
                Thank you! Your testimonial has been submitted and is pending review by our team.
              </div>
            ) : (
              <>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Your Experience *</label>
                  <textarea className="form-input form-textarea" placeholder="Share what the mentorship experience meant to you (min 20 characters)…" style={{ minHeight: 90 }}
                    value={testimonialForm.quote} onChange={e => setTestimonialForm(f => ({ ...f, quote: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
                  <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
                    <label className="form-label">Rating</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setTestimonialForm(f => ({ ...f, rating: n }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                          <FiStar size={22} style={{ color: n <= testimonialForm.rating ? '#F59E0B' : '#D1D5DB', fill: n <= testimonialForm.rating ? '#F59E0B' : 'none' }} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
                    <label className="form-label">Category (optional)</label>
                    <input className="form-input" placeholder="e.g. Career Growth" value={testimonialForm.tag}
                      onChange={e => setTestimonialForm(f => ({ ...f, tag: e.target.value }))} />
                  </div>
                </div>
                <button className="btn btn-primary" onClick={handleTestimonialSubmit} disabled={submittingTestimonial}>
                  {submittingTestimonial ? 'Submitting…' : 'Submit Testimonial'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingRow({ booking, type }) {
  const mentor = booking.mentor
  const slot = booking.slot
  const name = `${mentor?.firstName || ''} ${mentor?.lastName || ''}`.trim()

  return (
    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div className="avatar-placeholder avatar-sm" style={{ borderRadius: '50%', fontSize: 12, flexShrink: 0 }}>
        {mentor?.firstName?.[0]}{mentor?.lastName?.[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{name}</p>
        {mentor?.mentorProfile?.title && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{mentor.mentorProfile.title}</p>}
        {slot && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiClock size={11} /> {format(new Date(slot.date + 'T00:00:00'), 'MMM d, yyyy')} · {slot.startTime}
          </p>
        )}
        {type === 'upcoming' && booking.meetingLink && (
          <a href={booking.meetingLink} target="_blank" rel="noreferrer"
            className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
            <FiVideo size={12} /> Join {booking.meetingPlatform}
          </a>
        )}
      </div>
      <span className={`badge ${type === 'upcoming' ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: 11, flexShrink: 0 }}>
        {type === 'upcoming' ? 'Confirmed' : 'Done'}
      </span>
    </div>
  )
}
