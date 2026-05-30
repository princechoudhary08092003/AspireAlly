import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiUpload, FiArrowLeft } from 'react-icons/fi'

const EXPERTISE_OPTIONS = ['Leadership', 'Technology', 'Marketing', 'Finance', 'Operations', 'HR', 'Sales', 'Strategy', 'Product', 'Design', 'Entrepreneurship', 'Consulting']

export default function AdminEditMentor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [mentor, setMentor] = useState(null)
  const [form, setForm] = useState({ title: '', company: '', bio: '', yearsExperience: '', expertise: [], linkedinUrl: '', sessionPrice: '' })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get(`/admin/mentors/${id}`).then(r => {
      setMentor(r.data)
      const p = r.data.mentorProfile || {}
      setForm({ title: p.title || '', company: p.company || '', bio: p.bio || '', yearsExperience: p.yearsExperience || '', expertise: p.expertise || [], linkedinUrl: p.linkedinUrl || '', sessionPrice: p.sessionPrice || '' })
      if (p.photoUrl) setPreview(p.photoUrl)
    }).catch(() => navigate('/admin/mentors'))
  }, [id])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const toggleExpertise = item => setForm(p => ({ ...p, expertise: p.expertise.includes(item) ? p.expertise.filter(e => e !== item) : [...p.expertise, item] }))

  const handlePhoto = e => {
    const f = e.target.files[0]
    if (f) { setPhoto(f); setPreview(URL.createObjectURL(f)) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'expertise' ? JSON.stringify(v) : v))
      if (photo) fd.append('photo', photo)
      await api.put(`/admin/mentors/${id}/profile`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Mentor profile updated!')
      navigate('/admin/mentors')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  if (!mentor) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/admin/mentors" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
            <FiArrowLeft size={14} /> Mentors
          </Link>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Edit: {mentor.firstName} {mentor.lastName}</span>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 720, paddingTop: 32 }}>
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Edit Mentor Profile</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{mentor.email}</p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {preview ? <img src={preview} alt="" className="avatar avatar-xl" /> : <div className="avatar-placeholder avatar-xl" style={{ fontSize: 24 }}>{mentor.firstName?.[0]}{mentor.lastName?.[0]}</div>}
                <div>
                  <label style={{ cursor: 'pointer' }} className="btn btn-ghost btn-sm">
                    <FiUpload size={14} /> Upload Photo
                    <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input type="text" className="form-input" placeholder="e.g. VP of Engineering" value={form.title} onChange={set('title')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-input" value={form.company} onChange={set('company')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input type="number" className="form-input" min="0" max="50" value={form.yearsExperience} onChange={set('yearsExperience')} />
                </div>
                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <input type="url" className="form-input" value={form.linkedinUrl} onChange={set('linkedinUrl')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-input form-textarea" value={form.bio} onChange={set('bio')} style={{ minHeight: 120 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Areas of Expertise</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {EXPERTISE_OPTIONS.map(item => (
                    <button key={item} type="button" onClick={() => toggleExpertise(item)}
                      style={{ padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500, border: '1.5px solid', borderColor: form.expertise.includes(item) ? 'var(--primary)' : 'var(--border)', background: form.expertise.includes(item) ? 'var(--primary-light)' : 'white', color: form.expertise.includes(item) ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</button>
                <Link to="/admin/mentors" className="btn btn-ghost">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
