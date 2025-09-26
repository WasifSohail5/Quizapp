import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/admin/leaderboard?grade=${selectedGrade}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!alive) return;
        const rows = Array.isArray(res.data) ? res.data : [];
        rows.sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));
        setLeaderboard(rows);
      } catch {
        if (alive) setLeaderboard([]);
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => { alive = false; };
  }, [selectedGrade]);

  const podium = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="relative min-h-dvh bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-50 starfield" />
      <div className="neon-grid" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="max-w-6xl mx-auto px-4 py-8"
      >
        {/* Title + Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold gradient-heading drop-shadow">
            Leaderboard · Grade {selectedGrade}
          </h2>

          <div className="flex items-center gap-3">
            <span className="hud-pill hidden sm:inline">Filter</span>
            <motion.select
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
              className="rounded-xl border border-white/15 bg-black/40 px-4 py-2 text-sm sm:text-base outline-none text-white focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
            >
              {[6, 7, 8, 9, 10, 11].map((g) => (
                <option key={g} value={g} className="bg-black">
                  Grade {g}
                </option>
              ))}
            </motion.select>
          </div>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <AnimatePresence>
            {podium.length === 0 && !loading ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="card-arcade text-center text-white/70 col-span-full"
              >
                No champions yet.
              </motion.div>
            ) : (
              podium.map((p, i) => (
                <motion.div
                  key={p.rank}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`card-arcade relative text-center ${
                    i === 0 ? 'glow-emerald' : i === 1 ? 'glow-cyan' : 'glow-fuchsia'
                  }`}
                >
                  <div
                    className="absolute inset-0 -z-10 opacity-25"
                    style={{
                      background:
                        i === 0
                          ? 'radial-gradient(circle, rgba(0,255,224,0.22), transparent 60%)'
                          : i === 1
                          ? 'radial-gradient(circle, rgba(0,128,255,0.22), transparent 60%)'
                          : 'radial-gradient(circle, rgba(255,0,128,0.22), transparent 60%)',
                    }}
                  />
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-sm">
                    #{p.rank}
                  </div>
                  <div className="text-lg font-bold">{p.name}</div>
                  <div className="text-2xl font-extrabold text-emerald-300">{p.score}</div>
                  <div className="text-xs text-white/70">{p.timeTaken}s</div>
                  {Array.isArray(p.badges) && p.badges.length > 0 && (
                    <div className="mt-2 text-[11px] text-white/60 truncate">{p.badges.join(', ')}</div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Table -> neon rows */}
        <div className="space-y-2">
          {loading ? (
            <div className="card-arcade text-center text-white/80">
              Loading…
            </div>
          ) : rest.length === 0 && podium.length > 0 ? (
            <div className="card-arcade text-center text-white/60">
              Showing top 3 only.
            </div>
          ) : rest.length === 0 && podium.length === 0 ? (
            <div className="card-arcade text-center text-white/70">
              No results to display.
            </div>
          ) : (
            rest.map((entry, index) => (
              <motion.div
                key={`${entry.rank}-${index}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="row-arcade grid grid-cols-[64px_1fr_auto_96px_auto] max-sm:grid-cols-2 gap-2"
              >
                <div className="text-center font-extrabold">#{entry.rank}</div>
                <div className="truncate">{entry.name}</div>
                <div className="text-right text-emerald-300">{entry.score}</div>
                <div className="text-right text-white/70">{entry.timeTaken}s</div>
                <div className="truncate text-white/60 max-sm:col-span-2">
                  {Array.isArray(entry.badges) ? entry.badges.join(', ') : entry.badges}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Leaderboard;
