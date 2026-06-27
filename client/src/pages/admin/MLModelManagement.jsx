import React from 'react';
import { Brain, Upload, Play, CheckCircle, Clock } from 'lucide-react';

const MLModelManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black mb-1">ML Models & Data</h1>
        <p className="text-muted-foreground">Manage the Disease Prediction Flask ML model and datasets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Model Status */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Current Model Status</h2>
              <p className="text-sm text-green-500 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Active & Serving
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Version</span>
              <span className="font-semibold">v2.4.1 (Production)</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Accuracy</span>
              <span className="font-semibold text-green-500">94.8%</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Last Trained</span>
              <span className="font-semibold">2026-06-15</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Algorithm</span>
              <span className="font-semibold">Random Forest</span>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90">
              <Play className="w-4 h-4" /> Retrain Model
            </button>
          </div>
        </div>

        {/* Dataset Management */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-secondary/10 text-secondary-foreground rounded-xl">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Training Dataset</h2>
              <p className="text-sm text-muted-foreground">Manage the CSV data used for training.</p>
            </div>
          </div>
          
          <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center bg-muted/20">
            <Upload className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="font-semibold mb-1">Drag and drop a new dataset</p>
            <p className="text-sm text-muted-foreground mb-4">Supports .csv files up to 50MB</p>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-semibold border shadow-sm hover:bg-secondary/80">
              Browse Files
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MLModelManagement;
