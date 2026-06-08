import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiLinkedin, FiShield, FiMail } from 'react-icons/fi'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--navy-800)', color: 'rgba(255,255,255,.55)', borderTop: '1px solid rgba(255,255,255,.06)' }}>
      <div className="container" style={{ paddingTop: 64, paddingBottom: 40 }}>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 16, letterSpacing: '-.02em' }}>MR</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-.02em' }}>Mentor<span style={{ color: 'var(--gold-b)' }}>Rise</span></span>
            </Link>
            <p style={{ fontSize: 14, lineHeight: 1.75, maxWidth: 280, marginBottom: 20 }}>
              Bridging the gap between ambitious professionals and seasoned industry leaders. Co-creating structured roadmaps for lasting success.
            </p>
            <a href="mailto:hello@mentorrise.in" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,.5)', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}>
              <FiMail size={14} /> hello@mentorrise.in
            </a>
          </div>

          {/* Programme */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 16 }}>Programme</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['/', 'Home'], ['/mentors', 'Find Mentors'], ['/pricing', 'Pricing & Plans'], ['/register', 'Join Programme']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', transition: 'color .18s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 16 }}>Account</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['/login', 'Sign In'], ['/register?role=mentee', 'Join as Mentee'], ['/register?role=mentor', 'Join as Mentor']].map(([to, label]) => (
                <li key={label}>
                  <Link to={to} style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', transition: 'color .18s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Team */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: 16 }}>Team</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['https://www.linkedin.com/in/anjali-bahl-3393022b5', 'Anjali Bahl'],
                ['https://www.linkedin.com/in/anil-bahl-63ba059', 'Anil Bahl'],
              ].map(([href, label]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer"
                    style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', transition: 'color .18s', display: 'flex', alignItems: 'center', gap: 6 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}>
                    <FiLinkedin size={12} /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13 }}>© {year} Mentor Rise. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontSize: 13 }}>Pave Your Way to Success</span>
            <Link to="/login"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,.25)', transition: 'color .18s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,.55)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.25)'}>
              <FiShield size={11} /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile footer override */}
      <style>{`
        @media(max-width:768px){
          footer .container > div:first-child{grid-template-columns:1fr!important;gap:32px!important}
        }
      `}</style>
    </footer>
  )
}
