import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Timer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp && onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onTimeUp]);

  const mm = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const ss = (timeLeft % 60).toString().padStart(2, '0');

  const danger = timeLeft <= 10;

  return (
    <motion.div
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ repeat: Infinity, duration: 1.1 }}
      className={[
        'hud-pill',
        'select-none',
        'flex items-center justify-center',
        'min-w-[120px]',
        'bg-black/40 text-white',
        'border border-white/15',
        'shadow-[0_0_30px_rgba(0,255,224,0.25)]',
        danger ? 'ring-2 ring-fuchsia-500/50 shadow-[0_0_30px_rgba(255,0,128,0.35)]' : 'ring-0',
      ].join(' ')}
      title="Countdown"
      aria-live="polite"
    >
      <span className="tabular-nums tracking-widest">
        {mm}:{ss}
      </span>
    </motion.div>
  );
}

export default Timer;
