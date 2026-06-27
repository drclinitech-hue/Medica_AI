import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Jenkins",
      role: "General Practitioner",
      content: "This AI platform serves as an incredible second opinion tool. Its accuracy in correlating complex symptoms to early stage diseases has been remarkable.",
      avatar: "/images/avatar_1.png"
    },
    {
      name: "Michael Chang",
      role: "Medical Student",
      content: "The symptom mapping feature helps me understand the practical application of diagnostic criteria in real-time. A brilliant educational and clinical tool.",
      avatar: "/images/avatar_2.png"
    },
    {
      name: "Elena Rodriguez",
      role: "Patient",
      content: "I tracked my symptoms for a week, and the AI accurately predicted a kidney infection before my doctor did. It told me exactly what tests to ask for.",
      avatar: "/images/avatar_3.png"
    }
  ];

  return (
    <section className="py-24" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Professionals & Patients</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our AI Disease Prediction tool is making an impact across the healthcare spectrum.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-card p-8 rounded-2xl border shadow-sm relative"
            >
              <div className="text-4xl text-primary/20 absolute top-4 right-6 font-serif">"</div>
              <p className="text-muted-foreground mb-6 relative z-10 italic">
                "{test.content}"
              </p>
              <div className="flex items-center gap-4">
                <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full border-2 border-primary/20 object-cover" />
                <div>
                  <h4 className="font-bold">{test.name}</h4>
                  <p className="text-xs text-muted-foreground">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
