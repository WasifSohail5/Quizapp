import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Team Info Page — Arcade Championship Theme
 * Collects team name, language, and school with neon UI.
 */
export default function TeamInfoPage() {
  const [teamName, setTeamName] = useState("");
  const [language, setLanguage] = useState("english");
  const [school, setSchool] = useState("chinese");
  const navigate = useNavigate();

  const handleStart = () => {
    if (!teamName.trim()) {
      alert("Please enter your team name.");
      return;
    }
    const teamInfo = { teamName, language, school };
    localStorage.setItem("teamInfo", JSON.stringify(teamInfo));
    navigate("/instructions");
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
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-50 [background:radial-gradient(circle_at_50%_30%,rgba(0,255,224,0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,0,128,0.12),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(0,128,255,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 -z-40 opacity-20 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-30 h-[60vh] w-[140vw] -translate-x-1/2 [background-image:linear-gradient(rgba(0,255,224,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,224,0.15)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_top,black,transparent_70%)]" />

      <motion.div {...glowPulse} className="pointer-events-none absolute -top-20 -left-20 -z-20 h-72 w-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,255,224,0.35), transparent 60%)" }} />
      <motion.div {...glowPulse} className="pointer-events-none absolute -bottom-10 -right-10 -z-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,0,128,0.35), transparent 60%)" }} />

      {/* CONTENT */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-4 py-12">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: "spring", stiffness: 120 }} className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_0_35px_rgba(0,128,255,0.12)] backdrop-blur">
          <h2 className="mb-6 text-center text-3xl font-extrabold text-emerald-300 drop-shadow-[0_0_20px_rgba(0,255,224,0.35)]">
            Enter Team Details
          </h2>

          <div className="space-y-5">
            {/* Team Name */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-white/80">Team Name</label>
              <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2 text-sm text-white placeholder-white/30 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20" placeholder="Enter your team name" />
            </div>

            {/* Language */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-white/80">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20">
                <option value="english">English</option>
                <option value="malaysian">Malaysian</option>
              </select>
            </div>

            {/* School */}
            <div>
              <label className="mb-1 block text-sm font-semibold text-white/80">School</label>
              <select value={school} onChange={(e) => setSchool(e.target.value)} className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2 text-sm text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20">
                <option value="chinese">Chinese</option>
                <option value="public">Public</option>
              </select>
            </div>

            {/* Start Button */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleStart} className="group relative mt-2 inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-black transition focus:outline-none">
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-400 opacity-0 transition group-hover:opacity-100" />
              Let's Start
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}