import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MessageSquare, LineChart, FileText, History, ShieldAlert, HeartPulse, BrainCircuit } from 'lucide-react';

const featureData = [
  {
    icon: <Activity className="h-6 w-6 text-primary" />,
    title: "Disease Prediction",
    description: "Analyze symptoms instantly to predict potential health conditions with high accuracy."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-secondary" />,
    title: "AI Chat Assistant",
    description: "Discuss your symptoms naturally with our conversational AI healthcare agent."
  },
  {
    icon: <LineChart className="h-6 w-6 text-accent" />,
    title: "Health Dashboard",
    description: "Track your health metrics and prediction history in a beautiful, unified dashboard."
  },
  {
    icon: <FileText className="h-6 w-6 text-orange-500" />,
    title: "Medical Reports",
    description: "Generate comprehensive medical reports detailing precautions and suggested tests."
  },
  {
    icon: <History className="h-6 w-6 text-purple-500" />,
    title: "Prediction History",
    description: "Maintain a secure timeline of all your past predictions and symptom analyses."
  },
  {
    icon: <ShieldAlert className="h-6 w-6 text-red-500" />,
    title: "Confidence Analysis",
    description: "Receive exact confidence percentages and risk levels for every diagnosis."
  },
  {
    icon: <HeartPulse className="h-6 w-6 text-pink-500" />,
    title: "Doctor Recommendations",
    description: "Get smart referrals on when you should immediately seek professional medical help."
  },
  {
    icon: <BrainCircuit className="h-6 w-6 text-teal-500" />,
    title: "Medical Insights",
    description: "Learn about various diseases, their prevention, and lifestyle improvements."
  }
];

const Features = () => {
  return (
    <section className="py-24" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Healthcare Intelligence</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to monitor, understand, and predict your health securely and accurately.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureData.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center border mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
