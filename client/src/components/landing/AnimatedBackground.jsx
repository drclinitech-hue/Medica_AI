import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Top Left Blob */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[100px]"
      />
      
      {/* Bottom Right Blob */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-secondary/20 blur-[120px]"
      />
      
      {/* Center Accent Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-accent/20 blur-[80px]"
      />
      
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
    </div>
  );
};

export default AnimatedBackground;
