import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiUsers } from 'react-icons/fi'

const GRADIENT_OPTIONS = [
  { label: 'Blue', value: 'linear-gradient(135deg,#2563EB,#1D4ED8)' },
  { label: 'Maroon', value: 'linear-gradient(135deg,#881337,#5C0D26)' },
  { label: 'Gold', value: 'linear-gradient(135deg,#C9920B,#F59E0B)' },
  { label: 'Green', value: 'linear-gradient(135deg,#059669,#047857)' },
  { label: 'Purple', value: 'linear-gradient(135deg,#7C3AED,#5B21B6)' },
  { label: 'Teal', value: 'linear-gradient(135deg,#0891B2,#0E7490)' },
  { label: 'Navy', value: 'linear-gradient(135deg,#0F172A,#1E3A8A)' },
]

const empty = {
  name: '', initials: '', role: '', bio: '', linkedinUrl: '',
  gradient: GRADIENT_OPTIONS[0].value, isActive: true, sortOrder: 0,
}

export default function ManageCofounders() {
  const [cofounders, setCofounders] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/admin/cofounders').then(r => setCofounders(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => { setForm(empty); setModal('create') }
  const openEdit = (c) => {
    setForm({
      name: c.name, initials: c.initials, role: c.role,
      bio: c.bio || '', linkedinUrl: c.linkedinUrl || '',
      gradient: c.gradient || GRADIENT_OPTIONS[0].value,
      isActive: c.isActive, sortOrder: c.sortOrder || 0,
    })
    setModal(c)
  }

  const closeModal = () => { setModal(null); setForm(empty) }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, sortOrder: parseInt(form.sortOrder) || 0 }
      if (modal === 'create') {
        await api.post('/admin/cofounders', payload)
        toast.success('Co-founder added')
      } else {
        await api.put(`/admin/cofounders/${modal.id}`, payload)
        toast.success('Co-founder updated')
      }
      closeModal(); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const del = async (id) => {
    if (!window.confirm('Delete this co-founder?')) return
    setDeleting(id)
    try {
      await api.delete(`/admin/cofounders/${id}`)
      toast.success('Deleted')
      load()
    } catch { toast.error('Delete failed') }
    finally { setDeleting(null) }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg,#0F172A,#1E293B)', padding: '40px 0 60px', color: '#fff' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Manage Co-Founders</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Add, edit, and remove founders shown on the homepage</p>
          </div>
          <button onClick={openCreate} className="btn btn-gold" style={{ gap: 8 }}>
            <FiPlus size={15} /> Add Co-Founder
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: -32, paddingBottom: 60 }}>
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : cofounders.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: 'center' }}>
            <FiUsers size={40} style={{ color: 'var(--text-4)', marginBottom: 16 }} />
            <p style={{ color: 'var(--text-3)', fontSize: 15, marginBottom: 20 }}>No co-founders yet. Add your first one.</p>
            <button onClick={openCreate} className="btn btn-primary btn-pill">
              <FiPlus size={14} /> Add Co-Founder
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
            {cofounders.map(c => (
              <div key={c.id} className="card" style={{ padding: 24, opacity: c.isActive ? 1 : 0.55 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: c.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontWeight: 800, fontSize: 16 }}>
                    {c.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{c.name}</h3>
                        <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>{c.role}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button onClick={() => openEdit(c)} className="btn btn-ghost btn-xs btn-pill" style={{ padding: '5px 10px' }}>
                          <FiEdit2 size={13} />
                        </button>
                        <button onClick={() => del(c.id)} disabled={deleting === c.id} className="btn btn-xs btn-pill" style={{ padding: '5px 10px', color: 'var(--error)', background: 'var(--error-l)', border: 'none' }}>
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                    {c.bio && <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginTop: 10 }}>{c.bio.length > 100 ? c.bio.slice(0, 100) + '…' : c.bio}</p>}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                      {!c.isActive && <span className="badge badge-gray" style={{ fontSize: 10 }}>Hidden</span>}
                      {c.linkedinUrl && c.linkedinUrl !== '#' && <span style={{ fontSize: 11, color: 'var(--primary)' }}>LinkedIn linked</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(8,14,29,.6)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 32px 64px rgba(8,14,29,.25)' }}>
            <div style={{ background: 'linear-gradient(135deg,#080E1D,#1E2D4F)', padding: '22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>{modal === 'create' ? 'Add Co-Founder' : `Edit — ${modal.name}`}</h2>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#fff', display: 'flex' }}>
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={save} style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Rahul Sharma" />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Initials *</label>
                  <input className="form-input" required maxLength={4} value={form.initials} onChange={e => setForm(p => ({ ...p, initials: e.target.value.toUpperCase() }))} placeholder="RS" style={{ width: 80 }} />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Role / Title *</label>
                <input className="form-input" required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Co-Founder & CEO" />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Bio</label>
                <textarea className="form-input" rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Short bio about the founder..." style={{ resize: 'vertical' }} />
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
                  <FiSave size={14} /> {saving ? 'Saving…' : (modal === 'create' ? 'Add Co-Founder' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
