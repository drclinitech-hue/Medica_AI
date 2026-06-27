import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const AnimatedCounter = ({ from, to, duration = 2, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [count, setCount] = React.useState(from);

  React.useEffect(() => {
    if (isInView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(to);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return (
    <div ref={ref} className="text-center">
      <h3 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
        {count}
        {to >= 1000 && count === to ? '+' : ''}
        {to === 50 && count === to ? '+' : ''}
        {to === 95 && count === to ? '%' : ''}
        {typeof to === 'string' ? to : ''}
      </h3>
      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
};

const Statistics = () => {
  return (
    <section className="py-16 border-y bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <AnimatedCounter from={0} to={50} label="Supported Diseases" />
          <AnimatedCounter from={0} to={10000} label="Predictions Made" />
          <AnimatedCounter from={0} to={95} label="Accuracy" />
          <div className="text-center flex flex-col justify-center">
             <h3 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">24/7</h3>
             <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Assistant</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
