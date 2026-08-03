import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiRepeat, FiCheck, FiX } from 'react-icons/fi'
import { format } from 'date-fns'

export default function ManageMentees() {
  const [mentees, setMentees] = useState([])
  const [loading, setLoading] = useState(true)
  const [changing, setChanging] = useState(null)
  const [tab, setTab] = useState('pending')

  const refresh = () => api.get('/admin/mentees').then(r => setMentees(r.data)).finally(() => setLoading(false))
  useEffect(() => { refresh() }, [])

  const pending = mentees.filter(m => !m.isApproved)
  const approved = mentees.filter(m => m.isApproved)
  const shown = tab === 'pending' ? pending : approved

  const handleToggle = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle-active`)
      toast.success('Status updated')
      refresh()
    } catch { toast.error('Failed') }
  }

  const handleApprove = async (id, name, approve) => {
    setChanging(id)
    try {
      await api.put(`/admin/users/${id}/approve-account`, { isApproved: approve })
      toast.success(approve ? `${name} approved` : `${name} rejected`)
      refresh()
    } catch { toast.error('Failed') }
    finally { setChanging(null) }
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Mentees ({mentees.length})</h2>
          <div style={{ display: 'flex', gap: 0, background: 'var(--border)', borderRadius: 10, padding: 3 }}>
            {[['pending', `Pending (${pending.length})`], ['approved', `Approved (${approved.length})`]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ padding: '7px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
                  background: tab === key ? '#fff' : 'transparent', color: tab === key ? 'var(--primary)' : 'var(--text-3)',
                  boxShadow: tab === key ? 'var(--sh-sm)' : 'none' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div className="card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Name', 'Email', 'Joined', 'Approval', ...(tab === 'pending' ? ['Approve / Reject'] : ['Actions'])].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map(m => (
                  <tr key={m.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500 }}>{m.firstName} {m.lastName}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{m.email}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{format(new Date(m.createdAt), 'MMM d, yyyy')}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${m.isApproved ? 'badge-success' : 'badge-gray'}`} style={{ fontSize: 11 }}>
                        {m.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {tab === 'pending' ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button disabled={changing === m.id} onClick={() => handleApprove(m.id, `${m.firstName} ${m.lastName}`, true)}
                            className="btn btn-sm" style={{ background: 'var(--success)', color: '#fff', border: 'none', gap: 4 }}>
                            <FiCheck size={12} /> Approve
                          </button>
                          <button disabled={changing === m.id} onClick={() => handleToggle(m.id)}
                            className="btn btn-sm btn-ghost" style={{ gap: 4 }}>
                            <FiX size={12} /> Deactivate
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button disabled={changing === m.id} onClick={() => handleApprove(m.id, `${m.firstName} ${m.lastName}`, false)}
                            className="btn btn-sm btn-ghost" style={{ gap: 4, fontSize: 12 }}>
                            Revoke
                          </button>
                          <button disabled={changing === m.id}
                            onClick={() => handleMakeMentor(m.id, `${m.firstName} ${m.lastName}`)}
                            className="btn btn-sm btn-outline" style={{ gap: 5, fontSize: 12 }}>
                            <FiRepeat size={11} /> Make Mentor
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {shown.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: 14 }}>
                    {tab === 'pending' ? 'No pending approvals' : 'No approved mentees yet'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
