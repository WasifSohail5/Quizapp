import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * MathChrono — Gaming Competition Themed Login
 * - Neon/arcade visuals, animated background, subtle particles
 * - Keeps your original login logic intact (admin vs participant)
 * - Adds loading state, nicer errors, and playful micro‑interactions
 */
export default function Home() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const { token, isAdmin, participantId, grade } = res.data;
      localStorage.setItem("token", token);
      if (isAdmin) {
        localStorage.setItem("isAdmin", isAdmin);
        navigate("/admin");
      } else {
        localStorage.setItem("participantId", participantId);
        if (grade !== undefined) localStorage.setItem("grade", grade);
        navigate("/team-info", { state: { participantId, grade } });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Motion presets
  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 90, damping: 14 } },
  };

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
      {/* BACKGROUND LAYERS */}
      {/* Starfield dots */}
      <div className="pointer-events-none absolute inset-0 -z-50 [background:radial-gradient(circle_at_50%_30%,rgba(0,255,224,0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,0,128,0.12),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(0,128,255,0.12),transparent_50%)]" />
      {/* Subtle scanlines */}
      <div className="pointer-events-none absolute inset-0 -z-40 opacity-20 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)]" />
      {/* Neon grid floor */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-30 h-[60vh] w-[140vw] -translate-x-1/2 [background-image:linear-gradient(rgba(0,255,224,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,224,0.15)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_top,black,transparent_70%)]" />

      {/* Floating glow orbs */}
      <motion.div {...glowPulse} className="pointer-events-none absolute -top-20 -left-20 -z-20 h-72 w-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,255,224,0.35), transparent 60%)" }} />
      <motion.div {...glowPulse} className="pointer-events-none absolute -bottom-10 -right-10 -z-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,0,128,0.35), transparent 60%)" }} />

      {/* CONTENT WRAPPER */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-10 sm:py-16">
        {/* Header / Title */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Tournament Lobby
          </span>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,224,0.25)]">MathChrono</span>
            <span className="block text-white/90">Arcade Championship</span>
          </h1>
          <p className="mt-3 max-w-2xl text-balance text-sm text-white/70 sm:text-base">
            Log in, claim your squad name, and race the clock. Precision earns points—speed multiplies them.
          </p>
        </motion.div>

        {/* Main panel */}
        <motion.div variants={cardVariants} initial="hidden" animate="show" className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_35px_rgba(0,255,224,0.08)] backdrop-blur">
          {/* Animated corner accents */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-white/60">Email</label>
            <input
              type="email"
              placeholder="player@team.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              required
            />

            <label className="mt-3 block text-xs uppercase tracking-widest text-white/60">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              required
            />

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              type="submit"
              className="group relative mt-2 inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-400 opacity-0 transition group-hover:opacity-100" />
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Entering Arena…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Start Match
                  <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </motion.button>

            {/* Divider */}
            <div className="my-2 flex items-center gap-3 opacity-60">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="text-[10px] uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

            {/* Admin Login */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/admin-login")}
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-emerald-400/40 hover:bg-emerald-400/10"
            >
              Admin Console
            </motion.button>
          </form>

          {/* Tiny helper strip */}
          <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-3 text-[11px] leading-5 text-white/70">
            <div className="mb-1 font-semibold text-white/80">Match Rules</div>
            <ul className="list-disc pl-4">
              <li>One login = one attempt per session.</li>
              <li>Pick your team name on first entry—unique per session.</li>
              <li>Speed boosts your score multiplier. Accuracy keeps it.</li>
            </ul>
          </div>
        </motion.div>

        {/* Footer badges */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Real‑Time Scoring", dot: "bg-emerald-400" },
            { label: "Arcade Mode UI", dot: "bg-fuchsia-400" },
            { label: "Bilingual Play", dot: "bg-cyan-400" },
          ].map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
              <span className={`h-2 w-2 rounded-full ${b.dot}`} /> {b.label}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
