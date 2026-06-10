import { Link } from 'react-router-dom'
import { FiStar, FiBriefcase, FiCalendar, FiArrowRight } from 'react-icons/fi'

export default function MentorCard({ mentor }) {
  const { user, title, company, bio, expertise, rating, sessionCount, photoUrl } = mentor
  const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      border: '1px solid var(--border)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all .28s',
      height: '100%',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--sh-xl)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,.15)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {/* Coloured band */}
      <div style={{ height: 6, background: 'linear-gradient(90deg, var(--primary), var(--maroon))' }} />

      <div style={{ padding: '20px 20px 0', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Avatar — always a perfect circle */}
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            style={{
              width: 64, height: 64, minWidth: 64,
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              border: '3px solid var(--border)',
            }}
          />
        ) : (
          <div style={{
            width: 64, height: 64, minWidth: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--maroon))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 20,
            flexShrink: 0,
            border: '3px solid var(--border)',
          }}>
            {initials}
          </div>
        )}

        {/* Name block */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</h3>
          {title && (
            <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
          )}
          {company && (
            <p style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <FiBriefcase size={10} /> {company}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bio && (
          <p style={{
            fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {bio}
          </p>
        )}

        {expertise?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {expertise.slice(0, 3).map(e => (
              <span key={e} className="chip" style={{ fontSize: 11 }}>{e}</span>
            ))}
            {expertise.length > 3 && (
              <span className="chip chip-gray" style={{ fontSize: 11 }}>+{expertise.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiStar size={11} style={{ color: '#F59E0B' }} />
            {rating > 0 ? rating.toFixed(1) : 'New'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiCalendar size={11} /> {sessionCount}
          </span>
        </div>
        <Link
          to={`/mentors/${user?.id}`}
          className="btn btn-primary btn-sm btn-pill"
          style={{ fontSize: 12, padding: '6px 14px', gap: 5 }}
        >
          Book <FiArrowRight size={11} />
        </Link>
      </div>
    </div>
  )
}
