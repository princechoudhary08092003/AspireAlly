import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiMenu, FiX, FiLogOut, FiGrid, FiChevronDown,
  FiUser, FiCalendar, FiShield
} from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const dashPath = user?.role === 'admin' ? '/admin' : user?.role === 'mentor' ? '/mentor/dashboard' : '/mentee/dashboard'
  // Only go transparent/dark on homepage before scroll; all other pages/states = white
  const onHero = pathname === '/' && !scrolled

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/mentors', label: 'Find Mentors' },
    { to: '/pricing', label: 'Pricing' },
  ]

  const navBg    = scrolled ? 'rgba(255,255,255,0.96)' : onHero ? 'rgba(8,14,29,0.55)' : 'rgba(255,255,255,0.96)'
  const navBdr   = scrolled || !onHero ? '1px solid var(--border)' : '1px solid rgba(255,255,255,.1)'
  const isDark   = onHero   // true = white text; false = dark text

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        background: navBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: navBdr,
        transition: 'background .3s, border-color .3s, box-shadow .3s',
        boxShadow: isDark ? 'none' : '0 2px 20px rgba(8,14,29,.06)',
      }}>
        <div className="container" style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--grad-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37,99,235,.3)',
            }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 18, letterSpacing: '-.02em' }}>MR</span>
            </div>
            <span style={{
              fontWeight: 800, fontSize: 18, letterSpacing: '-.02em',
              color: isDark ? '#fff' : 'var(--text)',
              transition: 'color .3s',
            }}>Mentor<span style={{ color: 'var(--gold-b)' }}>Rise</span></span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hide-md">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: isDark
                  ? (pathname === l.to ? 'var(--gold-b)' : 'rgba(255,255,255,.85)')
                  : (pathname === l.to ? 'var(--primary)' : 'var(--text-2)'),
                background: pathname === l.to && !isDark ? 'var(--primary-xl)' : 'transparent',
                transition: 'all .2s',
              }}
                onMouseEnter={e => { if (pathname !== l.to) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,.1)' : 'var(--bg-2)' }}
                onMouseLeave={e => { if (pathname !== l.to) e.currentTarget.style.background = 'transparent' }}
              >{l.label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <div ref={dropRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px 7px 8px',
                    background: isDark ? 'rgba(255,255,255,.1)' : 'var(--bg-2)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,.2)' : 'var(--border)'}`,
                    borderRadius: 100, cursor: 'pointer', transition: 'all .2s',
                  }}>
                  <div className="av-placeholder av-xs" style={{
                    borderRadius: '50%', width: 28, height: 28, fontSize: 11,
                    background: 'var(--grad-brand)',
                  }}>{user.firstName?.[0]}{user.lastName?.[0]}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#fff' : 'var(--text)' }} className="hide-sm">{user.firstName}</span>
                  <FiChevronDown size={13} style={{ color: isDark ? 'rgba(255,255,255,.7)' : 'var(--text-3)', transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>

                {dropOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    background: '#fff', border: '1px solid var(--border)', borderRadius: 16,
                    boxShadow: 'var(--sh-xl)', minWidth: 200, overflow: 'hidden', zIndex: 300,
                  }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                      <p style={{ fontSize: 13, fontWeight: 700 }}>{user.firstName} {user.lastName}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{user.email}</p>
                      <span className={`badge badge-${user.role === 'admin' ? 'error' : user.role === 'mentor' ? 'maroon' : 'primary'}`} style={{ marginTop: 8, fontSize: 10 }}>
                        {user.role}
                      </span>
                    </div>
                    {[
                      { to: dashPath, icon: <FiGrid size={14} />, label: 'Dashboard' },
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setDropOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 14, color: 'var(--text-2)', transition: 'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <div style={{ height: 1, background: 'var(--border)' }} />
                    <button onClick={() => { setDropOpen(false); logout() }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 14, color: 'var(--error)', width: '100%', background: 'none', border: 'none', cursor: 'pointer', transition: 'background .15s', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--error-l)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <FiLogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }} className="hide-md">
                <Link to="/login" className={`btn btn-sm ${isDark ? 'btn-glass' : 'btn-ghost'}`}>Sign In</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Get Started</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="hide-lg"
              style={{
                background: isDark ? 'rgba(255,255,255,.1)' : 'var(--bg-2)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,.2)' : 'var(--border)'}`,
                borderRadius: 8, padding: 7, cursor: 'pointer', color: isDark ? '#fff' : 'var(--text)', display: 'flex',
              }}>
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div style={{
          overflow: 'hidden', transition: 'all .3s ease',
          maxHeight: mobileOpen ? '600px' : '0', opacity: mobileOpen ? 1 : 0,
          background: 'rgba(255,255,255,.98)', backdropFilter: 'blur(20px)',
          borderTop: mobileOpen ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{ padding: '12px 18px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                style={{ padding: '12px 14px', fontSize: 15, fontWeight: 500, color: pathname === l.to ? 'var(--primary)' : 'var(--text)', borderRadius: 8, background: pathname === l.to ? 'var(--primary-xl)' : 'transparent' }}>
                {l.label}
              </Link>
            ))}
            {!user && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                <Link to="/register" className="btn btn-primary btn-full">Get Started</Link>
                <Link to="/login" className="btn btn-ghost btn-full">Sign In</Link>
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', fontSize: 12, color: 'var(--text-3)', borderRadius: 8 }}>
                  <FiShield size={13} /> Admin Portal
                </Link>
              </div>
            )}
            {user && (
              <div style={{ marginTop: 8 }}>
                <Link to={dashPath} className="btn btn-primary btn-full" style={{ marginBottom: 8 }}>Dashboard</Link>
                <button onClick={logout} className="btn btn-ghost btn-full" style={{ color: 'var(--error)' }}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Spacer so content doesn't hide under fixed nav */}
      <div style={{ height: 68 }} />
    </>
  )
}
