import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Heart, Activity, Brain, Stethoscope, Droplet, User } from 'lucide-react'; 

const categories = [
  { name: "Respiratory", icon: <Wind className="h-8 w-8" />, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Cardiovascular", icon: <Heart className="h-8 w-8" />, color: "text-red-500", bg: "bg-red-500/10" },
  { name: "Digestive", icon: <Activity className="h-8 w-8" />, color: "text-orange-500", bg: "bg-orange-500/10" },
  { name: "Neurological", icon: <Brain className="h-8 w-8" />, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Infectious", icon: <Stethoscope className="h-8 w-8" />, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Endocrine", icon: <Droplet className="h-8 w-8" />, color: "text-teal-500", bg: "bg-teal-500/10" },
  { name: "Skin Diseases", icon: <User className="h-8 w-8" />, color: "text-pink-500", bg: "bg-pink-500/10" },
];

const DiseaseCategories = () => {
  return (
    <section className="py-24" id="diseases">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Supported Disease Categories</h2>
          <p className="text-lg text-muted-foreground">
            Our AI model is trained on diverse medical datasets spanning multiple specialties.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md cursor-pointer w-40 h-40"
            >
              <div className={`p-4 rounded-full ${cat.bg} ${cat.color} mb-3`}>
                {cat.icon}
              </div>
              <h3 className="font-semibold text-center text-sm">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiseaseCategories;
