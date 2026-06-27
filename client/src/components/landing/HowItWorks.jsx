import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    step: "01",
    title: "Describe Symptoms",
    desc: "Select your current symptoms from our comprehensive list or describe them to the AI."
  },
  {
    step: "02",
    title: "AI Analysis",
    desc: "Our machine learning model analyzes your inputs against thousands of medical data points."
  },
  {
    step: "03",
    title: "Disease Prediction",
    desc: "Receive an instant, accurate prediction detailing the potential disease and confidence score."
  },
  {
    step: "04",
    title: "Medical Recommendations",
    desc: "Review suggested tests, precautions, and determine if a doctor's visit is required."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-card/30 border-y relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            A seamless, four-step journey to understanding your health better.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-8 left-12 right-12 h-0.5 bg-border z-0"></div>

          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-background border-4 border-card flex items-center justify-center shadow-lg mb-6 group-hover:border-primary transition-colors">
                <span className="text-xl font-bold text-primary">{item.step}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
