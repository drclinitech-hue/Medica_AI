import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import DetectionWizard from './pages/DetectionWizard';
import DetectionHistory from './pages/DetectionHistory';
import FindDoctors from './pages/FindDoctors';
import DoctorProfile from './pages/DoctorProfile';
import PatientAppointments from './pages/PatientAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import FloatingChatbot from './components/chat/FloatingChatbot';
import AdminLayout from './layouts/admin/AdminLayout';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DoctorManagement from './pages/admin/DoctorManagement';
import PatientManagement from './pages/admin/PatientManagement';
import DiseaseManagement from './pages/admin/DiseaseManagement';
import MLModelManagement from './pages/admin/MLModelManagement';
import ReportManagement from './pages/admin/ReportManagement';
import SystemSettings from './pages/admin/SystemSettings';
import DoctorLayout from './layouts/doctor/DoctorLayout';
import Placeholder from './pages/admin/Placeholder';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Routes>
            {/* Admin Routes (No Navbar/Footer) */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin', 'moderator']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="doctors" element={<DoctorManagement />} />
              <Route path="patients" element={<PatientManagement />} />
              <Route path="diseases" element={<DiseaseManagement />} />
              <Route path="ml-model" element={<MLModelManagement />} />
              <Route path="reports" element={<ReportManagement />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="*" element={<Placeholder title="Unknown" />} />
            </Route>

            {/* Doctor Routes (No Navbar/Footer) */}
            <Route path="/doctor" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DoctorDashboard />} />
              <Route path="appointments" element={<Placeholder title="Doctor Appointments" />} />
              <Route path="profile" element={<Placeholder title="Doctor Profile" />} />
              <Route path="settings" element={<Placeholder title="Doctor Settings" />} />
              <Route path="*" element={<Placeholder title="Unknown" />} />
            </Route>

            {/* Main Application Routes (With Navbar/Footer) */}
            <Route path="*" element={
              <>
                <Navbar />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/detect" element={
                      <ProtectedRoute>
                        <DetectionWizard />
                      </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                      <ProtectedRoute>
                        <DetectionHistory />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/doctors" element={<FindDoctors />} />
                    <Route path="/doctors/:id" element={<DoctorProfile />} />
                    <Route path="/appointments" element={
                      <ProtectedRoute>
                        <PatientAppointments />
                      </ProtectedRoute>
                    } />
                    {/* Redirect unknown routes to guest landing page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <FloatingChatbot />
                <Toaster position="top-right" />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
