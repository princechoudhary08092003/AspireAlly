import { useState, useEffect } from 'react'
import { FiSearch, FiFilter } from 'react-icons/fi'
import MentorCard from '../components/MentorCard'
import api from '../utils/api'

const EXPERTISE_OPTIONS = ['Leadership', 'Technology', 'Marketing', 'Finance', 'Operations', 'HR', 'Sales', 'Strategy', 'Product', 'Design']

export default function Mentors() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filter) params.set('expertise', filter)
    api.get(`/mentors?${params}`).then(r => setMentors(r.data)).finally(() => setLoading(false))
  }, [search, filter])

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E3A8A)', padding: '60px 0 80px', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <div className="badge badge-gold" style={{ marginBottom: 16 }}>Our Mentors</div>
          <h1 className="h1" style={{ color: 'white', marginBottom: 16 }}>Meet Your <span style={{ background: 'linear-gradient(135deg, #F59E0B, #D4A017)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Industry Leaders</span></h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto', fontSize: 16 }}>
            Senior professionals with deep expertise ready to guide your career journey
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: -32, paddingBottom: 80 }}>
        {/* Search + Filter */}
        <div className="card" style={{ padding: 20, marginBottom: 32, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
            <input
              type="text" placeholder="Search by name, title, company…"
              className="form-input" style={{ paddingLeft: 38, width: '100%' }}
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ minWidth: 180, position: 'relative' }}>
            <FiFilter style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={15} />
            <select className="form-input form-select" style={{ paddingLeft: 36, width: '100%' }} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Expertise</option>
              {EXPERTISE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          {(search || filter) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilter('') }}>Clear Filters</button>
          )}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : mentors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ marginBottom: 8 }}>No mentors found</h3>
            <p style={{ fontSize: 14 }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>{mentors.length} mentor{mentors.length !== 1 ? 's' : ''} available</p>
            <div className="mentor-grid">
              {mentors.map(m => <MentorCard key={m.id} mentor={m} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
