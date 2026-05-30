import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiUpload, FiArrowLeft } from 'react-icons/fi'

const EXPERTISE_OPTIONS = ['Leadership', 'Technology', 'Marketing', 'Finance', 'Operations', 'HR', 'Sales', 'Strategy', 'Product', 'Design', 'Entrepreneurship', 'Consulting']

export default function MentorEditProfile() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', company: '', bio: '', yearsExperience: '', expertise: [], linkedinUrl: '', sessionPrice: '' })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/mentors/me/profile').then(r => {
      const p = r.data
      setForm({ title: p.title || '', company: p.company || '', bio: p.bio || '', yearsExperience: p.yearsExperience || '', expertise: p.expertise || [], linkedinUrl: p.linkedinUrl || '', sessionPrice: p.sessionPrice || '' })
      if (p.photoUrl) setPreview(p.photoUrl)
    })
  }, [])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const toggleExpertise = (item) => {
    setForm(p => ({
      ...p,
      expertise: p.expertise.includes(item) ? p.expertise.filter(e => e !== item) : [...p.expertise, item],
    }))
  }

  const handlePhoto = (e) => {
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
      await api.put('/mentors/me/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Profile updated!')
      navigate('/mentor/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
            <FiArrowLeft /> Back
          </button>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Edit Mentor Profile</span>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 720, paddingTop: 32 }}>
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Your Mentor Profile</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>This information will be visible to mentees after admin approval</p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Photo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {preview ? (
                  <img src={preview} alt="Preview" className="avatar avatar-xl" />
                ) : (
                  <div className="avatar-placeholder avatar-xl" style={{ fontSize: 24 }}>?</div>
                )}
                <div>
                  <label style={{ cursor: 'pointer' }} className="btn btn-ghost btn-sm">
                    <FiUpload size={14} /> Upload Photo
                    <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                  </label>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>JPG, PNG or WebP · Max 5MB</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input type="text" className="form-input" placeholder="e.g. VP of Engineering" value={form.title} onChange={set('title')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-input" placeholder="e.g. Acme Corp" value={form.company} onChange={set('company')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input type="number" className="form-input" placeholder="e.g. 12" min="0" max="50" value={form.yearsExperience} onChange={set('yearsExperience')} />
                </div>
                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <input type="url" className="form-input" placeholder="https://linkedin.com/in/..." value={form.linkedinUrl} onChange={set('linkedinUrl')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-input form-textarea" placeholder="Tell mentees about your experience, what you can help with, and your mentoring style..." value={form.bio} onChange={set('bio')} style={{ minHeight: 120 }} />
              </div>

              <div className="form-group">
                <label className="form-label">Areas of Expertise</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {EXPERTISE_OPTIONS.map(item => (
                    <button key={item} type="button" onClick={() => toggleExpertise(item)}
                      style={{
                        padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500, border: '1.5px solid',
                        borderColor: form.expertise.includes(item) ? 'var(--primary)' : 'var(--border)',
                        background: form.expertise.includes(item) ? 'var(--primary-light)' : 'white',
                        color: form.expertise.includes(item) ? 'var(--primary)' : 'var(--text-muted)',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-secondary" disabled={loading}>
                  {loading ? 'Saving…' : 'Save Profile'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
