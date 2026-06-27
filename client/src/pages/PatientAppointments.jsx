import React, { useState, useEffect } from 'react';
import appointmentService from '../services/appointmentService';
import { Calendar, Clock, MapPin, Video, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getPatientAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Completed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Appointments</h1>

      {loading ? (
        <div className="text-center py-20">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-card border rounded-xl p-10 text-center text-muted-foreground">
          You have no upcoming or past appointments.
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map(appt => (
            <div key={appt._id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{appt.doctorId?.userId?.name || 'Doctor Not Found'}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> 
                    {new Date(appt.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {appt.timeSlot}
                  </div>
                  <div className="flex items-center gap-2">
                    {appt.consultationType === 'Online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                    {appt.consultationType} Consultation
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4" /> Reason: {appt.reason}
                  </div>
                </div>
              </div>

              {appt.status === 'Confirmed' && appt.consultationType === 'Online' && (
                <button className="w-full md:w-auto bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Join Video Call
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
