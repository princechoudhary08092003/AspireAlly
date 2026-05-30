import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { FiArrowLeft } from 'react-icons/fi'
import { format } from 'date-fns'

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/subscriptions').then(r => setSubs(r.data)).finally(() => setLoading(false))
  }, [])

  const total = subs.filter(s => s.status === 'active').reduce((sum, s) => sum + parseFloat(s.amount), 0)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}><FiArrowLeft size={14} /> Admin</Link>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Subscriptions</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Subscription Reports</h2>
          <div style={{ padding: '10px 20px', background: '#DCFCE7', borderRadius: 10, border: '1px solid #86EFAC' }}>
            <p style={{ fontSize: 12, color: '#166534' }}>Active Revenue</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#166534' }}>₹{total.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['User', 'Plan', 'Amount', 'Status', 'Starts', 'Expires'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.map(s => (
                  <tr key={s.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{s.user?.firstName} {s.user?.lastName}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.user?.email}</p>
                    </td>
                    <td style={{ padding: '14px 16px' }}><span className="badge badge-primary" style={{ fontSize: 11, textTransform: 'capitalize' }}>{s.plan}</span></td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600 }}>₹{parseFloat(s.amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${s.status === 'active' ? 'badge-success' : s.status === 'expired' ? 'badge-error' : 'badge-gray'}`} style={{ fontSize: 11 }}>{s.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{s.startsAt ? format(new Date(s.startsAt), 'MMM d, yyyy') : '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{s.expiresAt ? format(new Date(s.expiresAt), 'MMM d, yyyy') : '—'}</td>
                  </tr>
                ))}
                {subs.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: 14 }}>No subscriptions yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
