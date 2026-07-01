import React from 'react';
import { Activity, MapPin } from 'lucide-react';

const PrescriptionPad = ({ appointment }) => {
  if (!appointment || !appointment.doctorId) return null;

  const doc = appointment.doctorId;
  const user = appointment.patientId;
  
  // Calculate basic age if possible, or fallback
  const dateStr = new Date(appointment.date).toLocaleDateString();

  return (
    <div className="hidden print:block w-full h-full bg-white text-black p-8 font-sans">
      
      {/* Header / Letterhead */}
      <div className="border-b-2 border-primary pb-4 mb-6 flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <Activity className="w-12 h-12 text-primary" />
          <div>
            <h1 className="text-3xl font-black text-primary">{doc.userId?.name || 'Doctor Name'}</h1>
            <p className="font-bold text-lg">{doc.specialization}</p>
            <p className="text-sm text-gray-600">PMDC: {doc.pmdcNumber}</p>
          </div>
        </div>
        <div className="text-right max-w-[250px]">
          <h3 className="font-bold">{doc.hospitals?.[0]?.name || 'MediCheck Hospital'}</h3>
          <p className="text-sm text-gray-600 flex items-center justify-end gap-1">
            <MapPin className="w-4 h-4" /> {doc.hospitals?.[0]?.city || 'City'}
          </p>
          <p className="text-sm text-gray-600 mt-1">Date: {dateStr}</p>
        </div>
      </div>

      {/* Patient Demographics Box */}
      <div className="border border-gray-300 p-4 mb-8 rounded-lg flex justify-between bg-gray-50">
        <div>
          <p><span className="font-bold">Patient Name:</span> {user?.name || 'Unknown'}</p>
          <p><span className="font-bold">Email:</span> {user?.email || 'N/A'}</p>
        </div>
        <div className="text-right">
          <p><span className="font-bold">Gender:</span> {user?.gender || 'N/A'} &nbsp;&nbsp; <span className="font-bold">Age:</span> {user?.age || 'N/A'}</p>
          <p><span className="font-bold">Height:</span> {user?.height ? `${user.height} ${user.height < 10 ? 'ft' : 'cm'}` : 'N/A'} &nbsp;&nbsp; <span className="font-bold">Weight:</span> {user?.weight ? `${user.weight} kg` : 'N/A'}</p>
        </div>
      </div>

      {/* Medical History / Reason */}
      <div className="mb-8">
        <h3 className="text-xl font-bold border-b pb-2 mb-2">Clinical Notes / History</h3>
        <p className="text-gray-800 italic">"{appointment.reason}"</p>
      </div>

      {/* Rx Section */}
      <div className="mt-12 flex-1 min-h-[400px]">
        <h1 className="text-6xl font-serif text-gray-300 opacity-50 mb-4">Rx</h1>
        {/* Doctor will write here physically */}
        <div className="w-full h-full border-l-2 border-gray-200 pl-4 space-y-12">
          <div className="border-b border-gray-200 w-full"></div>
          <div className="border-b border-gray-200 w-full"></div>
          <div className="border-b border-gray-200 w-full"></div>
          <div className="border-b border-gray-200 w-full"></div>
          <div className="border-b border-gray-200 w-full"></div>
          <div className="border-b border-gray-200 w-full"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-8 w-full border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
        <p>This prescription is generated via MediCheck AI. Not valid without doctor's physical signature and stamp.</p>
        <div className="mt-8 text-right pr-16">
          <p className="border-t border-black inline-block pt-1 font-bold">Doctor's Signature</p>
        </div>
      </div>
      
    </div>
  );
};

export default PrescriptionPad;
