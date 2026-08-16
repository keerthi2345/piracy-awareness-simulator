import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Visually simulates the "clicking Watch Now opens a flood of tabs" pattern
 * real piracy sites use. This never calls window.open() — it's a row of
 * styled tab-icon elements animating in with Framer Motion.
 */
export default function TabMultiplyAnimation({ count = 6, onDone }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= count) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisible((v) => v + 1), 180);
    return () => clearTimeout(t);
  }, [visible, count, onDone]);

  return (
    <div className="tab-multiply-row">
      <AnimatePresence>
        {Array.from({ length: visible }).map((_, i) => (
          <motion.div
            key={i}
            className="tab-icon"
            initial={{ opacity: 0, y: -10, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
