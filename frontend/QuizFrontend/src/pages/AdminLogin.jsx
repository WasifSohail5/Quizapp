import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Admin Login — Gaming Competition Theme
 * - Neon tournament console vibe
 * - Consistent with player login theme
 */
export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      if (!res.data.isAdmin) {
        setError("Admin access required");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", res.data.isAdmin);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
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
    <div className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-black text-white px-4">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-50 [background:radial-gradient(circle_at_50%_30%,rgba(0,255,224,0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,0,128,0.12),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(0,128,255,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 -z-40 opacity-20 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)]" />

      <motion.div {...glowPulse} className="pointer-events-none absolute -top-20 -left-20 -z-20 h-72 w-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,255,224,0.35), transparent 60%)" }} />
      <motion.div {...glowPulse} className="pointer-events-none absolute -bottom-10 -right-10 -z-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,0,128,0.35), transparent 60%)" }} />

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, type: "spring" }} className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_35px_rgba(255,0,128,0.1)] backdrop-blur">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>

        <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6 text-center text-3xl font-extrabold">
          <span className="bg-gradient-to-r from-fuchsia-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,0,128,0.25)]">Admin Console</span>
        </motion.h1>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs uppercase tracking-widest text-white/60">Email</label>
          <input
            type="email"
            placeholder="admin@arena.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-fuchsia-400/60 focus:ring-2 focus:ring-fuchsia-400/20"
            required
          />

          <label className="block text-xs uppercase tracking-widest text-white/60">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-fuchsia-400/60 focus:ring-2 focus:ring-fuchsia-400/20"
            required
          />

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
            type="submit"
            className="group relative mt-2 inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-fuchsia-500 px-4 py-3 text-sm font-bold text-black transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-fuchsia-400 via-emerald-400 to-cyan-400 opacity-0 transition group-hover:opacity-100" />
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Checking Access…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                Enter Console
                <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </motion.button>
        </form>

        <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-3 text-[11px] leading-5 text-white/70">
          <div className="mb-1 font-semibold text-white/80">Admin Rules</div>
          <ul className="list-disc pl-4">
            <li>Only authorized referees can enter.</li>
            <li>Monitor team progress and leaderboard integrity.</li>
            <li>Manage quiz content and results securely.</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
