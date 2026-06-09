import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { FiCalendar, FiUsers, FiCreditCard, FiArrowRight, FiVideo, FiClock, FiCheckCircle } from 'react-icons/fi'
import { format } from 'date-fns'

export default function MenteeDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/bookings/my').then(r => setBookings(r.data)),
      api.get('/payment/subscription').then(r => setSubscription(r.data.subscription)).catch(() => setSubscription(null)),
    ]).finally(() => setLoading(false))
  }, [])

  const upcoming = bookings.filter(b => b.status === 'confirmed')
  const past = bookings.filter(b => b.status === 'completed')

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
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
