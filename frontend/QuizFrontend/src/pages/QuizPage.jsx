import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Quiz from "../components/Quiz";

/**
 * QuizPage — Arcade Championship Theme
 * - Keeps your data flow intact
 * - Adds neon background, animated loading, and styled error state
 */
export default function QuizPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Fallbacks to localStorage if state is missing (on refresh)
  const participantId = state?.participantId || localStorage.getItem("participantId");
  const grade = state?.grade || localStorage.getItem("grade");
  const language = state?.language || localStorage.getItem("language") || "english";
  const teamName = useMemo(() => localStorage.getItem("teamName") || localStorage.getItem("teamInfo") && JSON.parse(localStorage.getItem("teamInfo") || "{}")?.teamName || participantId, [participantId]);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const TOTAL_QUESTIONS = 30;

  useEffect(() => {
    if (!participantId || !grade) {
      setError("Invalid quiz parameters");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchQuestions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:5000/api/quiz?total=${TOTAL_QUESTIONS}&grade=${grade}`);
        if (!res.ok) throw new Error("Failed to fetch quiz questions");
        const data = await res.json();
        if (!cancelled) {
          setQuestions(data.questions);
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Quiz fetch error:", err);
        if (!cancelled) {
          setError("Unable to load quiz questions. Please try again.");
          setLoading(false);
        }
      }
    };

    fetchQuestions();
    return () => { cancelled = true; };
  }, [participantId, grade]);

  const glowPulse = {
    initial: { opacity: 0.6, scale: 0.98 },
    animate: {
      opacity: [0.6, 0.9, 0.6],
      scale: [0.98, 1.02, 0.98],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  if (loading) {
    return (
      <div className="relative min-h-dvh overflow-hidden bg-black text-white">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-50 [background:radial-gradient(circle_at_50%_30%,rgba(0,255,224,0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,0,128,0.12),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(0,128,255,0.12),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 -z-40 opacity-20 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)]" />
        <motion.div {...glowPulse} className="pointer-events-none absolute -top-20 -left-20 -z-20 h-72 w-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,255,224,0.35), transparent 60%)" }} />
        <motion.div {...glowPulse} className="pointer-events-none absolute -bottom-10 -right-10 -z-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,0,128,0.35), transparent 60%)" }} />

        {/* Loading card */}
        <div className="relative mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-3 text-center text-xs uppercase tracking-widest text-white/70">Loading Arena</div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/20">
              <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
            <div className="text-center text-sm text-white/80">Fetching questions for Grade {grade}…</div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-dvh overflow-hidden bg-black text-white">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-50 [background:radial-gradient(circle_at_50%_30%,rgba(0,255,224,0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,0,128,0.12),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(0,128,255,0.12),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 -z-40 opacity-20 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)]" />

        <div className="relative mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-4">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, damping: 16 }} className="w-full max-w-md overflow-hidden rounded-2xl border border-red-400/30 bg-red-500/10 p-6 backdrop-blur">
            <div className="mb-2 text-center text-lg font-extrabold text-red-300">Connection Error</div>
            <p className="text-center text-sm text-red-200">{error}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => navigate(-1)} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:border-emerald-400/40 hover:bg-emerald-400/10">Back</button>
              <button onClick={() => window.location.reload()} className="group relative overflow-hidden rounded-xl bg-fuchsia-500 px-4 py-2 text-sm font-bold text-black">
                <span className="absolute inset-0 -z-10 bg-gradient-to-r from-fuchsia-400 via-emerald-400 to-cyan-400 opacity-0 transition group-hover:opacity-100" />
                Retry
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Ready — render the actual quiz component inside the themed shell (Quiz keeps its own UI)
  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-50 [background:radial-gradient(circle_at_50%_30%,rgba(0,255,224,0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,0,128,0.12),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(0,128,255,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 -z-40 opacity-20 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-30 h-[55vh] w-[140vw] -translate-x-1/2 [background-image:linear-gradient(rgba(0,255,224,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,224,0.15)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_top,black,transparent_70%)]" />

      {/* Top HUD */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
            {teamName || "Player"} — Grade {grade}
          </div>
        </div>
        <button onClick={() => navigate("/")} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 transition hover:border-fuchsia-400/40 hover:bg-fuchsia-400/10">Exit</button>
      </div>

      {/* QUIZ BODY */}
      <div className="mx-auto max-w-6xl px-4 pb-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Quiz participantId={participantId} grade={grade} questions={questions} language={language} />
        </motion.div>
      </div>
    </div>
  );
}
