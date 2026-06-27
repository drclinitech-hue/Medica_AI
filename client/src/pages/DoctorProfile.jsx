import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import doctorService from '../services/doctorService';
import appointmentService from '../services/appointmentService';
import toast from 'react-hot-toast';
import { MapPin, Star, ShieldCheck, GraduationCap, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [consultType, setConsultType] = useState('Online');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const data = await doctorService.getDoctorById(id);
      setDoctor(data.doctor);
      setReviews(data.reviews);
    } catch (error) {
      toast.error('Failed to load doctor profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTime || !reason) {
      toast.error('Please fill all booking fields');
      return;
    }

    setBooking(true);
    try {
      await appointmentService.bookAppointment({
        doctorId: doctor._id,
        date: selectedDate,
        timeSlot: selectedTime,
        reason,
        consultationType: consultType
      });
      toast.success('Appointment booked successfully! Wait for confirmation.');
      setSelectedDate('');
      setSelectedTime('');
      setReason('');
      navigate('/appointments'); // redirect to patient appointments
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error booking appointment');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (!doctor) return <div className="text-center py-20">Doctor not found.</div>;

  return (
    <div className="container py-10 pt-24 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Profile Info */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col sm:flex-row gap-8">
            <img 
              src={doctor.profilePhoto} 
              alt={doctor.userId.name} 
              className="w-40 h-40 rounded-full object-cover shadow-lg mx-auto sm:mx-0"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <h1 className="text-3xl font-bold">{doctor.userId.name}</h1>
                {doctor.isVerified && <CheckCircle className="text-blue-500 w-6 h-6" />}
              </div>
              <p className="text-xl text-primary font-medium mb-4">{doctor.specialization}</p>
              
              <p className="text-muted-foreground mb-6">{doctor.bio}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-muted-foreground w-4 h-4" />
                  <span>{doctor.experience} Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 w-4 h-4" />
                  <span>{doctor.rating} ({doctor.reviewsCount} Reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-muted-foreground w-4 h-4" />
                  <span>PMDC: {doctor.pmdcNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground w-4 h-4" />
                  <span>{doctor.hospitals[0]?.name}, {doctor.hospitals[0]?.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-card border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Patient Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">{review.patientId.name}</p>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm text-foreground">{review.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Booking Widget */}
        <div className="lg:w-1/3">
          <div className="bg-card border rounded-2xl p-6 shadow-lg sticky top-24">
            <h2 className="text-xl font-bold mb-2">Book Appointment</h2>
            <p className="text-muted-foreground text-sm mb-6">Consultation Fee: <span className="font-bold text-foreground">Rs. {doctor.consultationFee}</span></p>

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Consultation Type</label>
                <select 
                  className="w-full p-2.5 bg-muted rounded-lg"
                  value={consultType}
                  onChange={(e) => setConsultType(e.target.value)}
                  disabled={doctor.consultationType !== 'Both'}
                >
                  {doctor.consultationType === 'Both' ? (
                    <>
                      <option value="Online">Online Video</option>
                      <option value="Physical">Physical Clinic</option>
                    </>
                  ) : (
                    <option value={doctor.consultationType}>{doctor.consultationType}</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full p-2.5 bg-muted rounded-lg"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time Slot</label>
                <select 
                  className="w-full p-2.5 bg-muted rounded-lg"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="">Select Time...</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Reason for Visit</label>
                <textarea 
                  className="w-full p-2.5 bg-muted rounded-lg resize-none"
                  rows="3"
                  placeholder="e.g. Headache for 3 days..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={booking}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-bold transition-all mt-4 disabled:opacity-50"
              >
                {booking ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
