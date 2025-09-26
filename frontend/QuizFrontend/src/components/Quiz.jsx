import { useState, useEffect } from 'react';
import Timer from './Timer';
import DragDropQuestion from './DragDropQuestion';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import translations from '../i18n/translations';

function Quiz({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  // Safe team info read
  let storedTeamInfo = {};
  try {
    storedTeamInfo = JSON.parse(localStorage.getItem('teamInfo')) || {};
  } catch {
    storedTeamInfo = {};
  }

  const participantId = storedTeamInfo.teamName;
  const teamName = storedTeamInfo.teamName;
  const grade = storedTeamInfo.school;
  const language = storedTeamInfo.language || 'english';
  const school = storedTeamInfo.school;

  const t = translations[language];

  useEffect(() => {
    if (!participantId || !teamName || !grade) {
      navigate('/');
      return;
    }
    const handleVisibilityChange = () => {
      if (document.hidden) alert(t.tabSwitch);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    setStartTime(Date.now());
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [participantId, teamName, grade, navigate, t.tabSwitch]);

  const handleAnswer = (answer) => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    setAnswers((prev) => [
      ...prev,
      { questionId: questions[currentQuestion]?._id, answer, time: timeTaken },
    ]);
    setCurrentQuestion((prev) => prev + 1);
    setStartTime(Date.now());
  };

  const calculateScore = () => {
    let rawScore = 0;
    answers.forEach((ans, index) => {
      if (
        ans.questionId &&
        questions[index]?._id === ans.questionId &&
        ans.answer === questions[index].correctAnswer
      ) {
        rawScore += 3;
        if (ans.time <= 5) rawScore += 1;
      }
    });
    const maxRawScore = 30 * 4; // max points
    return Math.round((rawScore / maxRawScore) * 100);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const score = calculateScore();

    try {
      await axios.post('http://localhost:5000/api/result/submit', {
        participantId,
        teamName,
        grade,
        language,
        school,
        score,
        answers,
      });
      setEmailSent(true);
    } catch (err) {
      alert(err.response?.data?.error || t.failedSubmit);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-submit when done
  useEffect(() => {
    if (currentQuestion >= questions.length && !isSubmitting) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, isSubmitting]);

  const handleTimeUp = () => {
    setCurrentQuestion(questions.length); // Force quiz end
  };

  const renderQuestionWithSymbols = (text) => {
    const symbolMap = {
      '+': <span className="inline-block text-2xl font-bold text-fuchsia-400 animate-bounce">+</span>,
      '-': <span className="inline-block text-2xl font-bold text-fuchsia-400 animate-bounce">-</span>,
      '×': <span className="inline-block text-2xl font-bold text-cyan-300 animate-spin">×</span>,
      '÷': <span className="inline-block text-2xl font-bold text-cyan-300 animate-spin">÷</span>,
      '√': <span className="inline-block text-2xl font-bold text-emerald-300 animate-float">√</span>,
      sin: <span className="inline-block text-2xl font-bold text-emerald-300 animate-float">sin</span>,
      cos: <span className="inline-block text-2xl font-bold text-emerald-300 animate-float">cos</span>,
      '²': <span className="inline-block text-2xl font-bold text-fuchsia-400 animate-bounce">²</span>,
    };
    return text
      .split(/(sin|cos|\+|-|×|÷|√|²)/)
      .map((part, index) => symbolMap[part] || <span key={index}>{part}</span>);
  };

  // Loading / empty state
  if (!questions || !questions.length) {
    return (
      <div className="relative min-h-dvh bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 starfield -z-50" />
        <div className="neon-grid" />
        <div className="flex items-center justify-center min-h-dvh p-6">
          <div className="card-arcade text-center w-full max-w-md">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="animate-pulse">…</span>
            </div>
            <div className="text-white/80">{t.loading}</div>
          </div>
        </div>
      </div>
    );
  }

  // Thank-you (email sent)
  if (emailSent) {
    return (
      <div className="relative min-h-dvh bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 starfield -z-50" />
        <div className="neon-grid" />
        <div className="flex items-center justify-center min-h-dvh p-6">
          <div className="card-arcade w-full max-w-lg text-center">
            <h1 className="text-3xl font-extrabold gradient-heading mb-2">GG! {t.thankYou || 'Thank You!'}</h1>
            <p className="text-white/80">{t.submitted || 'Your results have been submitted successfully.'}</p>
            <p className="mt-4 text-sm text-white/60 italic">
              “Mathematics is the music of reason – keep dancing with numbers!”
            </p>
            <div className="mt-6 hud-pill inline-block">
              {teamName} · G{grade}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Submitting screen
  if (currentQuestion >= questions.length) {
    return (
      <div className="relative min-h-dvh bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 starfield -z-50" />
        <div className="neon-grid" />
        <div className="flex items-center justify-center min-h-dvh p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-arcade w-full max-w-lg text-center"
          >
            <h2 className="text-3xl font-extrabold gradient-heading mb-2">{t.submitting}</h2>
            <p className="text-white/80">
              {t.pleaseWait}{' '}
              {isSubmitting && <span className="animate-pulse">⏳</span>}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Progress percent for HUD bar
  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);

  return (
    <div className="relative min-h-dvh bg-black text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 starfield -z-50" />
      <div className="neon-grid" />

      {/* Top HUD */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="hud-pill">
            {teamName} • G{grade}
          </div>
          <div className="flex items-center gap-2">
            <div className="hud-pill">{t.question} {currentQuestion + 1}/{questions.length}</div>
            <div className="hud-pill">
              <Timer duration={15 * 60} onTimeUp={handleTimeUp} />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-500"
          />
        </div>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-5xl mx-auto px-4 py-6"
      >
        <div className="card-arcade">
          {/* Question prompt */}
          <motion.h2
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl sm:text-2xl font-extrabold mb-4 gradient-heading"
          >
            {t.question} {currentQuestion + 1} {t.of} {questions.length}
          </motion.h2>

          {/* Types */}
          {questions[currentQuestion].type === 'drag' ? (
            <DragDropQuestion
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
            />
          ) : questions[currentQuestion].type === 'mcq' ? (
            <div className="text-center">
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-lg sm:text-xl mb-6 font-semibold text-white/90"
              >
                {renderQuestionWithSymbols(questions[currentQuestion].question)}
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ scale: 0.96, rotate: -2 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(option)}
                    className="btn-arcade w-full py-3"
                  >
                    {renderQuestionWithSymbols(option)}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-lg sm:text-xl mb-6 font-semibold text-white/90"
              >
                {renderQuestionWithSymbols(questions[currentQuestion].question)}
              </motion.p>
              <input
                type="text"
                onBlur={(e) => handleAnswer(e.target.value)}
                placeholder={t.enterAnswer}
                className="w-full max-w-md mx-auto rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              />
              <p className="mt-2 text-xs text-white/50">{t.pressEnter || 'Tip: Type your answer and click outside to confirm.'}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Quiz;
