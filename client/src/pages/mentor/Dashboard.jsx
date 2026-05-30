import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiCalendar, FiUsers, FiEdit, FiVideo, FiClock, FiLink, FiPlus } from 'react-icons/fi'
import { format } from 'date-fns'

export default function MentorDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [slots, setSlots] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [linkForm, setLinkForm] = useState({})
  const [addingSlot, setAddingSlot] = useState(false)
  const [newSlots, setNewSlots] = useState([{ date: '', startTime: '', endTime: '', durationMinutes: 60 }])

  const refresh = () => Promise.all([
    api.get('/bookings/mentor-bookings').then(r => setBookings(r.data)),
    api.get('/slots/my').then(r => setSlots(r.data)),
    api.get('/mentors/me/profile').then(r => setProfile(r.data)),
  ])

  useEffect(() => { refresh().finally(() => setLoading(false)) }, [])

  const handleAddMeetingLink = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/meeting-link`, linkForm[bookingId])
      toast.success('Meeting link saved!')
      refresh()
      setLinkForm(p => { const n = { ...p }; delete n[bookingId]; return n })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save link')
    }
  }

  const handleMarkComplete = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/complete`, {})
      toast.success('Session marked as completed!')
      refresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  const handleAddSlots = async () => {
    try {
      await api.post('/slots', { slots: newSlots })
      toast.success('Slots added!')
      setAddingSlot(false)
      setNewSlots([{ date: '', startTime: '', endTime: '', durationMinutes: 60 }])
      refresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add slots')
    }
  }

  const handleDeleteSlot = async (id) => {
    try {
      await api.delete(`/slots/${id}`)
      toast.success('Slot deleted')
      refresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    }
  }

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const upcoming = bookings.filter(b => b.status === 'confirmed')
  const past = bookings.filter(b => b.status === 'completed')
  const freeSlots = slots.filter(s => !s.isBooked)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #4C0519, #881337)', padding: '40px 0 60px', color: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 6 }}>Mentor Dashboard</p>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>{user?.firstName} {user?.lastName}</h1>
              {profile?.title && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{profile.title}{profile.company ? ` · ${profile.company}` : ''}</p>}
              {!profile?.isApproved && (
                <div style={{ marginTop: 12, background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#FCD34D' }}>
                  Profile pending admin approval
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/mentor/profile" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                <FiEdit size={13} /> Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -32, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: <FiCalendar />, label: 'Upcoming', value: upcoming.length, color: 'var(--maroon)' },
            { icon: <FiUsers />, label: 'Completed', value: past.length, color: 'var(--success)' },
            { icon: <FiClock />, label: 'Free Slots', value: freeSlots.length, color: 'var(--primary)' },
            { icon: <FiUsers />, label: 'Sessions', value: profile?.sessionCount || 0, color: 'var(--gold)' },
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          {/* Bookings */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Upcoming Sessions</h3>
            </div>
            <div>
              {upcoming.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)' }}>
                  <FiCalendar size={28} style={{ marginBottom: 10, opacity: 0.3 }} />
                  <p style={{ fontSize: 14 }}>No upcoming sessions</p>
                </div>
              ) : (
                upcoming.map(b => (
                  <div key={b.id} style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                      <div className="avatar-placeholder avatar-sm" style={{ borderRadius: '50%', fontSize: 12, flexShrink: 0 }}>
                        {b.mentee?.firstName?.[0]}{b.mentee?.lastName?.[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{b.mentee?.firstName} {b.mentee?.lastName}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.mentee?.email}</p>
                        {b.slot && (
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FiClock size={11} /> {format(new Date(b.slot.date + 'T00:00:00'), 'MMM d, yyyy')} · {b.slot.startTime} – {b.slot.endTime}
                          </p>
                        )}
                        {b.menteeNotes && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>"{b.menteeNotes}"</p>}
                      </div>
                    </div>
                    {b.meetingLink ? (
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <a href={b.meetingLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm"><FiVideo size={12} /> Join {b.meetingPlatform}</a>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleMarkComplete(b.id)}>Mark Complete</button>
                      </div>
                    ) : (
                      <div>
                        {linkForm[b.id] !== undefined ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <select className="form-input form-select" style={{ fontSize: 13, padding: '7px 12px' }}
                              value={linkForm[b.id]?.meetingPlatform || 'zoom'}
                              onChange={e => setLinkForm(p => ({ ...p, [b.id]: { ...p[b.id], meetingPlatform: e.target.value } }))}>
                              <option value="zoom">Zoom</option>
                              <option value="teams">Microsoft Teams</option>
                              <option value="meet">Google Meet</option>
                              <option value="other">Other</option>
                            </select>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input className="form-input" style={{ fontSize: 13, padding: '7px 12px', flex: 1 }} placeholder="https://zoom.us/j/..." type="url"
                                value={linkForm[b.id]?.meetingLink || ''}
                                onChange={e => setLinkForm(p => ({ ...p, [b.id]: { ...p[b.id], meetingLink: e.target.value } }))} />
                              <button className="btn btn-secondary btn-sm" onClick={() => handleAddMeetingLink(b.id)}>Save</button>
                              <button className="btn btn-ghost btn-sm" onClick={() => setLinkForm(p => { const n = { ...p }; delete n[b.id]; return n })}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button className="btn btn-ghost btn-sm" onClick={() => setLinkForm(p => ({ ...p, [b.id]: { meetingLink: '', meetingPlatform: 'zoom' } }))}>
                            <FiLink size={12} /> Add Meeting Link
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Slots Panel */}
          <div>
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>My Availability</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setAddingSlot(!addingSlot)}>
                  <FiPlus size={13} /> Add Slots
                </button>
              </div>

              {addingSlot && (
                <div style={{ padding: 16, borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                  {newSlots.map((slot, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                      <input type="date" className="form-input" style={{ fontSize: 12, padding: '7px 10px' }} value={slot.date} onChange={e => setNewSlots(p => p.map((s, j) => j === i ? { ...s, date: e.target.value } : s))} />
                      <input type="time" className="form-input" style={{ fontSize: 12, padding: '7px 10px' }} placeholder="Start" value={slot.startTime} onChange={e => setNewSlots(p => p.map((s, j) => j === i ? { ...s, startTime: e.target.value } : s))} />
                      <input type="time" className="form-input" style={{ fontSize: 12, padding: '7px 10px' }} placeholder="End" value={slot.endTime} onChange={e => setNewSlots(p => p.map((s, j) => j === i ? { ...s, endTime: e.target.value } : s))} />
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setNewSlots(p => [...p, { date: '', startTime: '', endTime: '', durationMinutes: 60 }])}>+ Row</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleAddSlots}>Save Slots</button>
                  </div>
                </div>
              )}

              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {freeSlots.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text-muted)' }}>
                    <FiCalendar size={24} style={{ marginBottom: 8, opacity: 0.3 }} />
                    <p style={{ fontSize: 13 }}>No open slots yet</p>
                  </div>
                ) : (
                  freeSlots.slice(0, 10).map(slot => (
                    <div key={slot.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{format(new Date(slot.date + 'T00:00:00'), 'MMM d, yyyy')}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{slot.startTime} – {slot.endTime}</p>
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSlot(slot.id)} style={{ padding: '4px 10px', fontSize: 12 }}>Delete</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
