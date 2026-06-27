import React, { useState, useEffect } from 'react';
import appointmentService from '../services/appointmentService';
import doctorService from '../services/doctorService';
import toast from 'react-hot-toast';
import { Calendar, Clock, Video, MapPin, Check, X, Star, Wallet, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [apptData, profileData] = await Promise.all([
        appointmentService.getDoctorAppointments(),
        doctorService.getMyDoctorProfile()
      ]);
      setAppointments(apptData);
      setProfile(profileData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentService.updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status.toLowerCase()}`);
      fetchDashboardData(); // refresh
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;
  if (!profile) return <div className="text-center py-20">Doctor profile not found. Please contact admin.</div>;

  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const todayCount = appointments.filter(a => a.status === 'Confirmed' && new Date(a.date).toDateString() === new Date().toDateString()).length;

  return (
    <div className="container py-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-8 mt-4">
      
      {/* Sidebar */}
      <aside className="w-full md:w-1/3 lg:w-1/4 space-y-6">
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 absolute top-0 left-0 right-0"></div>
          <div className="p-6 pt-12 relative z-10 text-center">
            <div className="relative inline-block mb-4">
              <img src={profile.profilePhoto} alt={user.name} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-background shadow-md" />
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" title="Online"></div>
            </div>
            <h2 className="text-xl font-extrabold">{user.name}</h2>
            <p className="text-primary font-semibold text-sm mb-4">{profile.specialization}</p>
            
            <div className="mt-2 flex flex-col gap-3 text-sm text-left bg-muted/30 p-4 rounded-xl border border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Activity className="w-4 h-4"/> PMDC</span>
                <span className="font-semibold text-foreground">{profile.pmdcNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/> Rating</span>
                <span className="font-semibold text-foreground">{profile.rating} / 5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Wallet className="w-4 h-4"/> Fee</span>
                <span className="font-semibold text-green-600">Rs. {profile.consultationFee}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="text-4xl font-black text-primary mb-1">{pendingCount}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pending</p>
          </div>
          <div className="bg-secondary/5 border border-secondary/20 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
            <p className="text-4xl font-black text-secondary mb-1">{todayCount}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Today</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="w-full md:w-3/4">
        <h1 className="text-3xl font-bold mb-6">Appointments</h1>
        
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-muted-foreground bg-card border rounded-xl p-8 text-center">No appointments found.</p>
          ) : appointments.map(appt => (
            <div key={appt._id} className="bg-card border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{appt.patientId?.name || 'Unknown Patient'}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    appt.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                    appt.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {appt.status}
                  </span>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date(appt.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4"/> {appt.timeSlot}</span>
                  <span className="flex items-center gap-2">
                    {appt.consultationType === 'Online' ? <Video className="w-4 h-4"/> : <MapPin className="w-4 h-4"/>} 
                    {appt.consultationType}
                  </span>
                </div>
                <p className="text-sm mt-3 pt-3 border-t"><strong>Reason:</strong> {appt.reason}</p>
              </div>

              {appt.status === 'Pending' && (
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button onClick={() => handleStatusUpdate(appt._id, 'Confirmed')} className="p-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-lg flex items-center justify-center transition-colors" title="Accept">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleStatusUpdate(appt._id, 'Cancelled')} className="p-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors" title="Reject">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
