const bcrypt = require('bcryptjs');
const { User, MentorProfile, Advisor, Cofounder, Faq, Testimonial, SiteConfig } = require('./models');

const seedUser = async (data) => {
  const exists = await User.findOne({ where: { email: data.email } });
  if (!exists) {
    const hashed = await bcrypt.hash(data.password, 12);
    const user = await User.create({ ...data, password: hashed, isEmailVerified: true, isActive: true, isApproved: true });
    if (data.role === 'mentor') await MentorProfile.create({ userId: user.id });
    console.log(`Seeded [${data.role}]: ${data.email}`);
  }
};

const seedAdvisors = async () => {
  const count = await Advisor.count();
  if (count > 0) return;

  await Advisor.bulkCreate([
    {
      name: 'Advisor Name',
      initials: 'AN',
      role: 'Senior Industry Leader',
      company: 'Organisation Name',
      location: 'City, India',
      bio: 'Experienced professional with decades of cross-industry expertise. Add real details by editing this record in Admin → Manage Advisors.',
      tags: ['Leadership', 'Strategy', 'Coaching'],
      followers: '10K',
      gradient: 'linear-gradient(135deg,#C9920B,#F59E0B)',
      linkedinUrl: '#',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Advisor Name',
      initials: 'AD',
      role: 'Industry Expert',
      company: 'Organisation Name',
      location: 'City, India',
      bio: 'Veteran leader with extensive experience in business strategy and talent development. Update this via Admin → Manage Advisors.',
      tags: ['Business', 'Finance', 'Digital'],
      followers: '5K',
      gradient: 'linear-gradient(135deg,#2563EB,#1E3A8A)',
      linkedinUrl: '#',
      isActive: true,
      sortOrder: 2,
    },
  ]);
  console.log('Seeded placeholder advisors');
};

const seedCofounders = async () => {
  const count = await Cofounder.count();
  if (count > 0) return;

  await Cofounder.bulkCreate([
    {
      name: 'Co-Founder Name',
      initials: 'CF',
      role: 'Co-Founder & CEO',
      bio: 'Visionary leader committed to bridging the gap between ambition and achievement. Update this via Admin → Manage Cofounders.',
      linkedinUrl: '#',
      gradient: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Co-Founder Name',
      initials: 'CF',
      role: 'Co-Founder & COO',
      bio: 'Operational expert passionate about building world-class mentorship experiences. Update this via Admin → Manage Cofounders.',
      linkedinUrl: '#',
      gradient: 'linear-gradient(135deg,#881337,#5C0D26)',
      isActive: true,
      sortOrder: 2,
    },
  ]);
  console.log('Seeded placeholder cofounders');
};

const seedFaqs = async () => {
  const count = await Faq.count();
  if (count > 0) return;

  await Faq.bulkCreate([
    { question: 'What is MentorRise?', answer: 'MentorRise is a structured mentorship programme connecting aspiring professionals with senior industry leaders for personalised guidance and career growth.', isActive: true, sortOrder: 1 },
    { question: 'Who can participate as a mentee?', answer: 'Any working professional, fresh graduate, or student looking for career guidance, skill development, or professional mentorship can participate.', isActive: true, sortOrder: 2 },
    { question: 'How long is the programme?', answer: 'The programme consists of 3 structured mentoring sessions, preceded by a complimentary 15-minute introductory session to ensure the right fit.', isActive: true, sortOrder: 3 },
    { question: 'Is there a cost to join?', answer: 'The introductory session is completely free. Programme fees, if any, will be communicated upon confirmation of your mentor match.', isActive: true, sortOrder: 4 },
    { question: 'How are mentors selected?', answer: 'Mentors are senior industry professionals vetted by our team for their expertise, communication skills, and commitment to mentorship. Each mentor goes through a thorough review process.', isActive: true, sortOrder: 5 },
    { question: 'What happens after I apply?', answer: 'You will receive a confirmation, and our team will match you with a suitable mentor based on your goals and background. You will then be invited to schedule your complimentary introductory session.', isActive: true, sortOrder: 6 },
    { question: 'Will I receive a certificate?', answer: 'Yes, all mentees who successfully complete the programme receive a Certificate of Completion recognising their participation and growth.', isActive: true, sortOrder: 7 },
    { question: 'Can I choose my mentor?', answer: 'You can browse our mentor directory and express a preference. However, the final matching is done by our team to ensure the best fit for your goals and personality.', isActive: true, sortOrder: 8 },
  ]);
  console.log('Seeded default FAQs');
};

const seedTestimonials = async () => {
  const count = await Testimonial.count();
  if (count > 0) return;

  await Testimonial.bulkCreate([
    {
      name: 'Mentee Name',
      role: 'Software Engineer',
      company: 'Tech Company',
      quote: 'This mentorship programme completely transformed my career trajectory. My mentor helped me navigate a critical transition and provided clarity I had been missing for years.',
      rating: 5,
      initials: 'MN',
      gradient: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
      tag: 'Career Growth',
      isActive: true,
      sortOrder: 1,
      submittedByUserId: null,
    },
    {
      name: 'Mentee Name',
      role: 'Marketing Manager',
      company: 'Startup',
      quote: 'The structured sessions gave me clarity and confidence to make bold career moves. I genuinely feel like I have a roadmap now. Highly recommend MentorRise to anyone at a crossroads.',
      rating: 5,
      initials: 'MN',
      gradient: 'linear-gradient(135deg,#881337,#5C0D26)',
      tag: 'Professional Development',
      isActive: true,
      sortOrder: 2,
    },
    {
      name: 'Mentee Name',
      role: 'Product Manager',
      company: 'Enterprise Firm',
      quote: 'My mentor shared real-world insights that no textbook could ever teach. The programme is well-structured, the mentors are genuinely invested, and the experience was invaluable.',
      rating: 5,
      initials: 'MN',
      gradient: 'linear-gradient(135deg,#065F46,#047857)',
      tag: 'Leadership',
      isActive: true,
      sortOrder: 3,
    },
  ]);
  console.log('Seeded placeholder testimonials');
};

const seedSiteConfig = async () => {
  const configs = [
    { key: 'mentee_form_url', value: '', label: 'Mentee Application Form URL', description: 'Google Form link for mentees to apply for the programme' },
    { key: 'mentor_form_url', value: '', label: 'Mentor Application Form URL', description: 'Google Form link for mentors to apply to join as a mentor' },
    { key: 'intro_session_form_url', value: '', label: 'Introductory Session Request URL', description: 'Google Form link for requesting a complimentary introductory session' },
  ];
  for (const cfg of configs) {
    await SiteConfig.findOrCreate({ where: { key: cfg.key }, defaults: cfg });
  }
  console.log('Seeded site config defaults');
};

const seedAll = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mentorrise.in';
  await seedUser({ email: adminEmail, password: process.env.ADMIN_PASSWORD || 'Admin@123', firstName: 'Admin', lastName: 'MentorRise', role: 'admin' });
  await seedUser({ email: 'demo.admin@mentorrise.in', password: 'Demo@1234', firstName: 'Demo', lastName: 'Admin', role: 'admin' });
  await seedUser({ email: 'mentor@demo.com', password: 'Demo@1234', firstName: 'Arjun', lastName: 'Sharma', role: 'mentor' });
  await seedUser({ email: 'mentee@demo.com', password: 'Demo@1234', firstName: 'Priya', lastName: 'Kapoor', role: 'mentee' });

  // Always ensure demo mentor is approved and visible (model defaults to false)
  const demoMentor = await User.findOne({ where: { email: 'mentor@demo.com' } });
  if (demoMentor) {
    await MentorProfile.update(
      {
        isApproved: true,
        isVisible: true,
        title: 'Senior Software Engineer',
        company: 'MentorRise Demo',
        bio: 'Demo mentor account for testing the platform. Available to guide mentees on technology, career growth, and leadership.',
        expertise: ['Technology', 'Career Growth', 'Leadership'],
      },
      { where: { userId: demoMentor.id } }
    );
  }

  await seedAdvisors();
  await seedCofounders();
  await seedFaqs();
  await seedTestimonials();
  await seedSiteConfig();
};

module.exports = { seedAll };
