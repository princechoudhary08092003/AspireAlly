import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiCheck, FiX, FiEye, FiEyeOff, FiEdit, FiArrowLeft } from 'react-icons/fi'

export default function ManageMentors() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')

  const refresh = () => api.get('/admin/mentors').then(r => setMentors(r.data)).finally(() => setLoading(false))

  useEffect(() => { refresh() }, [])

  const handleApprove = async (id, val) => {
    try {
      await api.put(`/admin/mentors/${id}/approve`, { isApproved: val })
      toast.success(val ? 'Mentor approved!' : 'Approval removed')
      refresh()
    } catch { toast.error('Failed') }
  }

  const handleVisibility = async (id, val) => {
    try {
      await api.put(`/admin/mentors/${id}/visibility`, { isVisible: val })
      toast.success(val ? 'Now visible to mentees' : 'Hidden from mentees')
      refresh()
    } catch { toast.error('Failed') }
  }

  const handleToggle = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle-active`)
      toast.success('User status updated')
      refresh()
    } catch { toast.error('Failed') }
  }

  const filtered = tab === 'pending' ? mentors.filter(m => !m.mentorProfile?.isApproved)
    : tab === 'approved' ? mentors.filter(m => m.mentorProfile?.isApproved)
    : mentors

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
            <FiArrowLeft size={14} /> Admin
          </Link>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Manage Mentors</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Mentors ({mentors.length})</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'pending', 'approved'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-ghost'}`} style={{ textTransform: 'capitalize' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>No mentors in this category</div>
            ) : filtered.map(mentor => {
              const p = mentor.mentorProfile
              return (
                <div key={mentor.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Photo */}
                    {p?.photoUrl ? (
                      <img src={p.photoUrl} alt="" className="avatar avatar-md" />
                    ) : (
                      <div className="avatar-placeholder avatar-md" style={{ fontSize: 16 }}>
                        {mentor.firstName?.[0]}{mentor.lastName?.[0]}
                      </div>
                    )}
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>{mentor.firstName} {mentor.lastName}</h3>
                        <span className={`badge ${!mentor.isActive ? 'badge-error' : p?.isApproved ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 11 }}>
                          {!mentor.isActive ? 'Deactivated' : p?.isApproved ? 'Approved' : 'Pending'}
                        </span>
                        {p?.isApproved && (
                          <span className={`badge ${p?.isVisible ? 'badge-primary' : 'badge-gray'}`} style={{ fontSize: 11 }}>
                            {p?.isVisible ? 'Visible' : 'Hidden'}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{mentor.email}</p>
                      {p?.title && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.title}{p.company ? ` · ${p.company}` : ''}</p>}
                      {p?.expertise?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                          {p.expertise.map(e => <span key={e} className="chip" style={{ fontSize: 11 }}>{e}</span>)}
                        </div>
                      )}
                    </div>
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
                      <Link to={`/admin/mentors/${mentor.id}/edit`} className="btn btn-ghost btn-sm" title="Edit Profile">
                        <FiEdit size={13} /> Edit
                      </Link>
                      {p?.isApproved ? (
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleApprove(mentor.id, false)} title="Revoke Approval">
                          <FiX size={13} /> Revoke
                        </button>
                      ) : (
                        <button className="btn btn-sm" style={{ background: 'var(--success)', color: 'white', border: 'none' }} onClick={() => handleApprove(mentor.id, true)}>
                          <FiCheck size={13} /> Approve
                        </button>
                      )}
                      {p?.isApproved && (
                        p?.isVisible ? (
                          <button className="btn btn-ghost btn-sm" onClick={() => handleVisibility(mentor.id, false)}>
                            <FiEyeOff size={13} /> Hide
                          </button>
                        ) : (
                          <button className="btn btn-primary btn-sm" onClick={() => handleVisibility(mentor.id, true)}>
                            <FiEye size={13} /> Show
                          </button>
                        )
                      )}
                      <button className={`btn btn-sm ${mentor.isActive ? 'btn-danger' : 'btn-ghost'}`} onClick={() => handleToggle(mentor.id)}>
                        {mentor.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
