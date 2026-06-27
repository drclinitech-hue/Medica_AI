import React, { useState, useEffect } from 'react';
import doctorService from '../services/doctorService';
import { Search, MapPin, Filter, Star, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CITIES = ['All', 'Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
const SPECIALIZATIONS = ['All', 'General Physician', 'Cardiologist', 'Neurologist', 'Dermatologist', 'Pulmonologist', 'Orthopedic Surgeon'];

const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [specialization, setSpecialization] = useState('All');
  const [maxFee, setMaxFee] = useState(5000);

  useEffect(() => {
    fetchDoctors();
  }, [city, specialization, search, maxFee]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (search) filters.search = search;
      if (city !== 'All') filters.city = city;
      if (specialization !== 'All') filters.specialization = specialization;
      if (maxFee < 5000) filters.maxFee = maxFee;

      const data = await doctorService.getDoctors(filters);
      setDoctors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 pt-24 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-1/4 space-y-6 bg-card border border-border/50 rounded-2xl p-6 shadow-xl h-fit lg:sticky lg:top-24">
        <div>
          <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" /> Refine Search
          </h2>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Search Name</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Dr. Name..."
              className="w-full pl-9 pr-4 py-2.5 bg-muted/50 border border-border/50 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">City</label>
          <select 
            className="w-full p-2.5 bg-muted/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Specialization</label>
          <select 
            className="w-full p-2.5 bg-muted/50 border border-border/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">Max Fee</label>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">PKR {maxFee}</span>
          </div>
          <input 
            type="range" 
            min="1000" 
            max="5000" 
            step="500"
            className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            value={maxFee}
            onChange={(e) => setMaxFee(e.target.value)}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="w-full lg:w-3/4">
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Our Specialists</h1>
            <p className="text-muted-foreground mt-2 font-medium">Found <span className="text-primary font-bold">{doctors.length}</span> verified healthcare professionals</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full shadow-lg shadow-primary/20"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {doctors.map(doctor => (
              <div key={doctor._id} className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <img 
                    src={doctor.profilePhoto} 
                    alt={doctor.userId?.name} 
                    className="w-28 h-28 rounded-full object-cover shadow-md border-2 border-primary/20 group-hover:border-primary transition-colors bg-muted"
                  />
                  {doctor.isVerified && (
                     <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-sm">
                        <CheckCircle className="w-6 h-6 text-blue-500 fill-white" title="Verified PMDC" />
                     </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <h3 className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors">{doctor.userId?.name}</h3>
                  </div>
                  <p className="text-primary font-bold text-sm mb-4 bg-primary/10 w-fit px-3 py-1 rounded-full mx-auto sm:mx-0 border border-primary/20">{doctor.specialization}</p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-muted-foreground mb-4 sm:mb-0">
                    <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50 font-medium"><MapPin className="w-4 h-4 text-primary"/> {doctor.hospitals[0]?.city}</span>
                    <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50 font-medium"><Clock className="w-4 h-4 text-primary"/> {doctor.experience} yrs exp</span>
                    <span className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-500/20 text-yellow-600 font-bold"><Star className="w-4 h-4 fill-yellow-500 text-yellow-500"/> {doctor.rating}</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center sm:items-end border-t sm:border-t-0 sm:border-l border-border/50 pt-6 sm:pt-0 sm:pl-6 min-w-[160px]">
                  <div className="text-center sm:text-right mb-5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Consultation Fee</p>
                    <p className="text-3xl font-black text-green-600">Rs.{doctor.consultationFee}</p>
                  </div>
                  <Link 
                    to={`/doctors/${doctor._id}`}
                    className="w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 border border-primary/50"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
            
            {doctors.length === 0 && (
              <div className="bg-card border border-dashed border-border/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                <Search className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No Doctors Found</h3>
                <p className="text-muted-foreground max-w-sm mb-6">We couldn't find any healthcare professionals matching your current filters.</p>
                <button 
                  onClick={() => {setSearch(''); setCity('All'); setSpecialization('All'); setMaxFee(5000)}} 
                  className="bg-primary/10 hover:bg-primary/20 text-primary px-6 py-2 rounded-full font-bold transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;
