import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';
import { useInViewOnce } from '@/hooks/useInViewOnce';

type Props = React.PropsWithChildren<{ delay?: number; y?: number; className?: string }>;

export default function Reveal({ children, delay = 0.05, y = 18, className }: Props) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      animate={inView ? { opacity: 1, y: 0 } : { }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}