import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiSave, FiExternalLink } from 'react-icons/fi'

const CONFIG_KEYS = [
  { key: 'mentee_form_url', label: 'Mentee Application Form URL', description: 'Google Form link shown on the "Find a Mentor / Apply as Mentee" button', placeholder: 'https://forms.gle/...' },
  { key: 'mentor_form_url', label: 'Become a Mentor Form URL', description: 'Google Form link for professionals who want to join as mentors', placeholder: 'https://forms.gle/...' },
  { key: 'intro_session_form_url', label: 'Request Introductory Session URL', description: 'Google Form link for the free 15-min intro session request button', placeholder: 'https://forms.gle/...' },
]

export default function ManageSiteConfig() {
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})

  const refresh = () => {
    api.get('/admin/site-config').then(r => {
      const map = {}
      r.data.forEach(c => { map[c.key] = c.value || '' })
      setValues(map)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { refresh() }, [])

  const handleSave = async (key) => {
    setSaving(s => ({ ...s, [key]: true }))
    try {
      await api.put(`/admin/site-config/${key}`, { value: values[key] || '' })
      toast.success('Saved!')
    } catch { toast.error('Failed to save') }
    finally { setSaving(s => ({ ...s, [key]: false })) }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
            <FiArrowLeft size={14} /> Admin
          </Link>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Site Settings</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, maxWidth: 720 }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Site Settings</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Configure Google Form links and other platform settings. These appear on buttons across the site.</p>
        </div>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CONFIG_KEYS.map(cfg => (
              <div key={cfg.key} className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{cfg.label}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{cfg.description}</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    className="form-input"
                    placeholder={cfg.placeholder}
                    value={values[cfg.key] || ''}
                    onChange={e => setValues(v => ({ ...v, [cfg.key]: e.target.value }))}
                    style={{ flex: 1 }}
                  />
                  {values[cfg.key] && (
                    <a href={values[cfg.key]} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" title="Test link">
                      <FiExternalLink size={14} />
                    </a>
                  )}
                  <button className="btn btn-primary btn-sm" onClick={() => handleSave(cfg.key)} disabled={saving[cfg.key]} style={{ gap: 6, whiteSpace: 'nowrap' }}>
                    <FiSave size={13} /> {saving[cfg.key] ? 'Saving…' : 'Save'}
                  </button>
                </div>
                {!values[cfg.key] && (
                  <p style={{ fontSize: 12, color: 'var(--warning)', marginTop: 8 }}>No URL set. Button will show an alert prompting to contact mentorrise47@gmail.com instead.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
