import React from 'react';
import { Save, Shield, Settings, Mail, Database } from 'lucide-react';

const SystemSettings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black mb-1">System Settings</h1>
        <p className="text-muted-foreground">Configure global application parameters.</p>
      </div>

      <div className="space-y-6">
        
        {/* General Settings */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Settings className="text-primary w-5 h-5" /> General Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Website Name</label>
              <input type="text" defaultValue="MediCheck AI" className="w-full bg-muted border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Support Email</label>
              <input type="email" defaultValue="support@medicheck.ai" className="w-full bg-muted border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex justify-between">
                Maintenance Mode
                <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">Off</span>
              </label>
              <select className="w-full bg-muted border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                <option>Disabled</option>
                <option>Enabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Database className="text-primary w-5 h-5" /> API & Integrations
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Groq API Key (AI Chatbot)</label>
              <input type="password" defaultValue="gsk_******************************" className="w-full bg-muted border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Flask ML Server URL</label>
              <input type="text" defaultValue="http://127.0.0.1:5001" className="w-full bg-muted border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2">
            <Save className="w-5 h-5" /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default SystemSettings;
