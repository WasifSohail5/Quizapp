import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Leaderboard — Arcade Championship Theme
 * - Neon grid background, glow orbs
 * - Animated podium for Top 3 + list for the rest
 * - Grade filter & CSV export actions
 */
export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openGradeMenu, setOpenGradeMenu] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(""); // "" = All Grades
  const navigate = useNavigate();

  const token = useMemo(() => localStorage.getItem("token"), []);

  const glowPulse = {
    initial: { opacity: 0.6, scale: 0.98 },
    animate: {
      opacity: [0.6, 0.9, 0.6],
      scale: [0.98, 1.02, 0.98],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        if (!token) throw new Error("No token");
        setLoading(true);
        setError(null);
        const q = selectedGrade ? `?grade=${selectedGrade}` : "";
        const res = await axios.get(`/api/admin/leaderboard${q}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Normalize expected fields: rank, name, score, timeTaken, badges
        const rows = Array.isArray(res.data) ? res.data : [];
        // Ensure rank order
        rows.sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));
        setLeaderboard(rows);
      } catch (err) {
        console.error("Leaderboard error:", err?.response?.data || err?.message);
        setError(err?.response?.data?.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedGrade, token]);

  const handleExportGrade = async (grade) => {
    try {
      if (!token) throw new Error("No token");
      const res = await axios.get(`/api/admin/export/grade/${grade}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `leaderboard_grade_${grade}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => alert("Download completed!"), 400);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export. Check console for details.");
    }
  };

  const grades = [6, 7, 8, 9, 10, 11];

  // Split into podium + rest
  const podium = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-50 [background:radial-gradient(circle_at_50%_30%,rgba(0,255,224,0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,0,128,0.12),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(0,128,255,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 -z-40 opacity-20 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-30 h-[60vh] w-[140vw] -translate-x-1/2 [background-image:linear-gradient(rgba(0,255,224,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,224,0.15)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_top,black,transparent_70%)]" />

      <motion.div {...glowPulse} className="pointer-events-none absolute -top-20 -left-20 -z-20 h-72 w-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,255,224,0.35), transparent 60%)" }} />
      <motion.div {...glowPulse} className="pointer-events-none absolute -bottom-10 -right-10 -z-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,0,128,0.35), transparent 60%)" }} />

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Arena Rankings
          </span>
          <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,255,224,0.25)]">Leaderboard Glory</span>
          </h2>
        </motion.div>

        {/* Controls */}
        <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="relative">
            <button onClick={() => setOpenGradeMenu((o) => !o)} className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-emerald-400/40 hover:bg-emerald-400/10">
              {selectedGrade ? `Grade ${selectedGrade}` : "All Grades"}
              <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openGradeMenu && (
              <div className="absolute z-10 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-black/80 p-1 shadow-xl backdrop-blur">
                <button onClick={() => { setSelectedGrade(""); setOpenGradeMenu(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white/90 hover:bg-white/10">All Grades</button>
                {grades.map((g) => (
                  <button key={g} onClick={() => { setSelectedGrade(String(g)); setOpenGradeMenu(false); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white/90 hover:bg-white/10">Grade {g}</button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {grades.map((g) => (
              <motion.button key={g} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={() => handleExportGrade(g)} className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 backdrop-blur transition hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10">
                Export Grade {g}
                <motion.span className="ml-2" animate={{ rotate: [0, 360] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  ↻
                </motion.span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Loading / Error / Empty States */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/80">
            Loading rankings…
          </motion.div>
        )}

        {!loading && error && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 1, opacity: 1 }} className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-center text-red-200">
            {error}
          </motion.div>
        )}

        {!loading && !error && leaderboard.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/80">
            No champions yet!
          </motion.div>
        )}

        {/* Podium */}
        {!loading && !error && leaderboard.length > 0 && (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {podium.map((p, i) => (
                <motion.div key={p.rank} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }} className={`relative overflow-hidden rounded-2xl border bg-white/5 p-5 text-center backdrop-blur ${i === 0 ? "border-emerald-400/40 shadow-[0_0_30px_rgba(0,255,224,0.15)]" : i === 1 ? "border-cyan-400/30" : "border-fuchsia-400/30"}`}>
                  <div className="absolute inset-0 -z-10 opacity-30" style={{ background: i === 0 ? "radial-gradient(circle, rgba(0,255,224,0.25), transparent 60%)" : i === 1 ? "radial-gradient(circle, rgba(0,128,255,0.25), transparent 60%)" : "radial-gradient(circle, rgba(255,0,128,0.25), transparent 60%)" }} />
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-sm">#{p.rank}</div>
                  <div className="text-lg font-bold text-white/90">{p.name}</div>
                  <div className="text-2xl font-extrabold text-emerald-300">{p.score}</div>
                  <div className="text-xs text-white/70">{p.timeTaken}s</div>
                  {Array.isArray(p.badges) && p.badges.length > 0 && (
                    <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} src={`/assets/${p.badges[0]}.jpg`} alt="badge" className="mx-auto mt-2 h-14 w-auto object-contain" onError={(e) => { e.currentTarget.src = "/assets/1stprize.jpg"; }} />
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Rest of the board */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-3">
              {rest.map((entry, idx) => (
                <motion.div key={`${entry.rank}-${idx}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }} className="grid grid-cols-[60px_1fr_auto_100px] items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur max-sm:grid-cols-2">
                  <div className="text-center text-lg font-extrabold text-white/90">#{entry.rank}</div>
                  <div className="truncate text-white/85">{entry.name}</div>
                  <div className="text-right text-emerald-300">{entry.score}</div>
                  <div className="text-right text-white/70">{entry.timeTaken}s</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Back */}
            <div className="mt-8 flex justify-center">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/")} className="group inline-flex items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10">
                Back to Home
                <svg className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
