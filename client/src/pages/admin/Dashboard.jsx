import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { FiUsers, FiCalendar, FiCreditCard, FiAlertCircle } from 'react-icons/fi'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats').then(r => setStats(r.data)),
      api.get('/admin/bookings').then(r => setBookings(r.data.slice(0, 5))),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const statCards = [
    { icon: <FiUsers />, label: 'Total Mentors', value: stats?.totalMentors || 0, color: 'var(--maroon)', link: '/admin/mentors' },
    { icon: <FiUsers />, label: 'Total Mentees', value: stats?.totalMentees || 0, color: 'var(--primary)', link: '/admin/mentees' },
    { icon: <FiCalendar />, label: 'Total Bookings', value: stats?.totalBookings || 0, color: 'var(--success)', link: '/admin/bookings' },
    { icon: <FiCreditCard />, label: 'Active Subscriptions', value: stats?.activeSubscriptions || 0, color: 'var(--gold)', link: '/admin/subscriptions' },
    { icon: <FiAlertCircle />, label: 'Pending Approvals', value: stats?.pendingMentors || 0, color: 'var(--warning)', link: '/admin/mentors' },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '40px 0 60px', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'white', marginBottom: 6 }}>Admin Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Manage mentors, mentees, and platform activity</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: -32, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {statCards.map(card => (
            <Link key={card.label} to={card.link} style={{ textDecoration: 'none' }}>
              <div className="card card-hover" style={{ padding: 20 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, background: `${card.color}15`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, fontSize: 18 }}>{card.icon}</div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{card.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{card.label}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Recent Bookings</h3>
              <Link to="/admin/bookings" style={{ fontSize: 13, color: 'var(--primary)' }}>View all →</Link>
            </div>
            <div>
              {bookings.map(b => (
                <div key={b.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{b.mentee?.firstName} {b.mentee?.lastName} → {b.mentor?.firstName} {b.mentor?.lastName}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.slot?.date} · {b.slot?.startTime}</p>
                  </div>
                  <span className={`badge ${b.status === 'confirmed' ? 'badge-primary' : b.status === 'completed' ? 'badge-success' : 'badge-gray'}`} style={{ fontSize: 11 }}>{b.status}</span>
                </div>
              ))}
              {bookings.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No bookings yet</div>}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Quick Actions</h3>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link to="/admin/mentors" className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: 10 }}>
                <FiUsers size={15} /> Manage & Approve Mentors
              </Link>
              <Link to="/admin/mentees" className="btn btn-ghost" style={{ justifyContent: 'flex-start', gap: 10 }}>
                <FiUsers size={15} /> View All Mentees
              </Link>
              <Link to="/admin/bookings" className="btn btn-ghost" style={{ justifyContent: 'flex-start', gap: 10 }}>
                <FiCalendar size={15} /> All Session Bookings
              </Link>
              <Link to="/admin/subscriptions" className="btn btn-ghost" style={{ justifyContent: 'flex-start', gap: 10 }}>
                <FiCreditCard size={15} /> Subscription Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
