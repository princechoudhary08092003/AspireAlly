const bcrypt = require('bcryptjs');
const { User, MentorProfile, Advisor, Cofounder } = require('./models');

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
};

module.exports = { seedAll };
