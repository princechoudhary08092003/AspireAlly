import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiBriefcase, FiLinkedin, FiCalendar, FiClock, FiArrowLeft, FiStar, FiBook } from 'react-icons/fi'
import { format } from 'date-fns'

export default function MentorProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    api.get(`/mentors/${id}`).then(r => setData(r.data)).catch(() => navigate('/mentors')).finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'mentee') return toast.error('Only mentees can book sessions')
    if (!user.hasActiveSubscription) {
      toast.error('You need an active subscription to book sessions')
      navigate('/pricing')
      return
    }
    if (!booking) return toast.error('Please select a time slot')
    setBookingLoading(true)
    try {
      await api.post('/bookings', { slotId: booking, menteeNotes: notes })
      toast.success('Session booked successfully!')
      navigate('/mentee/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!data) return null

  const { user: mentor, availableSlots = [], title, company, bio, expertise, rating, sessionCount, photoUrl, linkedinUrl, yearsExperience } = data
  const name = `${mentor?.firstName || ''} ${mentor?.lastName || ''}`.trim()
  const initials = `${mentor?.firstName?.[0] || ''}${mentor?.lastName?.[0] || ''}`

  const slotsByDate = availableSlots.reduce((acc, slot) => {
    (acc[slot.date] = acc[slot.date] || []).push(slot)
    return acc
  }, {})

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      {/* Back */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container">
          <Link to="/mentors" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
            <FiArrowLeft size={14} /> Back to Mentors
          </Link>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
          {/* Left: Profile */}
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--maroon))', height: 120, borderRadius: '12px 12px 0 0' }} />
              <div style={{ padding: '0 28px 28px' }}>
                <div style={{ marginTop: -40, marginBottom: 16 }}>
                  {photoUrl ? (
                    <img src={photoUrl} alt={name} className="avatar avatar-xl" style={{ border: '4px solid white', boxShadow: 'var(--sh-sm)' }} />
                  ) : (
                    <div className="avatar-placeholder avatar-xl" style={{ border: '4px solid white', boxShadow: 'var(--sh-sm)', fontSize: 32 }}>{initials}</div>
                  )}
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{name}</h1>
                {title && <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 6 }}>{title}</p>}
                {company && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <FiBriefcase size={13} /> {company}
                    {yearsExperience > 0 && <span style={{ marginLeft: 8, color: 'var(--text-light)', fontSize: 13 }}>· {yearsExperience} yrs exp.</span>}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                  <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
                    <FiStar style={{ color: 'var(--gold-bright)' }} /> {rating > 0 ? `${rating.toFixed(1)} rating` : 'New mentor'}
                  </span>
                  <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
                    <FiBook /> {sessionCount} sessions completed
                  </span>
                  {linkedinUrl && (
                    <a href={linkedinUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--primary)' }}>
                      <FiLinkedin /> LinkedIn
                    </a>
                  )}
                </div>
                {expertise?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {expertise.map(e => <span key={e} className="chip">{e}</span>)}
                  </div>
                )}
                {bio && (
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>About</h3>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>{bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Booking */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Book a Session</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Select an available time slot</p>
              </div>
              <div className="card-body" style={{ padding: 20 }}>
                {availableSlots.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    <FiCalendar size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                    <p style={{ fontSize: 14 }}>No available slots at the moment</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {Object.entries(slotsByDate).map(([date, slots]) => (
                      <div key={date}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {format(new Date(date + 'T00:00:00'), 'EEEE, MMM d')}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {slots.map(slot => (
                            <button key={slot.id}
                              onClick={() => setBooking(slot.id)}
                              style={{
                                padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${booking === slot.id ? 'var(--primary)' : 'var(--border)'}`,
                                background: booking === slot.id ? 'var(--primary-light)' : 'white',
                                color: booking === slot.id ? 'var(--primary)' : 'var(--text)',
                                fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
                              }}>
                              <FiClock size={14} />
                              {slot.startTime} – {slot.endTime}
                              <span style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7 }}>{slot.durationMinutes}min</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {booking && (
                      <div className="form-group">
                        <label className="form-label">Notes for mentor (optional)</label>
                        <textarea className="form-input form-textarea" placeholder="What would you like to discuss?" value={notes} onChange={e => setNotes(e.target.value)} style={{ minHeight: 80 }} />
                      </div>
                    )}

                    <button
                      className="btn btn-primary btn-full"
                      onClick={handleBook}
                      disabled={!booking || bookingLoading}>
                      {bookingLoading ? 'Booking…' : user ? 'Confirm Booking' : 'Sign In to Book'}
                    </button>

                    {!user?.hasActiveSubscription && user?.role === 'mentee' && (
                      <div className="alert alert-info" style={{ fontSize: 13 }}>
                        Subscription required to book sessions. <Link to="/pricing" style={{ fontWeight: 600 }}>View plans →</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
