const bcrypt = require('bcryptjs');
const { User, MentorProfile, Advisor } = require('./models');

const seedUser = async (data) => {
  const exists = await User.findOne({ where: { email: data.email } });
  if (!exists) {
    const hashed = await bcrypt.hash(data.password, 12);
    const user = await User.create({ ...data, password: hashed, isEmailVerified: true, isActive: true });
    if (data.role === 'mentor') await MentorProfile.create({ userId: user.id });
    console.log(`Seeded [${data.role}]: ${data.email}`);
  }
};

const seedAdvisors = async () => {
  const count = await Advisor.count();
  if (count > 0) return;

  await Advisor.bulkCreate([
    {
      name: 'Alok Narain',
      initials: 'AN',
      role: 'Leadership Coach & Trainer',
      company: 'Enneagram & Emotional Intelligence Practitioner',
      location: 'New Delhi, India',
      bio: 'Certified Lumina Spark & Enneagram practitioner with 23K+ followers. Renowned for deep people skills, empathy-driven coaching, and building future-ready leaders.',
      tags: ['Leadership', 'EI', 'Coaching'],
      followers: '23K',
      gradient: 'linear-gradient(135deg,#C9920B,#F59E0B)',
      linkedinUrl: 'https://www.linkedin.com/in/alok-narain-8277371',
      isActive: true,
      sortOrder: 1,
    },
    {
      name: 'Chandrashekar Shetty',
      initials: 'CS',
      role: 'Senior Leader, BFSI',
      company: 'Aditya Birla Sun Life Insurance',
      location: 'Mumbai, India',
      bio: '19+ years of leadership across Multinational Telecom & BFSI. IIM Kozhikode alumnus. Passionate about digital strategy, career development, and leadership excellence.',
      tags: ['BFSI', 'Strategy', 'Digital'],
      followers: '8K',
      gradient: 'linear-gradient(135deg,#2563EB,#1E3A8A)',
      linkedinUrl: 'https://www.linkedin.com/in/chshetty',
      isActive: true,
      sortOrder: 2,
    },
  ]);
  console.log('Seeded initial advisors');
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
};

module.exports = { seedAll };
