import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import translations from "../i18n/translations";

/**
 * Instructions — Arcade Championship Theme
 * Matches the neon/tournament style used in Home and AdminLogin.
 */
export default function Instructions() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const storedTeamInfo = (() => {
    try {
      return JSON.parse(localStorage.getItem("teamInfo"));
    } catch {
      return null;
    }
  })();

  const participantId = state?.participantId || storedTeamInfo?.teamName;
  const grade = state?.grade || storedTeamInfo?.school; // keeping your original mapping
  const language = state?.language || storedTeamInfo?.language || "english";
  const school = state?.school || storedTeamInfo?.school;

  useEffect(() => {
    if (!participantId || !grade) navigate("/");
  }, [participantId, grade, navigate]);

  if (!participantId || !grade) return null;

  const t = translations[language].instructions;

  const handleProceed = () => {
    localStorage.setItem("participantId", participantId);
    localStorage.setItem("grade", grade);
    localStorage.setItem("language", language);
    localStorage.setItem("school", school);
    navigate("/quiz", { state: { participantId, grade, language, school } });
  };

  const glowPulse = {
    initial: { opacity: 0.6, scale: 0.98 },
    animate: {
      opacity: [0.6, 0.9, 0.6],
      scale: [0.98, 1.02, 0.98],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 90, damping: 14 } },
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      {/* BACKGROUND LAYERS */}
      <div className="pointer-events-none absolute inset-0 -z-50 [background:radial-gradient(circle_at_50%_30%,rgba(0,255,224,0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,0,128,0.12),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(0,128,255,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 -z-40 opacity-20 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-30 h-[55vh] w-[140vw] -translate-x-1/2 [background-image:linear-gradient(rgba(0,255,224,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,224,0.15)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_top,black,transparent_70%)]" />

      <motion.div {...glowPulse} className="pointer-events-none absolute -top-20 -left-20 -z-20 h-72 w-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,255,224,0.35), transparent 60%)" }} />
      <motion.div {...glowPulse} className="pointer-events-none absolute -bottom-10 -right-10 -z-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,0,128,0.35), transparent 60%)" }} />

      {/* CONTENT */}
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-10 sm:py-14">
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="mb-6 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-white/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Pre‑Match Briefing
          </span>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">{t.title}</span>
          </h1>
          <p className="mt-3 text-sm text-white/70 sm:text-base">{t.welcome}</p>
        </motion.div>

        {/* Card */}
        <motion.div variants={cardVariants} initial="hidden" animate="show" className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_35px_rgba(0,255,224,0.08)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
          </div>

          <div className="space-y-4 text-sm text-white/85 sm:text-base">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-emerald-300">{t.structure}</strong>: {t.structureDetail(grade)}
              </li>
              <li>
                <strong className="text-emerald-300">{t.types}</strong>:
                <ul className="mt-1 list-disc space-y-1 pl-5 text-white/80">
                  <li>{t.mcq}</li>
                  <li>{t.fill}</li>
                  <li>{t.drag}</li>
                  <li>{t.puzzle}</li>
                </ul>
              </li>
              <li>
                <strong className="text-emerald-300">{t.scoring}</strong>:
                <ul className="mt-1 list-disc space-y-1 pl-5 text-white/80">
                  <li>{t.score1}</li>
                  <li>{t.score2}</li>
                  <li>{t.score3}</li>
                </ul>
              </li>
              <li>{t.timeLimit}</li>
              <li>
                <strong className="text-emerald-300">{t.rules}</strong>:
                <ul className="mt-1 list-disc space-y-1 pl-5 text-white/80">
                  <li>{t.rule1}</li>
                  <li>{t.rule2}</li>
                  <li>{t.rule3}</li>
                  <li>{t.rule4}</li>
                </ul>
              </li>
              <li>{t.navigation}</li>
              <li>{t.submission}</li>
            </ul>

            {/* Badges */}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                "Time‑Boost Scoring",
                "Anti‑Cheat Enabled",
                "Multilingual Arena",
              ].map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/80">
                  <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-emerald-400" : i === 1 ? "bg-fuchsia-400" : "bg-cyan-400"}`} /> {b}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Proceed */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleProceed} className="group mt-6 inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition">
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-400 opacity-0 transition group-hover:opacity-100" />
            {t.startBtn}
            <FiArrowRight className="ml-2 transition group-hover:translate-x-0.5" />
          </motion.button>

          {/* Helper */}
          <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-3 text-[11px] leading-5 text-white/70">
            <div className="mb-1 font-semibold text-white/80">Tips</div>
            <ul className="list-disc pl-4">
              <li>Accuracy locks your score; speed multiplies it.</li>
              <li>Use the same browser tab; back/refresh may end your run.</li>
              <li>Make sure audio is allowed if puzzles include sound cues.</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
