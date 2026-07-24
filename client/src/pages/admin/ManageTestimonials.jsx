import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi'

const GRADIENTS = [
  'linear-gradient(135deg,#2563EB,#1D4ED8)',
  'linear-gradient(135deg,#881337,#5C0D26)',
  'linear-gradient(135deg,#065F46,#047857)',
  'linear-gradient(135deg,#92400E,#B45309)',
  'linear-gradient(135deg,#4C1D95,#6D28D9)',
]
const EMPTY = { name: '', role: '', company: '', quote: '', rating: 5, initials: '', gradient: GRADIENTS[0], tag: '', isActive: true, sortOrder: 0 }

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const refresh = () => api.get('/admin/testimonials').then(r => setTestimonials(r.data)).finally(() => setLoading(false))
  useEffect(() => { refresh() }, [])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (t) => {
    setEditing(t.id)
    setForm({ name: t.name, role: t.role || '', company: t.company || '', quote: t.quote, rating: t.rating, initials: t.initials || '', gradient: t.gradient || GRADIENTS[0], tag: t.tag || '', isActive: t.isActive, sortOrder: t.sortOrder })
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY) }

  const autoInitials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const handleSave = async () => {
    if (!form.name.trim() || !form.quote.trim()) return toast.error('Name and quote are required')
    setSaving(true)
    const payload = { ...form, initials: form.initials || autoInitials(form.name) }
    try {
      if (editing) { await api.put(`/admin/testimonials/${editing}`, payload); toast.success('Testimonial updated') }
      else { await api.post('/admin/testimonials', payload); toast.success('Testimonial added') }
      closeModal(); refresh()
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return
    try { await api.delete(`/admin/testimonials/${id}`); toast.success('Deleted'); refresh() }
    catch { toast.error('Failed') }
  }

  const handleToggle = async (t) => {
    try { await api.put(`/admin/testimonials/${t.id}`, { ...t, isActive: !t.isActive }); refresh() }
    catch { toast.error('Failed') }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
            <FiArrowLeft size={14} /> Admin
          </Link>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Manage Testimonials</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Testimonials ({testimonials.length})</h2>
          <button className="btn btn-primary" onClick={openAdd} style={{ gap: 8 }}>
            <FiPlus size={14} /> Add Testimonial
          </button>
        </div>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
            {testimonials.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', gridColumn: '1/-1' }}>No testimonials yet.</div>}
            {testimonials.map(t => (
              <div key={t.id} className="card" style={{ padding: 20, opacity: t.isActive ? 1 : 0.55 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{t.initials}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}{t.company ? ` · ${t.company}` : ''}</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, i) => <FiStar key={i} size={12} style={{ color: '#F59E0B', fill: '#F59E0B' }} />)}
                    {t.tag && <span className="chip" style={{ fontSize: 11, marginLeft: 4 }}>{t.tag}</span>}
                    <span className={`badge ${t.isActive ? 'badge-success' : 'badge-gray'}`} style={{ fontSize: 11 }}>{t.isActive ? 'Active' : 'Hidden'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}><FiEdit2 size={13} /></button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(t)} style={{ fontSize: 11 }}>{t.isActive ? 'Hide' : 'Show'}</button>
                    <button className="btn btn-sm" style={{ color: 'var(--error)', background: 'var(--error-l)', border: 'none' }} onClick={() => handleDelete(t.id)}><FiTrash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 560, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Initials (auto if blank)</label>
                <input className="form-input" placeholder="e.g. AB" maxLength={2} value={form.initials} onChange={e => setForm(f => ({ ...f, initials: e.target.value.toUpperCase() }))} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Role</label>
                <input className="form-input" placeholder="e.g. Software Engineer" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Company</label>
                <input className="form-input" placeholder="Company name" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Quote *</label>
              <textarea className="form-input form-textarea" placeholder="Testimonial text..." value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} style={{ minHeight: 90 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Rating (1–5)</label>
                <select className="form-input" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseInt(e.target.value) }))}>
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tag</label>
                <input className="form-input" placeholder="e.g. Career Growth" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input className="form-input" type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Avatar Gradient</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {GRADIENTS.map(g => (
                  <button key={g} onClick={() => setForm(f => ({ ...f, gradient: g }))} style={{ width: 36, height: 36, borderRadius: '50%', background: g, border: form.gradient === g ? '3px solid var(--text)' : '3px solid transparent', cursor: 'pointer' }} />
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                Active (visible on site)
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
