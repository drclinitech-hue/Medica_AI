import React from 'react';
import { Construction } from 'lucide-react';

const Placeholder = ({ title }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-12 bg-card border rounded-2xl shadow-sm text-center">
      <div className="p-4 bg-primary/10 rounded-full mb-6">
        <Construction className="w-16 h-16 text-primary animate-pulse" />
      </div>
      <h2 className="text-3xl font-black mb-3">{title} Module</h2>
      <p className="text-muted-foreground max-w-lg text-lg">
        This module is scheduled for development in the upcoming phases of the Enterprise Admin rollout.
      </p>
    </div>
  );
};

export default Placeholder;
