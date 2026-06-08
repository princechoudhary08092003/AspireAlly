import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmailSent from './pages/VerifyEmailSent'
import VerifyEmail from './pages/VerifyEmail'
import Mentors from './pages/Mentors'
import MentorProfile from './pages/MentorProfile'
import Pricing from './pages/Pricing'

// Mentee
import MenteeDashboard from './pages/mentee/Dashboard'

// Mentor
import MentorDashboard from './pages/mentor/Dashboard'
import MentorEditProfile from './pages/mentor/EditProfile'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import ManageMentors from './pages/admin/ManageMentors'
import EditMentor from './pages/admin/EditMentor'
import ManageMentees from './pages/admin/ManageMentees'
import ManageBookings from './pages/admin/ManageBookings'
import AdminSubscriptions from './pages/admin/Subscriptions'
import ManageAdvisors from './pages/admin/ManageAdvisors'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

const WithNav = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
)

const NoNav = ({ children }) => <>{children}</>

const MaybeGoogleProvider = ({ children }) =>
  GOOGLE_CLIENT_ID
    ? <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>
    : <>{children}</>

export default function App() {
  return (
    <MaybeGoogleProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Poppins, sans-serif', fontSize: 14 } }} />
          <Routes>
            {/* Public with nav */}
            <Route path="/" element={<WithNav><Home /></WithNav>} />
            <Route path="/mentors" element={<WithNav><Mentors /></WithNav>} />
            <Route path="/mentors/:id" element={<WithNav><MentorProfile /></WithNav>} />
            <Route path="/pricing" element={<WithNav><Pricing /></WithNav>} />

            {/* Auth — no nav/footer */}
            <Route path="/login" element={<NoNav><Login /></NoNav>} />
            <Route path="/register" element={<NoNav><Register /></NoNav>} />
            <Route path="/verify-email-sent" element={<NoNav><VerifyEmailSent /></NoNav>} />
            <Route path="/verify-email" element={<NoNav><VerifyEmail /></NoNav>} />

            {/* Mentee dashboard */}
            <Route path="/mentee/dashboard" element={
              <ProtectedRoute roles={['mentee']}>
                <WithNav><MenteeDashboard /></WithNav>
              </ProtectedRoute>
            } />

            {/* Mentor dashboard */}
            <Route path="/mentor/dashboard" element={
              <ProtectedRoute roles={['mentor']}>
                <WithNav><MentorDashboard /></WithNav>
              </ProtectedRoute>
            } />
            <Route path="/mentor/profile" element={
              <ProtectedRoute roles={['mentor']}>
                <WithNav><MentorEditProfile /></WithNav>
              </ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><WithNav><AdminDashboard /></WithNav></ProtectedRoute>} />
            <Route path="/admin/mentors" element={<ProtectedRoute roles={['admin']}><WithNav><ManageMentors /></WithNav></ProtectedRoute>} />
            <Route path="/admin/mentors/:id/edit" element={<ProtectedRoute roles={['admin']}><WithNav><EditMentor /></WithNav></ProtectedRoute>} />
            <Route path="/admin/mentees" element={<ProtectedRoute roles={['admin']}><WithNav><ManageMentees /></WithNav></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><WithNav><ManageBookings /></WithNav></ProtectedRoute>} />
            <Route path="/admin/subscriptions" element={<ProtectedRoute roles={['admin']}><WithNav><AdminSubscriptions /></WithNav></ProtectedRoute>} />
            <Route path="/admin/advisors" element={<ProtectedRoute roles={['admin']}><WithNav><ManageAdvisors /></WithNav></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </MaybeGoogleProvider>
  )
}
