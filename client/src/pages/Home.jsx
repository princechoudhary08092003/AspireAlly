import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import {
  FiArrowRight, FiCheckCircle, FiLinkedin, FiLock,
  FiMail, FiStar, FiUsers, FiCalendar, FiTrendingUp,
  FiTarget, FiAward, FiBook, FiZap, FiShield,
  FiMessageSquare, FiPlus, FiMinus, FiHeart, FiGlobe, FiLayers
} from 'react-icons/fi'

/* ── DATA ──────────────────────────────────────── */
const TEAM = [
  {
    name: 'Anjali Bahl', role: 'Co-Founder', initials: 'AB',
    gradient: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
    linkedin: 'https://www.linkedin.com/in/anjali-bahl-3393022b5',
  },
  {
    name: 'Anil Bahl', role: 'Co-Founder', initials: 'AB',
    gradient: 'linear-gradient(135deg,#881337,#5C0D26)',
    linkedin: 'https://www.linkedin.com/in/anil-bahl-63ba059',
  },
]


const STEPS = [
  { num: '01', icon: <FiBook />, title: 'Onboarding Masterclass', desc: 'Understand the full scope of the programme. Set expectations and chart your starting point.' },
  { num: '02', icon: <FiTarget />, title: 'Smart Goals (STAR)', desc: 'Define measurable, ambitious goals using the STAR framework with your dedicated mentor.' },
  { num: '03', icon: <FiUsers />, title: 'Mentor Session', desc: 'Deep 1-on-1 with your chosen industry leader — strategy, guidance, real-world insight.' },
  { num: '04', icon: <FiAward />, title: 'Roadmap & Action', desc: 'Consolidate learnings, build your action plan, and launch your personalised career roadmap.' },
]

const OUTCOMES = [
  'Structure a personalised career roadmap',
  'Identify and leverage your key strengths',
  'Understand market fitment and opportunities',
  'Define professional goals aligned with your values',
  'Build a strong personal brand and online presence',
  'Develop an actionable networking strategy',
]

const STATS = [
  { val: '200+', lbl: 'Expert Mentors', icon: <FiUsers /> },
  { val: '1,500+', lbl: 'Sessions Completed', icon: <FiCalendar /> },
  { val: '95%', lbl: 'Mentee Satisfaction', icon: <FiTrendingUp /> },
  { val: '12+', lbl: 'Industries Covered', icon: <FiAward /> },
]

/* ── WHY MENTOR DATA ───────────────────────────── */
const MENTOR_REASONS = [
  {
    icon: <FiHeart size={22} />,
    title: 'Give Back to the Next Generation',
    desc: 'After years of navigating corporate challenges, mentoring is the most meaningful way to pay it forward — helping talented professionals avoid the pitfalls you once faced.',
    color: '#881337',
    bg: '#fff1f2',
  },
  {
    icon: <FiGlobe size={22} />,
    title: 'Expand Your Own Network',
    desc: "Mentoring isn't one-directional. You gain fresh perspectives, build relationships with high-potential professionals, and stay connected to the evolving pulse of your industry.",
    color: '#2563EB',
    bg: '#eff6ff',
  },
  {
    icon: <FiLayers size={22} />,
    title: 'Sharpen Your Leadership Edge',
    desc: 'Teaching what you know forces you to articulate, organise and refine your thinking. Mentors consistently report becoming better communicators and stronger leaders.',
    color: '#C9920B',
    bg: '#fefce8',
  },
  {
    icon: <FiTrendingUp size={22} />,
    title: 'Create Measurable Impact',
    desc: "One honest conversation can redirect a career. As a mentor on Mentor Rise, you'll guide structured sessions — not just advise, but co-create real action plans that produce results.",
    color: '#059669',
    bg: '#f0fdf4',
  },
  {
    icon: <FiAward size={22} />,
    title: 'Build a Legacy of Excellence',
    desc: "Your career achievements become a blueprint others can follow. Mentor Rise lets you formalise your expertise into a structured programme that outlasts any single session.",
    color: '#7C3AED',
    bg: '#f5f3ff',
  },
  {
    icon: <FiUsers size={22} />,
    title: 'Be Part of a Curated Community',
    desc: "Join an exclusive network of senior leaders who believe in structured, high-quality mentorship. Share best practices, collaborate on career frameworks, and elevate the profession.",
    color: '#0891B2',
    bg: '#ecfeff',
  },
]

/* ── TESTIMONIALS DATA ─────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Marketing Manager → Head of Brand',
    company: 'Fintech Startup, Bengaluru',
    quote: "I had been stuck at the same designation for three years, unsure of what was holding me back. My Mentor Rise mentor helped me see exactly where my gaps were and how to fill them. Within six months I was heading a brand team.",
    rating: 5,
    initials: 'PS',
    gradient: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
    tag: 'Career Transition',
  },
  {
    name: 'Arjun Mehta',
    role: 'Software Engineer → Product Manager',
    company: 'SaaS Company, Pune',
    quote: "The STAR goal-setting session was a game-changer. I walked in with vague aspirations and walked out with a 90-day plan. My mentor's cross-industry perspective pushed me to think bigger than my immediate role.",
    rating: 5,
    initials: 'AM',
    gradient: 'linear-gradient(135deg,#881337,#5C0D26)',
    tag: 'Role Switch',
  },
  {
    name: 'Neha Kapoor',
    role: 'MBA Fresher → Strategy Analyst',
    company: 'Big 4 Consulting, Delhi',
    quote: "As a fresh MBA graduate the job market was overwhelming. My mentor had been through it all — the interview circuits, the negotiations, the politics. Their coaching gave me real confidence, not just textbook answers.",
    rating: 5,
    initials: 'NK',
    gradient: 'linear-gradient(135deg,#C9920B,#F59E0B)',
    tag: 'Campus to Corporate',
  },
  {
    name: 'Rohan Dsouza',
    role: 'Sales Executive → Business Development Lead',
    company: 'FMCG Enterprise, Mumbai',
    quote: "What sets Mentor Rise apart is the structure. It's not just a chat — there's a clear framework, clear outcomes. My mentor held me accountable, reviewed my progress, and pushed me when I needed it.",
    rating: 5,
    initials: 'RD',
    gradient: 'linear-gradient(135deg,#059669,#047857)',
    tag: 'Leadership Growth',
  },
]

/* ── FAQS DATA ─────────────────────────────────── */
const FAQS = [
  {
    q: 'Who is the Mentor Rise programme designed for?',
    a: 'Mentor Rise is built for working professionals, MBA graduates, and career switchers who want structured, personalised guidance — not generic advice. Whether you are two years into your career or ten, if you are serious about growth, this is for you.',
  },
  {
    q: 'How does mentor matching work?',
    a: 'You browse our curated roster of approved mentors — each with detailed profiles including expertise, industry background, and availability. You pick who resonates with your goals and book directly from their open slots.',
  },
  {
    q: 'What actually happens in a session?',
    a: 'Sessions are 1-on-1 and typically 60 minutes. Your mentor will prepare based on your goals and notes submitted at booking. Sessions cover strategic career mapping, specific challenges, industry insight, and concrete action points — not casual conversation.',
  },
  {
    q: 'Is the programme fully online?',
    a: 'Yes, completely. Sessions happen via Zoom, Microsoft Teams, or Google Meet. Your mentor adds the link before the session and you access it directly from your dashboard.',
  },
  {
    q: 'Can I book sessions with multiple mentors?',
    a: 'Absolutely. With an active subscription you can book sessions with any approved mentor on the platform. Many mentees work with two or three mentors across different functional areas.',
  },
  {
    q: 'How do I become a mentor on Mentor Rise?',
    a: 'Register as a mentor, complete your profile, and submit for review. Our admin team personally reviews each application to ensure quality. Once approved, you set your own availability and begin accepting bookings.',
  },
  {
    q: 'What makes Mentor Rise different from LinkedIn networking?',
    a: 'LinkedIn gets you a connection; Mentor Rise gets you a structured relationship with accountability. Every interaction follows a defined framework — onboarding, STAR goal-setting, sessions, and an action roadmap — designed to produce measurable career outcomes.',
  },
  {
    q: 'Is my session information kept confidential?',
    a: 'Yes. Notes, goals, and session details are only visible to you and your mentor. Mentor Rise does not share individual session content with third parties.',
  },
]

/* ── FAQ ITEM ──────────────────────────────────── */
function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: `1px solid ${open ? 'var(--primary)' : 'var(--border)'}`,
      borderRadius: 14,
      overflow: 'hidden',
      transition: 'border-color .2s, box-shadow .2s',
      boxShadow: open ? '0 4px 20px rgba(37,99,235,.1)' : 'none',
      background: '#fff',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16, background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: open ? 'var(--primary)' : 'var(--text)', lineHeight: 1.4 }}>
          {faq.q}
        </span>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: open ? 'var(--primary)' : 'var(--bg-2)',
          transition: 'all .2s',
        }}>
          {open
            ? <FiMinus size={13} color="#fff" />
            : <FiPlus size={13} color="var(--text-3)" />
          }
        </div>
      </button>
      <div style={{
        maxHeight: open ? 300 : 0, overflow: 'hidden',
        transition: 'max-height .3s ease',
      }}>
        <p style={{ padding: '0 24px 20px', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75 }}>
          {faq.a}
        </p>
      </div>
    </div>
  )
}

/* ── ADMIN LOGIN MODAL ─────────────────────────── */
function AdminLoginModal({ onClose }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role !== 'admin') { toast.error('Not an admin account'); setLoading(false); return }
      toast.success('Welcome, Admin!'); onClose(); navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally { setLoading(false) }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(8,14,29,.7)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 400, boxShadow: '0 32px 64px rgba(8,14,29,.3)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg,#080E1D,#1E2D4F)', padding: '24px 28px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiShield size={15} color="#fff" />
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Admin Portal</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13 }}>Restricted access — authorised users only</p>
        </div>
        <div style={{ padding: '24px 28px 28px' }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 16, fontSize: 13 }}>{error}</div>}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} size={15} />
                <input type="email" required className="form-input" style={{ paddingLeft: 38 }} placeholder="admin@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} size={15} />
                <input type="password" required className="form-input" style={{ paddingLeft: 38 }} placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ marginTop: 4 }}>
              {loading ? 'Signing in…' : <><FiShield size={14} /> Sign in as Admin</>}
            </button>
          </form>
          <button onClick={onClose} style={{ width: '100%', marginTop: 10, padding: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-3)' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

/* ── MENTOR CARD (mini preview) ───────────────── */
function MentorPreviewCard({ mentor }) {
  const { user, title, company, expertise, photoUrl, rating, sessionCount } = mentor
  const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`
  return (
    <div className="mentor-card" style={{ minWidth: 260 }}>
      <div className="mentor-card-band" style={{ background: 'linear-gradient(135deg,#0D1628,#1E3A8A)' }} />
      <div className="mentor-card-top">
        {photoUrl
          ? <img src={photoUrl} alt={name} className="avatar av-lg" style={{ border: '3px solid #fff', boxShadow: 'var(--sh)', zIndex: 1, marginTop: 8 }} />
          : <div className="av-placeholder av-lg" style={{ borderRadius: '50%', border: '3px solid #fff', boxShadow: 'var(--sh)', zIndex: 1, marginTop: 8, background: 'var(--grad-brand)', fontSize: 26 }}>{initials}</div>
        }
        <h4 style={{ fontSize: 15, fontWeight: 700, marginTop: 10, marginBottom: 2 }}>{name}</h4>
        {title && <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 2 }}>{title}</p>}
        {company && <p style={{ fontSize: 11, color: 'var(--text-4)' }}>{company}</p>}
      </div>
      <div className="mentor-card-body">
        {expertise?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginBottom: 12 }}>
            {expertise.slice(0, 3).map(e => <span key={e} className="chip" style={{ fontSize: 10 }}>{e}</span>)}
          </div>
        )}
      </div>
      <div className="mentor-card-footer">
        <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <FiStar size={12} style={{ color: 'var(--gold-b)' }} /> {rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
        <Link to={`/mentors/${user?.id}`} className="btn btn-primary btn-xs btn-pill">Book →</Link>
      </div>
    </div>
  )
}

/* ── PERSON CARD (team / advisor) ─────────────── */
function PersonCard({ person, type }) {
  return (
    <div className="person-card">
      <div className="person-card-cover" style={{ background: person.gradient }} />
      <div className="person-card-body">
        <div className="person-card-avatar" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="av-placeholder av-lg" style={{ borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 8px 24px rgba(8,14,29,.15)', background: person.gradient, fontSize: 24 }}>
            {person.initials}
          </div>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 3 }}>{person.name}</h3>
        <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>{person.role}</p>
        {person.company && <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>{person.company}</p>}
        {person.location && (
          <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 10 }}>📍 {person.location}</p>
        )}
        {person.bio && (
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 14 }}>{person.bio}</p>
        )}
        {person.tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginBottom: 14 }}>
            {person.tags.map(t => <span key={t} className="chip chip-gray" style={{ fontSize: 11 }}>{t}</span>)}
          </div>
        )}
        {person.followers && (
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
            <strong style={{ color: 'var(--text)' }}>{person.followers}+</strong> LinkedIn followers
          </p>
        )}
        <a href={person.linkedin} target="_blank" rel="noreferrer"
          className="btn btn-outline btn-sm btn-full btn-pill"
          style={{ gap: 7 }}>
          <FiLinkedin size={14} /> View Profile
        </a>
      </div>
    </div>
  )
}

/* ── MAIN HOME PAGE ────────────────────────────── */
export default function Home() {
  const { user } = useAuth()
  const [mentors, setMentors] = useState([])
  const [advisors, setAdvisors] = useState([])
  const [adminModal, setAdminModal] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    api.get('/mentors').then(r => setMentors(r.data.slice(0, 6))).catch(() => {})
    api.get('/advisors').then(r => setAdvisors(r.data)).catch(() => {})
  }, [])

  // horizontal scroll drag
  useEffect(() => {
    const el = scrollRef.current; if (!el) return
    let isDown = false, startX, scrollLeft
    const down = e => { isDown = true; el.style.cursor = 'grabbing'; startX = (e.pageX || e.touches?.[0]?.pageX) - el.offsetLeft; scrollLeft = el.scrollLeft }
    const up = () => { isDown = false; el.style.cursor = 'grab' }
    const move = e => { if (!isDown) return; e.preventDefault(); const x = (e.pageX || e.touches?.[0]?.pageX) - el.offsetLeft; el.scrollLeft = scrollLeft - (x - startX) * 1.5 }
    el.addEventListener('mousedown', down); el.addEventListener('mouseleave', up); el.addEventListener('mouseup', up); el.addEventListener('mousemove', move)
    return () => { el.removeEventListener('mousedown', down); el.removeEventListener('mouseleave', up); el.removeEventListener('mouseup', up); el.removeEventListener('mousemove', move) }
  }, [])

  return (
    <div>
      {adminModal && <AdminLoginModal onClose={() => setAdminModal(false)} />}

      {/* ── HERO ── */}
      <section style={{ background: 'var(--grad-hero)', minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 40, paddingBottom: 60 }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '15%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(37,99,235,.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(136,19,55,.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle,rgba(201,146,11,.04) 0%,transparent 70%)', pointerEvents: 'none' }} />

        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ maxWidth: 780 }}>
            <div className="section-label section-label-dark" style={{ marginBottom: 28 }}>
              <FiZap size={12} /> Structured Mentorship Programme
            </div>

            <h1 className="display-1" style={{ color: '#fff', marginBottom: 24 }}>
              Nurturing the<br />
              <span style={{ background: 'linear-gradient(90deg,#F59E0B,#FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Next Generation</span><br />
              of Leaders
            </h1>

            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.7)', lineHeight: 1.75, maxWidth: 560, marginBottom: 40 }}>
              Connect with senior industry leaders for invaluable career guidance, personalised roadmaps, and networking opportunities that shape your future.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 60 }}>
              <Link to="/register" className="btn btn-gold btn-xl btn-pill">
                Start Your Journey <FiArrowRight />
              </Link>
              <Link to="/mentors" className="btn btn-glass btn-xl btn-pill">
                Meet the Mentors
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              {STATS.map(s => (
                <div key={s.lbl} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-.02em' }}>{s.val}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin quick access — bottom right */}
          {!user && (
            <button onClick={() => setAdminModal(true)}
              style={{ position: 'absolute', bottom: -20, right: 0, display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 100, cursor: 'pointer', color: 'rgba(255,255,255,.45)', fontSize: 12, fontWeight: 500, transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; e.currentTarget.style.color = 'rgba(255,255,255,.75)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = 'rgba(255,255,255,.45)' }}>
              <FiShield size={12} /> Admin Portal
            </button>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label section-label-blue" style={{ margin: '0 auto 20px' }}>Our Process</div>
            <h2 className="h1" style={{ marginBottom: 14 }}>Four Sessions.<br /><span className="text-gradient">Transformative Results.</span></h2>
            <p className="lead" style={{ maxWidth: 500, margin: '0 auto' }}>A structured programme designed to build clarity, direction, and momentum in your career.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 2, position: 'relative' }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', top: 40, left: '12.5%', right: '12.5%', height: 2, background: 'linear-gradient(90deg,var(--primary-l),var(--maroon-l),var(--gold-l),transparent)', zIndex: 0, borderRadius: 4 }} className="hide-md" />

            {STEPS.map((step, i) => (
              <div key={i} style={{ position: 'relative', zIndex: 1, padding: '0 12px', textAlign: 'center' }}>
                {/* Number + icon */}
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fff', border: '2px solid var(--border)', margin: '0 auto 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--sh-lg)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -8, right: -2, background: i % 2 === 0 ? 'var(--primary)' : 'var(--maroon)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 100, letterSpacing: '.04em' }}>{step.num}</div>
                  <span style={{ fontSize: 22, color: i % 2 === 0 ? 'var(--primary)' : 'var(--maroon)' }}>{step.icon}</span>
                </div>
                <h4 className="h4" style={{ marginBottom: 10, fontSize: 15 }}>{step.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUTCOMES (dark section) ── */}
      <section className="section" style={{ background: 'var(--navy)', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <div className="section-label section-label-gold" style={{ marginBottom: 20 }}>Outcomes</div>
              <h2 className="h1" style={{ color: '#fff', marginBottom: 20 }}>
                What You'll<br />
                <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Walk Away With</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 16, lineHeight: 1.75, marginBottom: 36 }}>
                More than a mentorship programme — a structured toolkit that equips you to navigate your career with confidence and clarity.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-gold btn-lg btn-pill">Join the Programme <FiArrowRight /></Link>
                <Link to="/pricing" className="btn btn-glass btn-lg btn-pill">View Pricing</Link>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {OUTCOMES.map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', background: 'rgba(255,255,255,.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,.07)', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,.25)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)' }}>
                  <FiCheckCircle size={17} style={{ color: 'var(--gold-b)', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,.85)', lineHeight: 1.5 }}>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MENTOR SHOWCASE ── */}
      {mentors.length > 0 && (
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="section-label section-label-maroon" style={{ marginBottom: 14 }}>Our Mentors</div>
                <h2 className="h1">Learn from <span className="text-gold">Industry Leaders</span></h2>
                <p className="caption" style={{ marginTop: 8 }}>Drag to explore · Click to book</p>
              </div>
              <Link to="/mentors" className="btn btn-outline btn-pill hide-md">View All Mentors <FiArrowRight /></Link>
            </div>

            <div ref={scrollRef} style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 12, cursor: 'grab', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
              <style>{`.scrollhide::-webkit-scrollbar{display:none}`}</style>
              {mentors.map(m => <MentorPreviewCard key={m.id} mentor={m} />)}
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link to="/mentors" className="btn btn-outline btn-pill">View All Mentors <FiArrowRight /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TEAM ── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-label section-label-blue" style={{ margin: '0 auto 16px' }}>The Team</div>
            <h2 className="h1">The Founders Behind <span className="text-gradient">Mentor Rise</span></h2>
            <p className="lead" style={{ maxWidth: 460, margin: '16px auto 0' }}>
              Visionaries committed to bridging the gap between ambition and achievement.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 28, maxWidth: 680, margin: '0 auto' }}>
            {TEAM.map(p => <PersonCard key={p.name} person={p} type="team" />)}
          </div>
        </div>
      </section>

      {/* ── ADVISORS ── */}
      {advisors.length > 0 && (
        <section className="section" style={{ background: 'linear-gradient(180deg,var(--bg) 0%,var(--bg-2) 100%)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-label section-label-gold" style={{ margin: '0 auto 16px' }}>Advisors</div>
              <h2 className="h1">Guided by <span className="text-gold">Senior Industry Leaders</span></h2>
              <p className="lead" style={{ maxWidth: 500, margin: '16px auto 0' }}>
                Our advisors bring decades of cross-industry experience to guide the programme's direction and quality.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 28, maxWidth: 800, margin: '0 auto' }}>
              {advisors.map(a => (
                <PersonCard key={a.id} type="advisor" person={{
                  name: a.name, initials: a.initials, role: a.role,
                  company: a.company, location: a.location, bio: a.bio,
                  tags: a.tags, followers: a.followers,
                  gradient: a.gradient, linkedin: a.linkedinUrl,
                }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY BECOME A MENTOR ── */}
      <section className="section" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="section-label section-label-dark" style={{ margin: '0 auto 18px' }}>
              <FiHeart size={12} /> For Mentors
            </div>
            <h2 className="h1" style={{ color: '#fff', marginBottom: 14 }}>
              Why Senior Leaders <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Choose to Mentor</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 16, lineHeight: 1.75, maxWidth: 560, margin: '0 auto 32px' }}>
              Mentorship is not charity — it's one of the most professionally and personally rewarding things a leader can do. Here's why the best in the industry give their time.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
            {MENTOR_REASONS.map((r, i) => (
              <div key={i} style={{
                padding: '24px 26px',
                background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 16,
                transition: 'all .25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.16)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 18,
                  background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: r.color,
                }}>
                  {r.icon}
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 10, lineHeight: 1.35 }}>{r.title}</h4>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.58)', lineHeight: 1.72 }}>{r.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/register?role=mentor" className="btn btn-gold btn-lg btn-pill">
              Apply as a Mentor <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-label section-label-maroon" style={{ margin: '0 auto 18px' }}>
              <FiMessageSquare size={12} /> Mentee Voices
            </div>
            <h2 className="h1" style={{ marginBottom: 14 }}>
              Real People. <span className="text-gradient">Real Breakthroughs.</span>
            </h2>
            <p className="lead" style={{ maxWidth: 500, margin: '0 auto' }}>
              Don't take our word for it — hear from professionals who've already walked this path.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 22 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card" style={{
                padding: 28, display: 'flex', flexDirection: 'column', gap: 20,
                borderTop: `3px solid ${i % 2 === 0 ? 'var(--primary)' : 'var(--maroon)'}`,
                transition: 'all .25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--sh-xl)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <FiStar key={s} size={14} style={{ fill: 'var(--gold-b)', color: 'var(--gold-b)' }} />
                  ))}
                </div>

                {/* Quote */}
                <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.78, fontStyle: 'italic', flex: 1 }}>
                  "{t.quote}"
                </p>

                {/* Tag */}
                <span style={{ alignSelf: 'flex-start', padding: '3px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'var(--primary-xl)', color: 'var(--primary-d)' }}>
                  {t.tag}
                </span>

                {/* Person */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div className="av-placeholder av-sm" style={{ borderRadius: '50%', background: t.gradient, fontSize: 13, flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 1 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.role}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-4)' }}>{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 72, alignItems: 'start' }}>
            {/* Left sticky label */}
            <div style={{ position: 'sticky', top: 100 }}>
              <div className="section-label section-label-blue" style={{ marginBottom: 20 }}>FAQs</div>
              <h2 className="h1" style={{ marginBottom: 16 }}>
                Everything You <span className="text-gradient">Need to Know</span>
              </h2>
              <p style={{ color: 'var(--text-3)', fontSize: 15, lineHeight: 1.75, marginBottom: 32 }}>
                Got a question that's not answered here? We're just a message away.
              </p>
              <a href="mailto:hello@mentorrise.in" className="btn btn-outline btn-pill" style={{ gap: 8 }}>
                <FiMail size={14} /> Ask Us Directly
              </a>
            </div>

            {/* Right accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FAQS.map((faq, i) => <FaqItem key={i} faq={faq} index={i} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: 'var(--navy)', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 30% 50%,rgba(37,99,235,.15),transparent 60%),radial-gradient(circle at 70% 50%,rgba(136,19,55,.12),transparent 60%)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="section-label section-label-dark" style={{ margin: '0 auto 24px' }}><FiZap size={12} /> Limited Spots Available</div>
          <h2 className="display-2" style={{ color: '#fff', marginBottom: 16, maxWidth: 700, margin: '0 auto 16px' }}>
            Unlock Your Potential.<br />
            <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pave Your Way to Success.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 17, marginBottom: 40, maxWidth: 480, margin: '16px auto 40px' }}>
            Join hundreds of professionals who've charted their path with Mentor Rise.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-gold btn-xl btn-pill">Get Started Free <FiArrowRight /></Link>
            <Link to="/mentors" className="btn btn-glass btn-xl btn-pill">Meet the Mentors</Link>
          </div>

          {/* Admin access bottom */}
          {!user && (
            <button onClick={() => setAdminModal(true)}
              style={{ marginTop: 48, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 100, cursor: 'pointer', color: 'rgba(255,255,255,.35)', fontSize: 12, transition: 'all .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.35)'}>
              <FiShield size={12} /> Admin Portal Access
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
