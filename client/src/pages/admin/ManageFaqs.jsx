import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi'

const EMPTY = { question: '', answer: '', isActive: true, sortOrder: 0 }

export default function ManageFaqs() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const refresh = () => api.get('/admin/faqs').then(r => setFaqs(r.data)).finally(() => setLoading(false))

  useEffect(() => { refresh() }, [])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (faq) => { setEditing(faq.id); setForm({ question: faq.question, answer: faq.answer, isActive: faq.isActive, sortOrder: faq.sortOrder }); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY) }

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) return toast.error('Question and answer are required')
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/admin/faqs/${editing}`, form)
        toast.success('FAQ updated')
      } else {
        await api.post('/admin/faqs', form)
        toast.success('FAQ added')
      }
      closeModal()
      refresh()
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id, q) => {
    if (!window.confirm(`Delete: "${q}"?`)) return
    try { await api.delete(`/admin/faqs/${id}`); toast.success('Deleted'); refresh() }
    catch { toast.error('Failed') }
  }

  const handleToggle = async (faq) => {
    try { await api.put(`/admin/faqs/${faq.id}`, { ...faq, isActive: !faq.isActive }); refresh() }
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
          <span style={{ fontSize: 14, fontWeight: 600 }}>Manage FAQs</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>FAQs ({faqs.length})</h2>
          <button className="btn btn-primary" onClick={openAdd} style={{ gap: 8 }}>
            <FiPlus size={14} /> Add FAQ
          </button>
        </div>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>No FAQs yet. Add your first one.</div>}
            {faqs.map((faq, i) => (
              <div key={faq.id} className="card" style={{ padding: '16px 20px', opacity: faq.isActive ? 1 : 0.55 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 28, textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>Q{i + 1}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{faq.question}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>{faq.answer}</p>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                      <span className={`badge ${faq.isActive ? 'badge-success' : 'badge-gray'}`} style={{ fontSize: 11 }}>{faq.isActive ? 'Active' : 'Hidden'}</span>
                      <span className="badge badge-gray" style={{ fontSize: 11 }}>Sort: {faq.sortOrder}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(faq)}><FiEdit2 size={13} /></button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(faq)} style={{ fontSize: 11 }}>{faq.isActive ? 'Hide' : 'Show'}</button>
                    <button className="btn btn-sm" style={{ color: 'var(--error)', background: 'var(--error-l)', border: 'none' }} onClick={() => handleDelete(faq.id, faq.question)}><FiTrash2 size={13} /></button>
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
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{editing ? 'Edit FAQ' : 'Add FAQ'}</h3>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Question *</label>
              <input className="form-input" placeholder="e.g. What is MentorRise?" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Answer *</label>
              <textarea className="form-input form-textarea" placeholder="Detailed answer..." value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} style={{ minHeight: 100 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input className="form-input" type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                  Active (visible on site)
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save FAQ'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
