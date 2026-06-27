import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How accurate is the AI prediction?",
    answer: "Our model is trained on diverse clinical datasets and achieves over 95% accuracy in controlled tests. However, it is designed to be an assistive tool, not a replacement for professional medical diagnosis."
  },
  {
    question: "Is my medical data secure?",
    answer: "Absolutely. All your data is encrypted, and we strictly adhere to privacy standards. Your symptom history and predictions are accessible only by you."
  },
  {
    question: "Can I share the reports with my doctor?",
    answer: "Yes! You can easily export your prediction history and AI-generated medical insights as a PDF to share with your healthcare provider."
  },
  {
    question: "Does it cover rare diseases?",
    answer: "Currently, the model supports the top 40-50 most common diseases across multiple categories. We are continuously training the AI to expand its database."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-card/30" id="faq">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-xl bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between font-semibold text-left focus:outline-none"
              >
                {faq.question}
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 text-muted-foreground text-sm border-t pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
