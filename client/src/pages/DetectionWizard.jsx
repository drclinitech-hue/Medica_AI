import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, ChevronRight, ChevronLeft, Save, FileText, User, HeartPulse, Stethoscope, FileSearch } from 'lucide-react';
import detectionService from '../services/detectionService';
import doctorService from '../services/doctorService';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const PHASES = [
  { id: 1, title: 'Demographics', icon: User },
  { id: 2, title: 'Medical History', icon: HeartPulse },
  { id: 3, title: 'Health Problem', icon: FileText },
  { id: 4, title: 'AI Analysis', icon: Activity },
  { id: 5, title: 'Detection', icon: FileSearch },
  { id: 6, title: 'Recommendations', icon: CheckCircle },
  { id: 7, title: 'Doctor Referral', icon: Stethoscope },
  { id: 8, title: 'Report', icon: FileText },
];

const CHRONIC_DISEASES_LIST = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Kidney Disease', 'Liver Disease', 'Cancer'];

const DetectionWizard = () => {
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState(1);
  const [loading, setLoading] = useState(false);
  const [detectionId, setDetectionId] = useState(null);

  // Phase 1: Demographics
  const [demographics, setDemographics] = useState({
    age: '', gender: '', height: '', weight: '', bmi: '', bloodGroup: '',
    temp: '', bp: '', sugar: '',
    lifestyle: { smoking: 'No', alcohol: 'No', physicalActivity: 'Moderate' }
  });

  // Calculate BMI auto
  useEffect(() => {
    if (demographics.height && demographics.weight) {
      // height is in feet, weight is in kg
      // 1 foot = 0.3048 meters
      const h_meters = parseFloat(demographics.height) * 0.3048;
      const w = parseFloat(demographics.weight);
      if (h_meters > 0 && w > 0) {
        setDemographics(prev => ({ ...prev, bmi: (w / (h_meters * h_meters)).toFixed(1) }));
      }
    }
  }, [demographics.height, demographics.weight]);

  // Phase 2: Medical History
  const [medicalHistory, setMedicalHistory] = useState({
    chronicDiseases: [], allergies: []
  });
  const [allergyInput, setAllergyInput] = useState('');

  // Phase 3: Diagnostic Interview
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = React.useRef(null);
  
  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Phase 4: AI Analysis
  const [extractedData, setExtractedData] = useState({ symptoms: [], duration: '', severity: '' });
  const [symptomInput, setSymptomInput] = useState('');

  // Phase 5 & 6: ML Results
  const [mlResults, setMlResults] = useState(null);

  // Phase 7: Doctors
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);

  // Navigation handlers
  const nextPhase = () => setCurrentPhase(p => Math.min(8, p + 1));
  const prevPhase = () => setCurrentPhase(p => Math.max(1, p - 1));

  // --- API Handlers ---
  
  const handlePhase2Submit = async () => {
    if (!demographics.age || !demographics.gender) {
      toast.error('Please fill out age and gender');
      return;
    }
    setLoading(true);
    try {
      const res = await detectionService.startDetection(demographics, medicalHistory);
      setDetectionId(res.detectionId);
      nextPhase();
    } catch (err) {
      toast.error('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhase3Submit = async () => {
    if (!chatInput.trim()) return;
    
    const newUserMsg = { sender: 'user', text: chatInput };
    const updatedHistory = [...chatHistory, newUserMsg];
    
    setChatHistory(updatedHistory);
    setChatInput('');
    setLoading(true);
    
    try {
      const res = await detectionService.analyzeDescription(updatedHistory);
      
      if (res.data?.type === 'complete') {
        setExtractedData(res.data.data);
        toast.success('Diagnostic interview complete!');
        nextPhase();
      } else {
        // AI returned a follow-up question
        setChatHistory([...updatedHistory, { sender: 'ai', text: res.data?.text || 'Could you provide more details?' }]);
      }
    } catch (err) {
      toast.error('AI Interview failed.');
      setChatHistory(updatedHistory); // keep user message
    } finally {
      setLoading(false);
    }
  };

  const handlePhase4Submit = async () => {
    if (extractedData.symptoms.length === 0) {
      toast.error('Please ensure symptoms are listed');
      return;
    }
    setLoading(true);
    try {
      const res = await detectionService.runDetection({
        detectionId,
        symptoms: extractedData.symptoms,
        duration: extractedData.duration,
        severity: extractedData.severity,
        patientDescription: chatHistory.map(m => m.text).join(' | ')
      });
      setMlResults(res);
      nextPhase();
      
      // Auto fetch doctors in background
      if (res.details?.predicted_disease) {
        doctorService.getDoctors({}).then(docs => {
          // just taking top 3 for demo
          setRecommendedDoctors(docs.slice(0, 3)); 
        }).catch(e => console.log(e));
      }
    } catch (err) {
      toast.error('Detection failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERERS ---

  const renderStepper = () => (
    <div className="flex justify-between mb-8 overflow-x-auto pb-4 hide-scrollbar">
      {PHASES.map((phase, index) => {
        const isActive = phase.id === currentPhase;
        const isCompleted = phase.id < currentPhase;
        const Icon = phase.icon;
        
        return (
          <div key={phase.id} className="flex flex-col items-center min-w-[80px] relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-300 ${isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            <p className={`text-xs mt-2 font-semibold text-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{phase.title}</p>
            {/* Progress Line */}
            {index < PHASES.length - 1 && (
              <div className={`absolute top-5 left-[50%] w-full h-[2px] -z-0 ${phase.id < currentPhase ? 'bg-green-500' : 'bg-muted'}`} style={{ width: '100%', left: '50%' }}></div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderPhase1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">Patient Demographics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-bold mb-1">Age</label><input type="number" className="w-full p-3 bg-muted rounded-xl" value={demographics.age} onChange={e => setDemographics({...demographics, age: e.target.value})} /></div>
        <div>
          <label className="block text-sm font-bold mb-1">Gender</label>
          <select className="w-full p-3 bg-muted rounded-xl" value={demographics.gender} onChange={e => setDemographics({...demographics, gender: e.target.value})}>
            <option value="">Select...</option><option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <div><label className="block text-sm font-bold mb-1">Height (ft)</label><input type="number" step="0.1" className="w-full p-3 bg-muted rounded-xl" value={demographics.height} onChange={e => setDemographics({...demographics, height: e.target.value})} placeholder="e.g. 5.8" /></div>
        <div><label className="block text-sm font-bold mb-1">Weight (kg)</label><input type="number" className="w-full p-3 bg-muted rounded-xl" value={demographics.weight} onChange={e => setDemographics({...demographics, weight: e.target.value})} /></div>
        <div><label className="block text-sm font-bold mb-1">BMI (Auto)</label><input type="text" readOnly className="w-full p-3 bg-primary/10 text-primary font-bold rounded-xl" value={demographics.bmi} /></div>
        <div>
          <label className="block text-sm font-bold mb-1">Blood Group</label>
          <select className="w-full p-3 bg-muted rounded-xl" value={demographics.bloodGroup} onChange={e => setDemographics({...demographics, bloodGroup: e.target.value})}>
            <option value="">Select...</option><option>A+</option><option>O+</option><option>B+</option><option>AB+</option>
          </select>
        </div>
        <div><label className="block text-sm font-bold mb-1">Temperature (°F)</label><input type="number" step="0.1" className="w-full p-3 bg-muted rounded-xl" value={demographics.temp} onChange={e => setDemographics({...demographics, temp: e.target.value})} placeholder="e.g. 98.6" /></div>
        <div><label className="block text-sm font-bold mb-1">Blood Pressure (Systolic)</label><input type="number" className="w-full p-3 bg-muted rounded-xl" value={demographics.bp} onChange={e => setDemographics({...demographics, bp: e.target.value})} placeholder="e.g. 120" /></div>
        <div><label className="block text-sm font-bold mb-1">Blood Sugar (mg/dL)</label><input type="number" className="w-full p-3 bg-muted rounded-xl" value={demographics.sugar} onChange={e => setDemographics({...demographics, sugar: e.target.value})} placeholder="e.g. 90" /></div>
      </div>
      <div className="flex justify-end pt-4">
        <button onClick={nextPhase} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2">Next <ChevronRight className="w-4 h-4"/></button>
      </div>
    </div>
  );

  const renderPhase2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">Medical History</h2>
      
      <div>
        <label className="block text-sm font-bold mb-3">Chronic Diseases</label>
        <div className="flex flex-wrap gap-3">
          {CHRONIC_DISEASES_LIST.map(disease => (
            <label key={disease} className={`px-4 py-2 rounded-xl cursor-pointer border transition-colors ${medicalHistory.chronicDiseases.includes(disease) ? 'bg-primary text-white border-primary' : 'bg-muted border-border hover:bg-muted/80'}`}>
              <input 
                type="checkbox" className="hidden" 
                checked={medicalHistory.chronicDiseases.includes(disease)}
                onChange={(e) => {
                  if(e.target.checked) setMedicalHistory({...medicalHistory, chronicDiseases: [...medicalHistory.chronicDiseases, disease]});
                  else setMedicalHistory({...medicalHistory, chronicDiseases: medicalHistory.chronicDiseases.filter(d => d !== disease)});
                }} 
              />
              {disease}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2">Food / Drug Allergies</label>
        <div className="flex gap-2 mb-3">
          <input type="text" value={allergyInput} onChange={e => setAllergyInput(e.target.value)} placeholder="e.g. Peanuts, Penicillin" className="flex-1 p-3 bg-muted rounded-xl" />
          <button onClick={() => { if(allergyInput) { setMedicalHistory({...medicalHistory, allergies: [...medicalHistory.allergies, allergyInput]}); setAllergyInput(''); } }} type="button" className="bg-secondary text-secondary-foreground px-6 font-bold rounded-xl">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {medicalHistory.allergies.map((a, i) => (
             <span key={i} className="bg-red-500/10 text-red-600 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
               {a} <button onClick={() => setMedicalHistory({...medicalHistory, allergies: medicalHistory.allergies.filter((_, idx) => idx !== i)})} className="hover:text-red-800">&times;</button>
             </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={prevPhase} className="bg-muted text-foreground px-6 py-2.5 rounded-xl font-bold hover:bg-muted/80 flex items-center gap-2"><ChevronLeft className="w-4 h-4"/> Back</button>
        <button onClick={handlePhase2Submit} disabled={loading} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save & Continue'} <ChevronRight className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );

  const renderPhase3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">Diagnostic Interview</h2>
      <p className="text-muted-foreground">Describe your symptoms to our AI doctor. It will ask follow-up questions to understand your exact condition.</p>
      
      <div className="bg-card border rounded-2xl p-4 h-[400px] flex flex-col shadow-inner overflow-hidden relative">
        {chatHistory.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-0 opacity-50">
            <Activity className="w-12 h-12 mb-4" />
            <p>Start by describing your main health problem...</p>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 z-10 pr-2 hide-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm border'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-muted rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center border">
                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="flex gap-2 z-10">
          <input 
            type="text" 
            className="flex-1 p-3 bg-muted border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none"
            placeholder="Type your symptoms here..."
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handlePhase3Submit()}
            disabled={loading}
          />
          <button 
            onClick={handlePhase3Submit} 
            disabled={loading || !chatInput.trim()} 
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            Send <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={prevPhase} className="bg-muted text-foreground px-6 py-2.5 rounded-xl font-bold hover:bg-muted/80 flex items-center gap-2"><ChevronLeft className="w-4 h-4"/> Back</button>
      </div>
    </div>
  );

  const renderPhase4 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">AI Symptom Analysis</h2>
      <p className="text-muted-foreground">Please review the extracted symptoms before detecting the disease.</p>
      
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-sm font-bold text-muted-foreground uppercase">Duration</p><p className="text-lg font-bold">{extractedData.duration || 'Not specified'}</p></div>
          <div><p className="text-sm font-bold text-muted-foreground uppercase">Severity</p><p className="text-lg font-bold capitalize">{extractedData.severity || 'Not specified'}</p></div>
        </div>
        
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase mb-2">Extracted Symptoms</p>
          <div className="flex flex-wrap gap-2">
            {extractedData.symptoms.map((s, i) => (
              <span key={i} className="bg-background border px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                {s} <button onClick={() => setExtractedData(prev => ({...prev, symptoms: prev.symptoms.filter((_, idx) => idx !== i)}))} className="text-red-500 hover:text-red-700">&times;</button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-primary/10">
          <input type="text" value={symptomInput} onChange={e => setSymptomInput(e.target.value)} placeholder="Add missing symptom..." className="flex-1 p-2 bg-background border rounded-lg text-sm" />
          <button onClick={() => { if(symptomInput) { setExtractedData(p => ({...p, symptoms: [...p.symptoms, symptomInput]})); setSymptomInput(''); } }} className="bg-secondary text-secondary-foreground px-4 font-bold rounded-lg text-sm">Add</button>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={prevPhase} className="bg-muted text-foreground px-6 py-2.5 rounded-xl font-bold hover:bg-muted/80 flex items-center gap-2"><ChevronLeft className="w-4 h-4"/> Re-do Interview</button>
        <button onClick={handlePhase4Submit} disabled={loading} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
          {loading ? 'Running ML Models...' : 'Run Disease Detection'} <FileSearch className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );

  const renderPhase5 = () => {
    if (!mlResults) return <div>Loading...</div>;
    const { details } = mlResults;
    const confidenceColor = details.confidence_score > 80 ? 'text-green-500' : details.confidence_score > 60 ? 'text-yellow-500' : 'text-red-500';

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-6">
        <h2 className="text-3xl font-extrabold mb-2">Detection Complete</h2>
        <div className="bg-card border-2 border-border rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm mb-4">Primary Detection</p>
          <h3 className="text-5xl font-black text-primary mb-6">{details.predicted_disease}</h3>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2"><span className="font-bold">Confidence Score</span><span className={`font-bold ${confidenceColor}`}>{details.confidence_score}%</span></div>
            <div className="w-full bg-muted rounded-full h-4"><div className="bg-primary h-4 rounded-full transition-all duration-1000" style={{ width: `${details.confidence_score}%` }}></div></div>
          </div>
          
          <div className={`inline-block px-4 py-1.5 rounded-full font-bold border ${details.risk_level === 'High' || details.risk_level === 'Critical' ? 'bg-red-500/10 text-red-600 border-red-200' : 'bg-green-500/10 text-green-600 border-green-200'}`}>
            Risk Level: {details.risk_level}
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button onClick={nextPhase} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2">View Health Recommendations <ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>
    );
  };

  const renderPhase6 = () => {
    if (!mlResults) return null;
    const { details } = mlResults;
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold">Health Recommendations</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckCircle className="text-green-500"/> Immediate Precautions</h3>
            <ul className="space-y-2">
              {details.precautions?.map((p, i) => <li key={i} className="flex gap-2 items-start"><span className="text-primary mt-1">•</span> <span>{p}</span></li>)}
            </ul>
          </div>
          
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity className="text-blue-500"/> Suggested Tests</h3>
            <ul className="space-y-2">
              {details.recommended_tests?.map((p, i) => <li key={i} className="flex gap-2 items-start"><span className="text-primary mt-1">•</span> <span>{p}</span></li>)}
            </ul>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-700 text-sm font-medium text-center mt-6">
          <strong>Medical Disclaimer:</strong> This AI-generated assessment is not a medical diagnosis. Please consult a qualified healthcare professional.
        </div>

        <div className="flex justify-between pt-4">
          <button onClick={prevPhase} className="bg-muted text-foreground px-6 py-2.5 rounded-xl font-bold hover:bg-muted/80 flex items-center gap-2"><ChevronLeft className="w-4 h-4"/> Back</button>
          <button onClick={nextPhase} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2">Find a Doctor <ChevronRight className="w-4 h-4"/></button>
        </div>
      </div>
    );
  };

  const renderPhase7 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">Doctor Referral</h2>
      <p className="text-muted-foreground">Based on the detection ({mlResults?.details?.predicted_disease}), we recommend consulting these specialists.</p>
      
      <div className="grid gap-4 mt-4">
        {recommendedDoctors.map(doctor => (
          <div key={doctor._id} className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img src={doctor.profilePhoto} alt={doctor.userId?.name} className="w-16 h-16 rounded-full object-cover shadow-sm"/>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-lg font-bold">{doctor.userId?.name}</h4>
              <p className="text-primary text-sm font-bold mb-1">{doctor.specialization}</p>
              <p className="text-xs text-muted-foreground">{doctor.hospitals[0]?.name}, {doctor.hospitals[0]?.city}</p>
            </div>
            <Link to={`/doctors/${doctor._id}?detectionId=${detectionId}&disease=${encodeURIComponent(mlResults?.details?.predicted_disease)}`} className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-bold text-sm w-full sm:w-auto text-center">Book Now</Link>
          </div>
        ))}
        {recommendedDoctors.length === 0 && <p className="text-center p-6 border border-dashed rounded-xl">No specific doctors found. <Link to="/doctors" className="text-primary underline">Browse directory</Link></p>}
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={prevPhase} className="bg-muted text-foreground px-6 py-2.5 rounded-xl font-bold hover:bg-muted/80 flex items-center gap-2"><ChevronLeft className="w-4 h-4"/> Back</button>
        <button onClick={nextPhase} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2">Generate Final Report <ChevronRight className="w-4 h-4"/></button>
      </div>
    </div>
  );

  const renderPhase8 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Final Detection Report</h2>
        <button onClick={() => window.print()} className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><Save className="w-4 h-4"/> Print / Save PDF</button>
      </div>
      
      <div id="printable-report" className="bg-white text-black p-8 rounded-2xl border shadow-sm">
        <div className="border-b-2 border-primary pb-4 mb-6 text-center">
          <h1 className="text-3xl font-black text-primary">MEDICHECK AI</h1>
          <p className="text-sm font-bold text-gray-500 tracking-widest uppercase mt-1">Automated Disease Detection Report</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg border-b pb-1 mb-2">Patient Details</h4>
            <p className="text-sm"><span className="font-semibold w-24 inline-block">Age:</span> {demographics.age} Y</p>
            <p className="text-sm"><span className="font-semibold w-24 inline-block">Gender:</span> {demographics.gender}</p>
            <p className="text-sm"><span className="font-semibold w-24 inline-block">BMI:</span> {demographics.bmi}</p>
          </div>
          <div>
            <h4 className="font-bold text-lg border-b pb-1 mb-2">Detection Info</h4>
            <p className="text-sm"><span className="font-semibold w-24 inline-block">Date:</span> {new Date().toLocaleDateString()}</p>
            <p className="text-sm"><span className="font-semibold w-24 inline-block">Reference ID:</span> {detectionId}</p>
          </div>
        </div>

        <div className="mb-8 p-4 bg-gray-50 border rounded-xl">
          <h4 className="font-bold text-lg mb-2 text-primary">Detection Result</h4>
          <h2 className="text-2xl font-black">{mlResults?.details?.predicted_disease}</h2>
          <p className="text-sm mt-1">Confidence Score: <span className="font-bold">{mlResults?.details?.confidence_score}%</span> | Risk Level: <span className="font-bold">{mlResults?.details?.risk_level}</span></p>
        </div>

        <div className="mb-8">
          <h4 className="font-bold text-lg border-b pb-1 mb-2">Extracted Symptoms</h4>
          <p className="text-sm">{extractedData.symptoms.join(', ')} ({extractedData.duration})</p>
        </div>

        <div className="mb-8">
          <h4 className="font-bold text-lg border-b pb-1 mb-2">Recommendations & Tests</h4>
          <ul className="text-sm list-disc pl-5">
            {mlResults?.details?.precautions?.map((p, i) => <li key={i}>{p}</li>)}
            {mlResults?.details?.recommended_tests?.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        <div className="text-center mt-12 pt-6 border-t text-xs text-gray-500 font-bold">
          <p>*** NOT A MEDICAL DIAGNOSIS ***</p>
          <p>This report was generated automatically by AI and must be verified by a qualified physician.</p>
        </div>
      </div>
      
      <div className="flex justify-center pt-6">
        <Link to="/doctor-dashboard" className="text-primary font-bold hover:underline">Return to Dashboard</Link>
      </div>
    </div>
  );

  return (
    <div className="container py-10 pt-24 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Disease Detection Workflow</h1>
        <p className="text-muted-foreground mt-2">Complete each phase accurately for the best analysis.</p>
      </div>

      {renderStepper()}

      <div className="bg-card border border-border/50 rounded-3xl p-6 sm:p-10 shadow-xl min-h-[400px]">
        {currentPhase === 1 && renderPhase1()}
        {currentPhase === 2 && renderPhase2()}
        {currentPhase === 3 && renderPhase3()}
        {currentPhase === 4 && renderPhase4()}
        {currentPhase === 5 && renderPhase5()}
        {currentPhase === 6 && renderPhase6()}
        {currentPhase === 7 && renderPhase7()}
        {currentPhase === 8 && renderPhase8()}
      </div>
    </div>
  );
};

export default DetectionWizard;
