import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { FiArrowLeft } from 'react-icons/fi'
import { format } from 'date-fns'

export default function ManageBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/admin/bookings').then(r => setBookings(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}><FiArrowLeft size={14} /> Admin</Link>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>All Bookings</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Bookings ({filtered.length})</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'confirmed', 'completed', 'cancelled'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`} style={{ textTransform: 'capitalize' }}>{s}</button>
            ))}
          </div>
        </div>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Mentee', 'Mentor', 'Date & Time', 'Platform', 'Status', 'Booked On'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{b.mentee?.firstName} {b.mentee?.lastName}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.mentee?.email}</p>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13 }}>{b.mentor?.firstName} {b.mentor?.lastName}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>
                      {b.slot ? `${format(new Date(b.slot.date + 'T00:00:00'), 'MMM d, yyyy')} · ${b.slot.startTime}` : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {b.meetingLink
                        ? <a href={b.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--primary)' }}>{b.meetingPlatform}</a>
                        : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Not set</span>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${b.status === 'confirmed' ? 'badge-primary' : b.status === 'completed' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: 11 }}>{b.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{format(new Date(b.createdAt), 'MMM d, yyyy')}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: 14 }}>No bookings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
