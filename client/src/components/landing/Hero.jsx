import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Stethoscope, ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" id="home">
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20"
            >
              <Activity className="h-4 w-4" />
              <span>Next-Generation AI Healthcare</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
            >
              AI-Powered <br className="hidden lg:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Disease Prediction</span> <br className="hidden lg:block"/> & Healthcare Assistant
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0"
            >
              Leverage advanced Artificial Intelligence to detect potential diseases early, track your medical history, and receive intelligent healthcare insights 24/7.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1">
                Get Started <ChevronRight className="h-5 w-5" />
              </Link>
              <Link to="/detect" className="w-full sm:w-auto px-8 py-4 bg-card text-card-foreground border rounded-full font-semibold hover:bg-muted transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                Try AI Assistant <Stethoscope className="h-5 w-5 text-secondary" />
              </Link>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative w-full flex justify-center mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-lg z-10"
            >
               {/* Decorative glow behind image */}
               <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform -translate-y-4"></div>
               
               <img 
                 src="/images/hero.png" 
                 alt="AI Healthcare Dashboard" 
                 className="relative z-10 w-full h-auto drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500 rounded-3xl border-4 border-white/10 shadow-[0_20px_50px_rgba(37,99,235,0.15)] object-cover bg-card" 
               />

               {/* Floating Abstract UI Elements - Now relative to the image */}
               <motion.div 
                 animate={{ y: [0, -15, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="hidden md:flex absolute -top-8 -left-12 bg-card p-4 rounded-xl shadow-xl border flex-col gap-3 z-20"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                     <Activity className="h-5 w-5 text-green-500" />
                   </div>
                   <div>
                     <p className="text-sm font-bold">Accuracy</p>
                     <p className="text-xs text-muted-foreground">95.8% Model</p>
                   </div>
                 </div>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 15, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="hidden md:flex absolute -bottom-8 -right-8 bg-card p-4 rounded-xl shadow-xl border flex-col gap-3 z-20"
               >
                  <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                     <Stethoscope className="h-5 w-5 text-blue-500" />
                   </div>
                   <div>
                     <p className="text-sm font-bold">Instant Diagnosis</p>
                     <p className="text-xs text-muted-foreground">0.2s Latency</p>
                   </div>
                 </div>
               </motion.div>

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
