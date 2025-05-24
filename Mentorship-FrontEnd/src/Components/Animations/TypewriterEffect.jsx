import React from 'react';
import { motion } from 'framer-motion';

const sentence = "Welcome to the Future of Web!";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // <-- Delay between letters
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: `0.25em` },
  visible: {
    opacity: 1,
    y: `0em`,
    transition: {
      duration: 0.3,
    },
  },
};

export default function TypewriterEffect() {
  return (
    <motion.h1
      className="text-4xl font-bold font-mono text-center mt-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap' }}
    >
      {sentence.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          style={{ display: 'inline-block' }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
