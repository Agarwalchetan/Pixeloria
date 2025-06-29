import React from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Star, Heart, Sparkles, Target, Brain, Rocket } from 'lucide-react';

const FloatingElements: React.FC = () => {
  const elements = [
    { Icon: Code, color: 'text-blue-400', size: 24, delay: 0 },
    { Icon: Zap, color: 'text-yellow-400', size: 20, delay: 1 },
    { Icon: Star, color: 'text-purple-400', size: 18, delay: 2 },
    { Icon: Heart, color: 'text-pink-400', size: 22, delay: 3 },
    { Icon: Sparkles, color: 'text-cyan-400', size: 16, delay: 4 },
    { Icon: Target, color: 'text-green-400', size: 20, delay: 5 },
    { Icon: Brain, color: 'text-indigo-400', size: 24, delay: 6 },
    { Icon: Rocket, color: 'text-orange-400', size: 18, delay: 7 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.color} opacity-20`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            rotate: 0,
            scale: 0.5
          }}
          animate={{
            y: -100,
            rotate: 360,
            scale: [0.5, 1, 0.5],
            x: Math.random() * window.innerWidth
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: element.delay,
            ease: "linear"
          }}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        >
          <element.Icon size={element.size} />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;