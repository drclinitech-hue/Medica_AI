import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const DashboardPreview = () => {
  return (
    <section className="py-24 border-y overflow-hidden" id="dashboard">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2 w-full order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl border bg-background shadow-2xl p-4 sm:p-6"
            >
              {/* Fake Dashboard Header */}
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="font-bold">Health Dashboard</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-muted"></div>
              </div>

              {/* Fake Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-xs text-muted-foreground mb-1">Total Predictions</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 mr-1" /> +2 this month
                  </p>
                </div>
                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-xs text-muted-foreground mb-1">Overall Risk</p>
                  <p className="text-2xl font-bold text-secondary">Low</p>
                  <p className="text-xs text-muted-foreground mt-1">Based on recent data</p>
                </div>
              </div>

              {/* Fake History List */}
              <div className="space-y-3">
                <p className="text-sm font-semibold mb-2">Recent Analysis</p>
                {[
                  { disease: "Flu", date: "Today, 10:24 AM", risk: "Moderate" },
                  { disease: "Asthma", date: "Oct 12, 2023", risk: "Low" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.disease}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${item.risk === 'Low' ? 'bg-secondary/20 text-secondary' : 'bg-yellow-500/20 text-yellow-600'}`}>
                      {item.risk}
                    </span>
                  </div>
                ))}
              </div>

              {/* Floating Decorative element */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-12 -top-12 bg-card p-4 rounded-xl border shadow-xl hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Clear to go!</p>
                    <p className="text-xs text-muted-foreground">No urgent flags</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive Health Dashboard</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Keep track of your entire medical history in one unified, beautiful interface. From past symptom analyses to generated medical reports, your health data is organized and easily accessible.
              </p>
              <ul className="space-y-4">
                {[
                  "Visualized prediction history",
                  "Trend analysis over time",
                  "Downloadable medical reports",
                  "Secure and private data storage"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary w-5 h-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
