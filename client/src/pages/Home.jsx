import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import {
  FiArrowRight, FiCheck, FiStar, FiBriefcase,
  FiChevronDown, FiChevronUp, FiMail,
  FiTarget, FiTrendingUp, FiShield, FiHeart, FiBookOpen, FiThumbsUp, FiUsers, FiAward, FiLinkedin
} from 'react-icons/fi'

/* ── open URL or fallback to email ── */
const openLink = (url) => {
  if (url) window.open(url, '_blank', 'noopener')
  else window.location.href = 'mailto:hello@mentorrise.in'
}

/* ── Static content ────────────────────────────────────────────── */
const WHY_ITEMS = [
  { icon: <FiTrendingUp />, title: 'Real-World Experience', desc: 'Learn from industry leaders with decades of hands-on expertise across diverse sectors.' },
  { icon: <FiUsers />, title: 'Professional Networking', desc: 'Build lasting connections with top professionals who open doors across industries.' },
  { icon: <FiTarget />, title: 'Personalised Growth Plan', desc: 'Develop a customised career roadmap tailored to your unique goals and aspirations.' },
  { icon: <FiBookOpen />, title: 'Structured Sessions', desc: 'Gain clarity through focused, goal-oriented mentoring sessions with clear outcomes.' },
  { icon: <FiShield />, title: 'Diverse Expertise', desc: 'Access mentors from varied industries, roles, and professional backgrounds.' },
  { icon: <FiThumbsUp />, title: 'Constructive Feedback', desc: 'Receive honest, actionable insights to accelerate your professional growth.' },
  { icon: <FiAward />, title: 'Certificate of Completion', desc: 'Earn formal recognition upon successfully completing the full mentorship programme.' },
]

const STEPS = [
  { n: '01', title: 'Request', desc: 'Submit your interest through our application form to join the programme.' },
  { n: '02', title: 'Review', desc: 'Our team reviews your application and matches you with a suitable mentor based on your goals.' },
  { n: '03', title: 'Introductory Session', desc: 'Enjoy a complimentary 15-minute intro call with your matched mentor before committing.' },
  { n: '04', title: 'Confirm', desc: 'Confirm your mentor match and schedule your first official mentoring session.' },
  { n: '05', title: '3 Mentoring Sessions', desc: 'Participate in three structured, goal-oriented mentoring sessions with your mentor.' },
  { n: '06', title: 'Certificate', desc: 'Receive your Certificate of Completion upon finishing the programme.' },
  { n: '07', title: 'Feedback', desc: 'Share your experience and insights to help us continuously improve.' },
]

const OBJECTIVES = [
  'Connect mentees with experienced professionals in their field',
  'Provide structured, goal-oriented mentoring sessions',
  'Help mentees develop clear and actionable career plans',
  'Foster professional growth and skill development',
  'Build a strong, impactful mentorship community',
]
const TAKEAWAYS = [
  'Industry-specific insights and career guidance',
  'Personalised roadmap for professional development',
  'Certificate of completion and programme recognition',
  'Access to a network of industry leaders and peers',
  'Confidence and clarity to make impactful career moves',
]
const MENTEE_DOS = [
  'Come prepared with questions and clear goals for each session',
  'Be open to feedback and new perspectives',
  'Respect your mentor\'s time and be punctual',
  'Follow through on agreed actions between sessions',
]
const MENTEE_DONTS = [
  'Expect your mentor to do the work for you',
  'Be passive — actively engage in every session',
  'Miss sessions without prior notice',
  'Limit conversations only to surface-level topics',
]
const MENTOR_DOS = [
  'Be punctual and well-prepared for every session',
  'Provide honest, constructive, and actionable feedback',
  'Share real-world experiences and practical insights',
  'Encourage, motivate, and challenge your mentee',
  'Maintain confidentiality and professional boundaries',
]
const MENTOR_DONTS = [
  'Make promises you are not able to keep',
  'Dismiss or belittle your mentee\'s ideas',
  'Cancel sessions without sufficient prior notice',
  'Share the mentee\'s personal information with others',
]

/* ── Sub-components ──────────────────────────────────────────── */
function FaqItem({ faq }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', lineHeight: 1.4 }}>{faq.question}</span>
        {open ? <FiChevronUp size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} /> : <FiChevronDown size={18} style={{ color: 'var(--text-3)', flexShrink: 0 }} />}
      </button>
      {open && <div style={{ padding: '0 20px 18px', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8 }}>{faq.answer}</div>}
    </div>
  )
}

const SectionHeading = ({ tag, title, subtitle, light }) => (
  <div style={{ textAlign: 'center', marginBottom: 48 }}>
    {tag && <span style={{ display: 'inline-block', background: light ? 'rgba(255,255,255,.15)' : 'var(--primary-xl)', color: light ? '#fff' : 'var(--primary)', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 12 }}>{tag}</span>}
    <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: light ? '#fff' : 'var(--text)', lineHeight: 1.25, letterSpacing: '-.02em', marginBottom: subtitle ? 14 : 0 }}>{title}</h2>
    {subtitle && <p style={{ fontSize: 16, color: light ? 'rgba(255,255,255,.75)' : 'var(--text-2)', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>{subtitle}</p>}
  </div>
)

function MentorPreviewCard({ mentor }) {
  const { user, title, company, expertise, rating, photoUrl } = mentor
  const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`
  const [imgErr, setImgErr] = useState(false)
  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', transition: 'all .25s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--sh-xl)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
      <div style={{ height: 5, background: 'linear-gradient(90deg,var(--primary),var(--maroon))' }} />
      <div style={{ padding: '20px 20px 0', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {photoUrl && !imgErr
          ? <img src={photoUrl} alt={name} onError={() => setImgErr(true)} style={{ width: 60, height: 60, minWidth: 60, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          : <div style={{ width: 60, height: 60, minWidth: 60, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--maroon))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>{initials}</div>}
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</h3>
          {title && <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>}
          {company && <p style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}><FiBriefcase size={10} /> {company}</p>}
        </div>
      </div>
      <div style={{ padding: '12px 20px', flex: 1 }}>
        {expertise?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {expertise.slice(0, 3).map(e => <span key={e} className="chip" style={{ fontSize: 11 }}>{e}</span>)}
            {expertise.length > 3 && <span className="chip chip-gray" style={{ fontSize: 11 }}>+{expertise.length - 3}</span>}
          </div>
        )}
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <FiStar size={11} style={{ color: '#F59E0B' }} /> {rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
        <Link to={`/mentors/${user?.id}`} className="btn btn-primary btn-sm btn-pill" style={{ fontSize: 12, padding: '6px 14px', gap: 5 }}>
          Book <FiArrowRight size={11} />
        </Link>
      </div>
    </div>
  )
}

function PersonCard({ person }) {
  const [imgErr, setImgErr] = useState(false)
  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border)', padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', transition: 'all .25s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--sh-xl)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
      {person.photoUrl && !imgErr
        ? <img src={person.photoUrl} alt={person.name} onError={() => setImgErr(true)} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }} />
        : <div style={{ width: 80, height: 80, borderRadius: '50%', background: person.gradient || 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 26, marginBottom: 16 }}>{person.initials}</div>}
      <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{person.name}</h3>
      <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginBottom: 6 }}>{person.role}</p>
      {person.company && <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>{person.company}</p>}
      {person.location && <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>{person.location}</p>}
      {person.bio && <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{person.bio}</p>}
      {person.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginBottom: 14 }}>
          {person.tags.slice(0, 3).map(t => <span key={t} className="chip" style={{ fontSize: 11 }}>{t}</span>)}
        </div>
      )}
      {person.linkedinUrl && person.linkedinUrl !== '#' && (
        <a href={person.linkedinUrl} target="_blank" rel="noreferrer" style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: 13, fontWeight: 600 }}>
          <FiLinkedin size={14} /> Connect
        </a>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [mentors, setMentors] = useState([])
  const [advisors, setAdvisors] = useState([])
  const [cofounders, setCofounders] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [faqs, setFaqs] = useState([])
  const [siteConfig, setSiteConfig] = useState({})
  const [activeTab, setActiveTab] = useState('mentee')

  useEffect(() => {
    api.get('/mentors').then(r => setMentors(r.data.slice(0, 6))).catch(() => {})
    api.get('/advisors').then(r => setAdvisors(r.data)).catch(() => {})
    api.get('/cofounders').then(r => setCofounders(r.data)).catch(() => {})
    api.get('/testimonials').then(r => setTestimonials(r.data)).catch(() => {})
    api.get('/faqs').then(r => setFaqs(r.data)).catch(() => {})
    api.get('/site-config').then(r => setSiteConfig(r.data)).catch(() => {})
  }, [])

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg,#020817 0%,#0F1F3D 45%,#1A0A1A 75%,#2D0516 100%)', color: '#fff', padding: 'clamp(72px,10vw,120px) 0 clamp(80px,12vw,140px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(37,99,235,.25),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(136,19,55,.2),transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 100, padding: '6px 16px', marginBottom: 28, backdropFilter: 'blur(8px)' }}>
            <FiStar size={12} style={{ color: '#F59E0B' }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', fontWeight: 500 }}>Structured · Personalised · Certified</span>
          </div>
          <h1 style={{ fontSize: 'clamp(30px,6vw,60px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-.03em', marginBottom: 20, maxWidth: 820, margin: '0 auto 20px' }}>
            Learn from Interaction with<br />
            <span style={{ background: 'linear-gradient(90deg,#60A5FA,#C084FC,#FB7185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Senior Industry Leaders
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2vw,19px)', color: 'rgba(255,255,255,.72)', maxWidth: 620, margin: '0 auto 36px', lineHeight: 1.75 }}>
            A structured mentorship programme designed to help you grow personally and professionally through expert guidance.
          </p>
          {/* Checklist */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 24px', justifyContent: 'center', marginBottom: 44 }}>
            {['Complimentary 15-min introductory session', 'Personalised growth roadmap', '3 structured mentoring sessions', 'Certificate of completion', 'Post-programme feedback'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,.82)' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(74,222,128,.2)', border: '1px solid rgba(74,222,128,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiCheck size={11} style={{ color: '#4ADE80' }} />
                </div>
                {item}
              </div>
            ))}
          </div>
          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link to="/mentors" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--grad-brand)', color: '#fff', padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 24px rgba(37,99,235,.4)' }}>
              Find a Mentor <FiArrowRight size={16} />
            </Link>
            <button onClick={() => openLink(siteConfig.intro_session_form_url)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', color: '#fff', padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15, border: '1.5px solid rgba(255,255,255,.2)', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
              <FiBookOpen size={16} /> Request Introductory Session
            </button>
            <button onClick={() => openLink(siteConfig.mentor_form_url)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'rgba(255,255,255,.8)', padding: '14px 28px', borderRadius: 12, fontWeight: 600, fontSize: 15, border: '1.5px solid rgba(255,255,255,.12)', cursor: 'pointer' }}>
              Become a Mentor
            </button>
          </div>
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--primary)', padding: '20px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, justifyContent: 'center', alignItems: 'center' }}>
            {[['20+', 'Industry Mentors'], ['100+', 'Mentees Enrolled'], ['95%', 'Satisfaction Rate'], ['Free', '15-min Intro Session']].map(([val, label], i, arr) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 24px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,.2)' : 'none' }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-.02em' }}>{val}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,.8)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE ═══════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(64px,8vw,100px) 0', background: 'var(--bg)' }}>
        <div className="container">
          <SectionHeading tag="Our Advantage" title="Why Choose Our Mentorship Programme?" subtitle="We bring together the right mentors, structure, and support to help you grow at every stage of your career." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {WHY_ITEMS.map(item => (
              <div key={item.title} style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: '24px 20px', display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--sh-md)'; e.currentTarget.style.borderColor = 'rgba(37,99,235,.2)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: 'clamp(64px,8vw,100px) 0', background: 'linear-gradient(135deg,#0F1F3D,#1E0A2E)' }}>
        <div className="container">
          <SectionHeading tag="The Journey" title="How It Works" subtitle="A clear 7-step process designed to maximise your mentorship experience." light />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
            {STEPS.map(step => (
              <div key={step.n} style={{ background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: '28px 24px', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.35)', letterSpacing: '.1em', marginBottom: 12 }}>STEP {step.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <button onClick={() => openLink(siteConfig.mentee_form_url)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: 'var(--primary)', padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}>
              Apply Now <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══ ABOUT THE PROGRAMME ══════════════════════════════════════ */}
      <section id="about" style={{ padding: 'clamp(64px,8vw,100px) 0', background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 56, alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', background: 'var(--primary-xl)', color: 'var(--primary)', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 16 }}>About the Programme</span>
              <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-.02em', marginBottom: 20 }}>Bridging Ambition with<br /><span style={{ color: 'var(--primary)' }}>Industry Excellence</span></h2>
              <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.85, marginBottom: 20 }}>
                MentorRise is a structured mentorship programme designed to bridge the gap between ambitious professionals and seasoned industry leaders. We believe that meaningful mentorship can transform careers, spark innovation, and build lasting professional relationships.
              </p>
              <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.85, marginBottom: 32 }}>
                Our programme is built on three pillars: the right mentor match, a structured engagement framework, and continuous support, so every mentee gets the most out of every session.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <button onClick={() => openLink(siteConfig.mentee_form_url)} className="btn btn-primary" style={{ gap: 8 }}>Apply as Mentee <FiArrowRight size={14} /></button>
                <button onClick={() => openLink(siteConfig.mentor_form_url)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'var(--primary)', padding: '10px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14, border: '1.5px solid var(--primary)', cursor: 'pointer' }}>
                  Become a Mentor
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[['20+', 'Industry Mentors', 'var(--primary)'], ['100+', 'Mentees', 'var(--maroon)'], ['300+', 'Sessions', '#065F46'], ['95%', 'Success Rate', '#92400E']].map(([val, label, color]) => (
                <div key={label} style={{ background: 'var(--bg)', borderRadius: 16, padding: '24px 20px', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color, letterSpacing: '-.03em', marginBottom: 4 }}>{val}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHY MENTORSHIP ═══════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(64px,8vw,100px) 0', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <SectionHeading tag="Our Belief" title="Why Mentorship?" />
          <div style={{ background: '#fff', borderRadius: 24, border: '1px solid var(--border)', padding: 'clamp(28px,4vw,48px)' }}>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.9, marginBottom: 20 }}>
              Mentorship has been proven to accelerate professional growth by providing guided experience, exposure to real-world challenges, and access to expansive professional networks.
            </p>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.9, marginBottom: 20 }}>
              In today's fast-moving landscape, having someone who has been there, navigated the same crossroads, and learned the hard lessons can be the single biggest advantage in your career.
            </p>
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.9 }}>
              Our programme is designed for those who want to go further, faster, with the right support system. Whether you are a fresh graduate looking for your first direction or a mid-career professional seeking your next breakthrough, MentorRise provides the structure, mentors, and accountability to help you get there.
            </p>
          </div>
        </div>
      </section>

      {/* ══ OBJECTIVES + KEY TAKEAWAYS ═══════════════════════════════ */}
      <section style={{ padding: 'clamp(64px,8vw,100px) 0', background: '#fff' }}>
        <div className="container">
          <SectionHeading tag="Programme Design" title="Objectives & Key Takeaways" subtitle="What we aim to deliver and what you will walk away with." />
          <div className="layout-2col">
            <div style={{ background: 'var(--primary)', borderRadius: 24, padding: '32px 28px' }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Programme Objectives</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {OBJECTIVES.map((obj, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{i + 1}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,.88)', lineHeight: 1.65 }}>{obj}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'linear-gradient(135deg,#1A0A1A,#2D0516)', borderRadius: 24, padding: '32px 28px' }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Key Takeaways</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {TAKEAWAYS.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(251,113,133,.2)', border: '1px solid rgba(251,113,133,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <FiCheck size={11} style={{ color: '#FB7185' }} />
                    </div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,.88)', lineHeight: 1.65 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOR MENTEES + FOR MENTORS (tabbed) ═══════════════════════ */}
      <section id="for-mentees" style={{ padding: 'clamp(64px,8vw,100px) 0', background: 'var(--bg)' }}>
        <div className="container">
          <SectionHeading tag="Who Is This For?" title="For Mentees & Mentors" subtitle="MentorRise is built for ambitious professionals at every stage, and for leaders who want to give back." />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 40, background: 'var(--border)', borderRadius: 12, padding: 4, width: 'fit-content', margin: '0 auto 40px' }}>
            {['mentee', 'mentor'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all .2s', background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? 'var(--primary)' : 'var(--text-3)', boxShadow: activeTab === tab ? 'var(--sh-sm)' : 'none' }}>
                {tab === 'mentee' ? 'For Mentees' : 'For Mentors'}
              </button>
            ))}
          </div>

          {activeTab === 'mentee' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
              <div className="card" style={{ padding: '28px 24px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: 'var(--primary)' }}>Who Can Apply?</h3>
                {['Working professionals seeking career growth and direction', 'Fresh graduates looking for their first career breakthrough', 'Students preparing for industry entry and skill development', 'Anyone seeking personalised guidance from industry experts'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                    <FiCheck size={14} style={{ color: 'var(--success)', marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
                <button onClick={() => openLink(siteConfig.mentee_form_url)} className="btn btn-primary btn-full" style={{ marginTop: 20, gap: 8 }}>Apply as Mentee <FiArrowRight size={14} /></button>
              </div>
              <div className="card" style={{ padding: '28px 24px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: 'var(--primary)' }}>What's in it for You?</h3>
                {['One-on-one guidance from a senior industry expert', 'Complimentary 15-min intro session before committing', 'A structured path to achieve your career goals', 'Certificate and formal recognition of participation', 'Post-programme feedback to guide your next steps'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                    <FiStar size={13} style={{ color: '#F59E0B', marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mentor' && (
            <div id="for-mentors" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
              <div className="card" style={{ padding: '28px 24px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: 'var(--maroon)' }}>Why Become a Mentor?</h3>
                {['Give back to the professional community meaningfully', 'Develop leadership, coaching, and communication skills', 'Expand your professional network and influence', 'Gain recognition as a thought leader in your field'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                    <FiCheck size={14} style={{ color: 'var(--success)', marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
                <button onClick={() => openLink(siteConfig.mentor_form_url)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--maroon)', color: '#fff', padding: '12px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', width: '100%', marginTop: 20 }}>
                  Become a Mentor <FiArrowRight size={14} />
                </button>
              </div>
              <div className="card" style={{ padding: '28px 24px' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: 'var(--maroon)' }}>Additional Opportunities</h3>
                {['Speaking opportunities at programme events', 'Collaboration with other industry leaders', 'Featured recognition on the MentorRise platform', 'Shape the careers of the next generation of leaders', 'Build a legacy of impact through mentorship'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                    <FiStar size={13} style={{ color: '#F59E0B', marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ DO'S & DON'TS ════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(64px,8vw,100px) 0', background: '#fff' }}>
        <div className="container">
          <SectionHeading tag="Guidelines" title="Do's & Don'ts" subtitle="Guidelines to ensure every mentorship session is productive, respectful, and impactful." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {[
              { title: "Mentee Do's", items: MENTEE_DOS, bg: '#F0FDF4', border: 'rgba(5,150,105,.2)', headColor: '#065F46', dotColor: '#059669', textColor: '#047857', icon: '✓' },
              { title: "Mentee Don'ts", items: MENTEE_DONTS, bg: '#FFF5F5', border: 'rgba(220,38,38,.15)', headColor: '#991B1B', dotColor: '#DC2626', textColor: '#B91C1C', icon: '✕' },
              { title: "Mentor Do's", items: MENTOR_DOS, bg: '#EFF6FF', border: 'rgba(37,99,235,.2)', headColor: '#1E3A8A', dotColor: '#2563EB', textColor: '#1D4ED8', icon: '✓' },
              { title: "Mentor Don'ts", items: MENTOR_DONTS, bg: '#FFF1F4', border: 'rgba(136,19,55,.15)', headColor: '#881337', dotColor: '#BE185D', textColor: '#9D174D', icon: '✕' },
            ].map(col => (
              <div key={col.title} style={{ borderRadius: 20, border: `1px solid ${col.border}`, background: col.bg, padding: '28px 24px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: col.headColor, marginBottom: 20 }}>{col.icon} {col.title}</h3>
                {col.items.map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: col.dotColor, marginTop: 7, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: col.textColor, lineHeight: 1.65 }}>{item}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MENTOR PREVIEW ═══════════════════════════════════════════ */}
      {mentors.length > 0 && (
        <section style={{ padding: 'clamp(64px,8vw,100px) 0', background: 'var(--bg)' }}>
          <div className="container">
            <SectionHeading tag="Our Mentors" title="Meet the Leaders Behind MentorRise" subtitle="Connect with experienced professionals ready to guide your next chapter." />
            <div className="mentor-grid" style={{ marginBottom: 36 }}>
              {mentors.map(m => <MentorPreviewCard key={m.userId || m.id} mentor={m} />)}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link to="/mentors" className="btn btn-primary" style={{ gap: 8, fontSize: 15, padding: '12px 28px' }}>View All Mentors <FiArrowRight size={15} /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ══ TESTIMONIALS ═════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section id="testimonials" style={{ padding: 'clamp(64px,8vw,100px) 0', background: '#fff' }}>
          <div className="container">
            <SectionHeading tag="What Mentees Say" title="Stories of Growth & Impact" subtitle="Hear directly from professionals whose careers changed through MentorRise." />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
              {testimonials.map(t => (
                <div key={t.id} style={{ background: 'var(--bg)', borderRadius: 20, border: '1px solid var(--border)', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16, transition: 'all .25s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--sh-md)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: t.rating || 5 }).map((_, i) => <FiStar key={i} size={13} style={{ color: '#F59E0B', fill: '#F59E0B' }} />)}
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.78, fontStyle: 'italic', flex: 1 }}>"{t.quote}"</p>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{t.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.role}{t.company ? ` · ${t.company}` : ''}</p>
                    </div>
                    {t.tag && <span className="chip" style={{ fontSize: 11, flexShrink: 0 }}>{t.tag}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ ADVISORS ════════════════════════════════════════════════ */}
      {advisors.length > 0 && (
        <section style={{ padding: 'clamp(64px,8vw,100px) 0', background: 'var(--bg)' }}>
          <div className="container">
            <SectionHeading tag="Advisory Board" title="Our Expert Advisors" subtitle="Guided by seasoned leaders who bring decades of cross-industry wisdom." />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
              {advisors.map(a => <PersonCard key={a.id} person={a} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══ COFOUNDERS ══════════════════════════════════════════════ */}
      {cofounders.length > 0 && (
        <section style={{ padding: 'clamp(64px,8vw,100px) 0', background: '#fff' }}>
          <div className="container">
            <SectionHeading tag="Our Team" title="The People Behind MentorRise" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
              {cofounders.map(c => (
                <div key={c.id} style={{ width: 260 }}>
                  <PersonCard person={c} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ FAQ ══════════════════════════════════════════════════════ */}
      {faqs.length > 0 && (
        <section id="faq" style={{ padding: 'clamp(64px,8vw,100px) 0', background: 'var(--bg)' }}>
          <div className="container" style={{ maxWidth: 780 }}>
            <SectionHeading tag="FAQ" title="Frequently Asked Questions" subtitle="Everything you need to know before joining MentorRise." />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {faqs.map(faq => <FaqItem key={faq.id} faq={faq} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══ CONTACT / FINAL CTA ══════════════════════════════════════ */}
      <section id="contact" style={{ padding: 'clamp(72px,10vw,120px) 0', background: 'linear-gradient(135deg,#0F1F3D,#1E0A2E,#2D0516)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.8)', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 20 }}>Get in Touch</span>
          <h2 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, color: '#fff', letterSpacing: '-.03em', marginBottom: 16, lineHeight: 1.15 }}>
            Ready to Pave Your<br />
            <span style={{ background: 'linear-gradient(90deg,#60A5FA,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Way to Success?</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,.65)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Join MentorRise today. Start with a free 15-minute introductory session and experience the difference expert mentorship makes.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 36 }}>
            <button onClick={() => openLink(siteConfig.intro_session_form_url)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: 'var(--primary)', padding: '16px 32px', borderRadius: 12, fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}>
              Request Introductory Session <FiArrowRight size={18} />
            </button>
            <button onClick={() => openLink(siteConfig.mentor_form_url)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.1)', color: '#fff', padding: '16px 32px', borderRadius: 12, fontWeight: 700, fontSize: 16, border: '1.5px solid rgba(255,255,255,.2)', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
              Become a Mentor
            </button>
          </div>
          <a href="mailto:hello@mentorrise.in" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.5)', fontSize: 15, fontWeight: 500, textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}>
            <FiMail size={16} /> hello@mentorrise.in
          </a>
        </div>
      </section>
    </div>
  )
}
