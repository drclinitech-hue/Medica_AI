import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card border shadow-2xl rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto overflow-hidden relative"
        >
          {/* Abstract blobs inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 relative z-10">Ready to take control of your health?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of users who trust Medica AI for early symptom detection and intelligent healthcare insights.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/50 hover:-translate-y-1">
              Start Free Prediction <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
