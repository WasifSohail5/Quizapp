// src/i18n/translations.js
const translations = {
  english: {
    // Quiz UI
    loading: "Loading...",
    question: "Question",
    of: "of",
    submitting: "Submitting your answers...",
    pleaseWait: "Please wait",
    tabSwitch: "Tab switch detected!",
    failedSubmit: "Submit failed",
    enterAnswer: "Enter your answer",

    // Team Info Page
    teamInfo: {
      title: "Enter Team Details",
      teamName: "Team Name",
      language: "Language",
      school: "School",
      startButton: "Let's Start",
      enterTeamNameAlert: "Please enter your team name.",
    },

    // Instructions Page
    instructions: {
      title: "MathChrono Quiz Instructions",
      welcome: "Welcome to the MathChrono Quiz! Please read the instructions carefully before starting:",
      structure: "Quiz Structure",
      structureDetail: (grade) => `30 questions tailored to your grade (Grade ${grade}).`,
      types: "Question Types",
      mcq: "Multiple Choice (MCQ)",
      fill: "Fill in the Blank",
      drag: "Drag and Drop",
      puzzle: "Puzzle",
      scoring: "Scoring",
      score1: "Each correct answer: 3 points",
      score2: "Extra 1 point for answers within 5 seconds",
      score3: "Total score scaled to 100 points",
      timeLimit: "Time Limit: 15 minutes for all 30 questions",
      rules: "Rules",
      rule1: "No Tab Switching",
      rule2: "Single Attempt",
      rule3: "No External Tools",
      rule4: "Ensure stable internet connection",
      navigation: "Navigation: Progress is automatically saved",
      submission: "Submission: Answers auto-submitted when time ends or all questions completed",
      ready: "Get ready to race your mind! Click the button below to start the quiz.",
      startBtn: "Start Quiz",
    },
  },

  malaysian: {
    // Quiz UI
    loading: "Sedang dimuatkan...",
    question: "Soalan",
    of: "daripada",
    submitting: "Menghantar jawapan anda...",
    pleaseWait: "Sila tunggu",
    tabSwitch: "Pertukaran tab dikesan!",
    failedSubmit: "Gagal hantar jawapan",
    enterAnswer: "Masukkan jawapan anda",

    // Team Info Page
    teamInfo: {
      title: "Masukkan Maklumat Pasukan",
      teamName: "Nama Pasukan",
      language: "Bahasa",
      school: "Sekolah",
      startButton: "Mari Mulakan",
      enterTeamNameAlert: "Sila masukkan nama pasukan anda.",
    },

    // Instructions Page
    instructions: {
      title: "Arahan Kuiz MathChrono",
      welcome: "Selamat datang ke Kuiz MathChrono! Sila baca arahan dengan teliti sebelum bermula:",
      structure: "Struktur Kuiz",
      structureDetail: (grade) => `30 soalan mengikut tahap darjah anda (Darjah ${grade}).`,
      types: "Jenis Soalan",
      mcq: "Pilihan Berganda (MCQ)",
      fill: "Isi Tempat Kosong",
      drag: "Seret dan Lepas",
      puzzle: "Teka-teki",
      scoring: "Pemarkahan",
      score1: "Setiap jawapan betul: 3 markah",
      score2: "Tambahan 1 markah untuk jawapan dalam 5 saat",
      score3: "Jumlah markah ditukar kepada 100 markah",
      timeLimit: "Had Masa: 15 minit untuk semua 30 soalan",
      rules: "Peraturan",
      rule1: "Dilarang tukar tab",
      rule2: "Cubaan sekali sahaja",
      rule3: "Tiada Alat Luaran",
      rule4: "Pastikan sambungan internet stabil",
      navigation: "Navigasi: Kemajuan disimpan secara automatik",
      submission: "Penghantaran: Jawapan dihantar automatik bila masa tamat atau semua soalan selesai",
      ready: "Bersedia untuk mencabar minda anda! Klik butang di bawah untuk mulakan kuiz.",
      startBtn: "Mula Kuiz",
    },
  },
};

export default translations;
