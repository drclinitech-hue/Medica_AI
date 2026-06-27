import React from 'react';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';

const ReportManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black mb-1">Reports & Logs</h1>
        <p className="text-muted-foreground">Generate and export system reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-card border rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 mx-auto bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg mb-2">Prediction Reports</h3>
          <p className="text-sm text-muted-foreground mb-6">Export all AI disease predictions made in the last 30 days.</p>
          <button className="w-full bg-primary text-primary-foreground py-2 rounded-xl font-semibold flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 mx-auto bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg mb-2">User Directory</h3>
          <p className="text-sm text-muted-foreground mb-6">Export complete directory of all registered patients and doctors.</p>
          <button className="w-full bg-primary text-primary-foreground py-2 rounded-xl font-semibold flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download Excel
          </button>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-16 h-16 mx-auto bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg mb-2">System Audit Logs</h3>
          <p className="text-sm text-muted-foreground mb-6">Security and access logs for the administrator panel.</p>
          <button className="w-full bg-primary text-primary-foreground py-2 rounded-xl font-semibold flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download CSV
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReportManagement;
