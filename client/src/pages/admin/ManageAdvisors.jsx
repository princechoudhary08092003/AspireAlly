import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiUsers } from 'react-icons/fi'

const GRADIENT_OPTIONS = [
  { label: 'Gold', value: 'linear-gradient(135deg,#C9920B,#F59E0B)' },
  { label: 'Blue', value: 'linear-gradient(135deg,#2563EB,#1E3A8A)' },
  { label: 'Maroon', value: 'linear-gradient(135deg,#881337,#5C0D26)' },
  { label: 'Green', value: 'linear-gradient(135deg,#059669,#047857)' },
  { label: 'Purple', value: 'linear-gradient(135deg,#7C3AED,#5B21B6)' },
  { label: 'Teal', value: 'linear-gradient(135deg,#0891B2,#0E7490)' },
]

const empty = {
  name: '', initials: '', role: '', company: '', location: '',
  bio: '', tags: '', followers: '', linkedinUrl: '',
  gradient: GRADIENT_OPTIONS[0].value, isActive: true, sortOrder: 0,
}

export default function ManageAdvisors() {
  const [advisors, setAdvisors] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | advisor obj
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/admin/advisors').then(r => setAdvisors(r.data)).catch(() => toast.error('Failed to load advisors')).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setForm(empty); setModal('create') }
  const openEdit = (a) => {
    setForm({
      name: a.name, initials: a.initials, role: a.role,
      company: a.company || '', location: a.location || '',
      bio: a.bio || '', tags: (a.tags || []).join(', '),
      followers: a.followers || '', linkedinUrl: a.linkedinUrl || '',
      gradient: a.gradient || GRADIENT_OPTIONS[0].value,
      isActive: a.isActive, sortOrder: a.sortOrder || 0,
    })
    setModal(a)
  }

  const closeModal = () => { setModal(null); setForm(empty) }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        sortOrder: parseInt(form.sortOrder) || 0,
      }
      if (modal === 'create') {
        await api.post('/admin/advisors', payload)
        toast.success('Advisor added')
      } else {
        await api.put(`/admin/advisors/${modal.id}`, payload)
        toast.success('Advisor updated')
      }
      closeModal()
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const deleteAdvisor = async (id) => {
    if (!window.confirm('Delete this advisor?')) return
    setDeleting(id)
    try {
      await api.delete(`/admin/advisors/${id}`)
      toast.success('Advisor deleted')
      load()
    } catch { toast.error('Delete failed') }
    finally { setDeleting(null) }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E293B)', padding: '40px 0 60px', color: '#fff' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Manage Advisors</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Add, edit, and remove advisors shown on the homepage</p>
          </div>
          <button onClick={openCreate} className="btn btn-gold" style={{ gap: 8 }}>
            <FiPlus size={15} /> Add Advisor
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: -32, paddingBottom: 60 }}>
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : advisors.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: 'center' }}>
            <FiUsers size={40} style={{ color: 'var(--text-4)', marginBottom: 16 }} />
            <p style={{ color: 'var(--text-3)', fontSize: 15, marginBottom: 20 }}>No advisors yet. Add your first one.</p>
            <button onClick={openCreate} className="btn btn-primary btn-pill">
              <FiPlus size={14} /> Add First Advisor
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
            {advisors.map(a => (
              <div key={a.id} className="card" style={{ padding: 24, opacity: a.isActive ? 1 : 0.55 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: a.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontWeight: 800, fontSize: 16 }}>
                    {a.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{a.name}</h3>
                        <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 2 }}>{a.role}</p>
                        {a.company && <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{a.company}</p>}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button onClick={() => openEdit(a)} className="btn btn-ghost btn-xs btn-pill" style={{ padding: '5px 10px' }}>
                          <FiEdit2 size={13} />
                        </button>
                        <button onClick={() => deleteAdvisor(a.id)} disabled={deleting === a.id} className="btn btn-xs btn-pill" style={{ padding: '5px 10px', color: 'var(--error)', background: 'var(--error-l)', border: 'none' }}>
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                    {a.bio && <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginTop: 10 }}>{a.bio.length > 100 ? a.bio.slice(0, 100) + '…' : a.bio}</p>}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                      {(Array.isArray(a.tags) ? a.tags : []).map(t => <span key={t} className="chip chip-gray" style={{ fontSize: 10 }}>{t}</span>)}
                      {!a.isActive && <span className="badge badge-gray" style={{ fontSize: 10 }}>Hidden</span>}
                      {a.followers && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{a.followers}+ followers</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(8,14,29,.6)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 32px 64px rgba(8,14,29,.25)' }}>
            <div style={{ background: 'linear-gradient(135deg,#080E1D,#1E2D4F)', padding: '22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>{modal === 'create' ? 'Add New Advisor' : `Edit — ${modal.name}`}</h2>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#fff', display: 'flex' }}>
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={save} style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Alok Narain" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Initials *</label>
                  <input className="form-input" required maxLength={4} value={form.initials} onChange={e => setForm(p => ({ ...p, initials: e.target.value.toUpperCase() }))} placeholder="AN" style={{ width: 80 }} />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Role / Title *</label>
                <input className="form-input" required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Leadership Coach & Trainer" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Company / Organisation</label>
                  <input className="form-input" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company name" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Location</label>
                  <input className="form-input" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="City, Country" />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Bio</label>
                <textarea className="form-input" rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Short professional bio..." style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Tags (comma-separated)</label>
                  <input className="form-input" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="Leadership, Strategy, BFSI" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">LinkedIn Followers</label>
                  <input className="form-input" value={form.followers} onChange={e => setForm(p => ({ ...p, followers: e.target.value }))} placeholder="23K" />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">LinkedIn URL</label>
                <input className="form-input" type="url" value={form.linkedinUrl} onChange={e => setForm(p => ({ ...p, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/in/..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Card Colour</label>
                  <select className="form-input" value={form.gradient} onChange={e => setForm(p => ({ ...p, gradient: e.target.value }))}>
                    {GRADIENT_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Sort Order</label>
                  <input className="form-input" type="number" min={0} value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: e.target.value }))} placeholder="0" />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} style={{ width: 16, height: 16 }} />
                Show on homepage
              </label>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="button" onClick={closeModal} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ gap: 8 }}>
                  <FiSave size={14} /> {saving ? 'Saving…' : (modal === 'create' ? 'Add Advisor' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
