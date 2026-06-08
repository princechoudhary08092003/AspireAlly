import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiRepeat } from 'react-icons/fi'
import { format } from 'date-fns'

export default function ManageMentees() {
  const [mentees, setMentees] = useState([])
  const [loading, setLoading] = useState(true)
  const [changing, setChanging] = useState(null)

  const refresh = () => api.get('/admin/mentees').then(r => setMentees(r.data)).finally(() => setLoading(false))
  useEffect(() => { refresh() }, [])

  const handleToggle = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle-active`)
      toast.success('Status updated')
      refresh()
    } catch { toast.error('Failed') }
  }

  const handleMakeMentor = async (id, name) => {
    if (!window.confirm(`Change ${name} to Mentor? They will get a mentor profile.`)) return
    setChanging(id)
    try {
      await api.put(`/admin/users/${id}/role`, { role: 'mentor' })
      toast.success(`${name} is now a Mentor`)
      refresh()
    } catch { toast.error('Failed to change role') }
    finally { setChanging(null) }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}><FiArrowLeft size={14} /> Admin</Link>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Manage Mentees</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Mentees ({mentees.length})</h2>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Name', 'Email', 'Subscription', 'Joined', 'Status', 'Role', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mentees.map(m => (
                  <tr key={m.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500 }}>{m.firstName} {m.lastName}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{m.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {m.subscriptions?.length > 0
                        ? <span className="badge badge-success" style={{ fontSize: 11 }}>Active · {m.subscriptions[0].plan}</span>
                        : <span className="badge badge-gray" style={{ fontSize: 11 }}>None</span>}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{format(new Date(m.createdAt), 'MMM d, yyyy')}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${m.isActive ? 'badge-success' : 'badge-error'}`} style={{ fontSize: 11 }}>{m.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        disabled={changing === m.id}
                        onClick={() => handleMakeMentor(m.id, `${m.firstName} ${m.lastName}`)}
                        className="btn btn-sm btn-outline"
                        style={{ gap: 5, fontSize: 12 }}>
                        <FiRepeat size={11} /> Make Mentor
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button className={`btn btn-sm ${m.isActive ? 'btn-danger' : 'btn-ghost'}`} onClick={() => handleToggle(m.id)}>
                        {m.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
                {mentees.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: 14 }}>No mentees yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
