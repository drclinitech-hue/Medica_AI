import React, { useEffect, useState } from 'react';
import detectionService from '../services/detectionService';
import { Clock, Activity, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const DetectionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await detectionService.getDetectionHistory();
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="p-10 text-center"><Clock className="animate-spin h-8 w-8 mx-auto text-primary" /></div>;
  }

  return (
    <div className="container py-10 max-w-5xl mx-auto pt-24">
      <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
        <Activity className="w-8 h-8 text-primary" /> Detection History
      </h1>
      
      {history.length === 0 ? (
        <div className="bg-card rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          <p className="text-lg">No detection history found.</p>
          <Link to="/detect" className="text-primary hover:underline mt-2 inline-block font-bold">Start a New Detection</Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((record) => (
            <div key={record._id} className="bg-card hover:shadow-lg transition-all rounded-2xl border border-border/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex-1 ml-2">
                <h3 className="text-2xl font-black text-foreground">{record.detectedDisease || 'Incomplete Detection'}</h3>
                
                {record.symptoms && record.symptoms.length > 0 && (
                   <p className="text-sm font-medium mt-2">
                     <span className="text-muted-foreground uppercase text-xs tracking-wider">Symptoms: </span>
                     {record.symptoms.join(', ')}
                   </p>
                )}
                
                <p className="text-xs text-muted-foreground mt-3 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(record.date).toLocaleString()}
                </p>
              </div>
              
              {record.detectedDisease && (
                <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-border/50">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Confidence</p>
                    <p className="font-black text-xl text-primary">{record.confidenceScore}%</p>
                  </div>
                  
                  <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${record.riskLevel === 'High' || record.riskLevel === 'Critical' ? 'bg-red-500/10 text-red-600 border-red-200' : 'bg-green-500/10 text-green-600 border-green-200'}`}>
                    {record.riskLevel}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetectionHistory;
