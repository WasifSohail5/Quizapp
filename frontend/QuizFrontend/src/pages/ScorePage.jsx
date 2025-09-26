import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Score Page — Arcade Championship Theme
 * Shows the player's score with neon HUD vibes.
 */
export default function ScorePage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const score = params.get("score");

  if (!score) {
    navigate("/");
    return null;
  }

  const glowPulse = {
    initial: { opacity: 0.6, scale: 0.98 },
    animate: {
      opacity: [0.6, 0.9, 0.6],
      scale: [0.98, 1.02, 0.98],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-50 [background:radial-gradient(circle_at_50%_30%,rgba(0,255,224,0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,0,128,0.12),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(0,128,255,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 -z-40 opacity-20 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)]" />
      <motion.div {...glowPulse} className="pointer-events-none absolute -top-20 -left-20 -z-20 h-72 w-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,255,224,0.35), transparent 60%)" }} />
      <motion.div {...glowPulse} className="pointer-events-none absolute -bottom-10 -right-10 -z-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,0,128,0.35), transparent 60%)" }} />

      {/* CONTENT */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
        <h2 className="mb-6 text-4xl font-extrabold text-emerald-300 drop-shadow-[0_0_20px_rgba(0,255,224,0.35)] sm:text-5xl">
          Quiz Completed!
        </h2>
        <p className="mb-8 text-3xl font-bold text-fuchsia-300 drop-shadow-[0_0_15px_rgba(255,0,128,0.35)]">
          Your Score: {score} / 100
        </p>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/")} className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-emerald-400/90 px-6 py-4 text-lg font-bold text-black transition focus:outline-none">
          <span className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-400 opacity-0 transition group-hover:opacity-100" />
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}