import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

/**
 * Player Login — Arcade Championship Theme
 * - Matches neon/starfield/grid used across app
 * - Keeps your existing auth logic
 */
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      if (res.data.isAdmin) {
        setError("Use admin login for admin access");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", res.data.isAdmin);
      navigate("/team-info", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
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
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      {/* BACKGROUND LAYERS */}
      <div className="pointer-events-none absolute inset-0 -z-50 [background:radial-gradient(circle_at_50%_30%,rgba(0,255,224,0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,0,128,0.12),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(0,128,255,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 -z-40 opacity-20 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-30 h-[60vh] w-[140vw] -translate-x-1/2 [background-image:linear-gradient(rgba(0,255,224,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,224,0.15)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_top,black,transparent_70%)]" />

      <motion.div {...glowPulse} className="pointer-events-none absolute -top-20 -left-20 -z-20 h-72 w-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,255,224,0.35), transparent 60%)" }} />
      <motion.div {...glowPulse} className="pointer-events-none absolute -bottom-10 -right-10 -z-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,0,128,0.35), transparent 60%)" }} />

      {/* CONTENT */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-10 sm:py-16">
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            Player Login
          </span>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,224,0.25)]">Enter the Arena</span>
          </h1>
          <p className="mt-3 max-w-2xl text-balance text-sm text-white/70 sm:text-base">
            Sign in to join the arcade championship—speed and accuracy decide the crown.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: "spring", stiffness: 120 }} className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_35px_rgba(0,128,255,0.12)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-cyan-300" />
              <input
                type="email"
                placeholder="player@team.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-11 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </div>

            <div className="relative">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-cyan-300" />
              <input
                type="password"
                placeholder="Access code"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-11 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </div>

            <motion.button whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }} disabled={loading} type="submit" className="group relative mt-1 inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-black transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-70">
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-400 opacity-0 transition group-hover:opacity-100" />
              {loading ? (
                "Entering…"
              ) : (
                <>
                  <FiLogIn className="mr-2 text-base" /> Join the Battle
                </>
              )}
            </motion.button>
          </form>

          {/* Admin link */}
          <div className="mt-4 text-center text-sm text-white/80">
            Overlord? {" "}
            <button onClick={() => navigate("/admin-login")} className="font-semibold text-cyan-300 underline-offset-4 transition hover:text-cyan-200 hover:underline">
              Access Control Panel
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
