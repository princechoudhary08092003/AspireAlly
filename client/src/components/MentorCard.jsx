import { Link } from 'react-router-dom'
import { FiStar, FiBriefcase, FiCalendar } from 'react-icons/fi'

export default function MentorCard({ mentor }) {
  const { user, title, company, bio, expertise, rating, sessionCount, photoUrl, yearsExperience } = mentor
  const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`

  return (
    <div className="card card-hover" style={{ transition: 'all 0.25s' }}>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="avatar avatar-lg" style={{ flexShrink: 0 }} />
          ) : (
            <div className="avatar-placeholder avatar-lg" style={{ flexShrink: 0, fontSize: 22 }}>{initials}</div>
          )}
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{name}</h3>
            {title && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{title}</p>}
            {company && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <FiBriefcase size={11} /> {company}
              </p>
            )}
          </div>
        </div>

        {bio && <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{bio}</p>}

        {expertise?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {expertise.slice(0, 3).map(e => <span key={e} className="chip" style={{ fontSize: 11 }}>{e}</span>)}
            {expertise.length > 3 && <span className="chip" style={{ fontSize: 11, background: 'var(--bg)', color: 'var(--text-muted)' }}>+{expertise.length - 3}</span>}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiStar size={12} style={{ color: 'var(--gold-bright)' }} />
              {rating > 0 ? rating.toFixed(1) : 'New'}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiCalendar size={12} /> {sessionCount} sessions
            </span>
          </div>
          <Link to={`/mentors/${user?.id}`} className="btn btn-primary btn-sm">Book</Link>
        </div>
      </div>
    </div>
  )
}
