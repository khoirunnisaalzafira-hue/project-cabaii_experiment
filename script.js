/**
 * WARUNG CABAI NUSANTARA - INTERACTIVE JAVASCRIPT
 * Menghadirkan fitur interaktif yang asik, ceria, dan mudah dipahami!
 */

// ==========================================
// 1. WEB AUDIO API SYNTHESIZER (NO EXTERNAL MP3)
// ==========================================
class SoundFX {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {
      // Audio might be blocked until user interacts
    }
  }

  playSizzle() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      // White noise buffer for sizzling sound
      const bufferSize = this.audioCtx.sampleRate * 0.25;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2500;

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(this.audioCtx.currentTime + idx * 0.08);
        osc.stop(this.audioCtx.currentTime + idx * 0.08 + 0.2);
      });
    } catch (e) {}
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

const sfx = new SoundFX();

// ==========================================
// 2. PARTICLES POPPER ON CLICK
// ==========================================
function spawnChiliParticle(x, y) {
  const emojis = ['🌶️', '🔥', '✨', '🫑', '💥', '🥵'];
  const particle = document.createElement('div');
  particle.className = 'click-particle';
  particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  // random slight rotation and spread
  const randomOffsetX = (Math.random() - 0.5) * 40;
  particle.style.transform = `translate(${randomOffsetX}px, 0)`;

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 950);
}

document.addEventListener('click', (e) => {
  // spawn particle on interactive clicks
  if (e.target.closest('button, a, .checklist-item, .preset-chip, .fact-card, .btn-counter, .quiz-opt-btn')) {
    spawnChiliParticle(e.clientX, e.clientY);
  }
});

// ==========================================
// 3. THEME TOGGLE & GLOBAL CONTROLS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle (Dark / Light)
  const themeBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('warungCabaiTheme');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('spicy-dark');
    if (themeBtn) themeBtn.textContent = '☀️';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      sfx.playPop();
      document.body.classList.toggle('spicy-dark');
      const isDark = document.body.classList.contains('spicy-dark');
      themeBtn.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('warungCabaiTheme', isDark ? 'dark' : 'light');
    });
  }

  // Sound FX Toggle
  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = !sfx.toggle();
      soundBtn.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) sfx.playPop();
    });
  }

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      sfx.playPop();
      navMenu.classList.toggle('open');
    });
  }

  // Initialize Page Specific Features
  initScovilleMeter();
  initRecipeChecklists();
  initPortionCalculator();
  initFactCards();
  initHijauQuiz();
});

// ==========================================
// 4. SCOVILLE HEAT SIMULATOR (Cabai Rawit)
// ==========================================
function initScovilleMeter() {
  const rangeInput = document.getElementById('scovilleRange');
  if (!rangeInput) return;

  const emojiElem = document.getElementById('scovilleEmoji');
  const ratingElem = document.getElementById('scovilleRating');
  const captionElem = document.getElementById('scovilleCaption');
  const adviceElem = document.getElementById('scovilleAdvice');
  const shuNumberElem = document.getElementById('shuNumber');
  const presetChips = document.querySelectorAll('.preset-chip');

  const levels = [
    {
      max: 20000,
      emoji: '😊',
      title: 'Level 1: Masih Manis Lucu',
      caption: 'Bocah TK juga bisa makan ini tanpa kedip.',
      advice: 'Pencegah pedas: Cukup seduh teh hangat tawar.',
      glow: 'rgba(34, 197, 94, 0.2)'
    },
    {
      max: 40000,
      emoji: '😅',
      title: 'Level 2: Keringat Tipis',
      caption: 'Mulai kerasa gigitannya di ujung lidah. Hidung mulai kembang kempis.',
      advice: 'Pencegah pedas: Siapin es teh manis jumbo!',
      glow: 'rgba(245, 158, 11, 0.25)'
    },
    {
      max: 65000,
      emoji: '🥵',
      title: 'Level 3: Bibir Jontor Merona',
      caption: 'Ini dia rawit merah matang! Napas mulai megap-megap.',
      advice: 'Pencegah pedas: Minum susu sapi murni atau sendok madu!',
      glow: 'rgba(239, 68, 68, 0.3)'
    },
    {
      max: 85000,
      emoji: '🔥',
      title: 'Level 4: Lidah Terbakar Lahar',
      caption: 'Keringat ngucur kayak abis maraton. Suara serak gak karuan!',
      advice: 'Pencegah pedas: Ambil es batu, tempel di bibir sekarang!',
      glow: 'rgba(220, 38, 38, 0.4)'
    },
    {
      max: 120000,
      emoji: '💀',
      title: 'Level 5: Ampun Bang Jago (Rawit Domba / Habanero)',
      caption: 'Bukan sekadar pedas, ini sudah teleportasi ke dimensi lain!',
      advice: 'Pencegah pedas: Istighfar, minum susu beruang, jangan gosok mata!',
      glow: 'rgba(153, 27, 27, 0.55)'
    }
  ];

  function updateScoville(shuValue, playAudio = true) {
    if (shuNumberElem) shuNumberElem.textContent = `${Number(shuValue).toLocaleString('id-ID')} SHU`;

    // find appropriate level
    const current = levels.find(lvl => shuValue <= lvl.max) || levels[levels.length - 1];

    if (emojiElem) {
      emojiElem.textContent = current.emoji;
      emojiElem.style.transform = 'scale(1.25)';
      setTimeout(() => emojiElem.style.transform = 'scale(1)', 200);
    }
    if (ratingElem) ratingElem.textContent = current.title;
    if (captionElem) captionElem.textContent = current.caption;
    if (adviceElem) adviceElem.textContent = current.advice;

    const displayBox = document.querySelector('.scoville-display');
    if (displayBox) {
      displayBox.style.boxShadow = `0 0 30px ${current.glow}`;
    }

    if (playAudio) sfx.playSizzle();
  }

  rangeInput.addEventListener('input', (e) => {
    updateScoville(e.target.value, false);
    // highlight active chip if any
    presetChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.shu === e.target.value);
    });
  });

  rangeInput.addEventListener('change', (e) => {
    updateScoville(e.target.value, true);
  });

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const val = chip.dataset.shu;
      rangeInput.value = val;
      updateScoville(val, true);
    });
  });

  // initial load
  updateScoville(rangeInput.value, false);
}

// ==========================================
// 5. RESEP CHECKLIST & COOKING TIMER
// ==========================================
function initRecipeChecklists() {
  const checklistItems = document.querySelectorAll('.checklist-item');
  if (!checklistItems.length) return;

  const pageId = window.location.pathname.split('/').pop() || 'index.html';
  const storageKey = `cabai_recipe_${pageId}`;

  // load saved progress
  let savedState = [];
  try {
    savedState = JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (e) {
    savedState = [];
  }

  checklistItems.forEach((item, index) => {
    if (savedState.includes(index)) {
      item.classList.add('done');
    }

    item.addEventListener('click', () => {
      item.classList.toggle('done');
      if (item.classList.contains('done')) {
        sfx.playPop();
      } else {
        sfx.playSizzle();
      }
      saveRecipeProgress();
      updateProgressBar();
    });
  });

  function saveRecipeProgress() {
    const checkedIndexes = [];
    checklistItems.forEach((item, idx) => {
      if (item.classList.contains('done')) checkedIndexes.push(idx);
    });
    localStorage.setItem(storageKey, JSON.stringify(checkedIndexes));
  }

  function updateProgressBar() {
    const total = checklistItems.length;
    const doneCount = document.querySelectorAll('.checklist-item.done').length;
    const percent = Math.round((doneCount / total) * 100);

    const fillElem = document.getElementById('recipeProgressFill');
    const labelElem = document.getElementById('recipeProgressText');

    if (fillElem) fillElem.style.width = `${percent}%`;
    if (labelElem) {
      if (percent === 100) {
        labelElem.innerHTML = `🎉 Selesai 100%! Siap disajikan!`;
        sfx.playSuccess();
      } else {
        labelElem.textContent = `Progress Masak: ${percent}% (${doneCount}/${total} langkah)`;
      }
    }
  }

  updateProgressBar();

  // Reset checklist button
  const resetBtn = document.getElementById('resetChecklistBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      checklistItems.forEach(i => i.classList.remove('done'));
      localStorage.removeItem(storageKey);
      updateProgressBar();
      sfx.playPop();
    });
  }
}

// ==========================================
// 6. PORTION CALCULATOR (Cabai Merah)
// ==========================================
function initPortionCalculator() {
  const portionValElem = document.getElementById('portionValue');
  if (!portionValElem) return;

  const btnMinus = document.getElementById('btnMinusPortion');
  const btnPlus = document.getElementById('btnPlusPortion');
  const dishSelect = document.getElementById('dishTypeSelect');

  let currentPortion = 4;

  const dishes = {
    balado: {
      name: 'Sambal Balado Padang',
      merahKeriting: 40, // gram per porsi
      merahBesar: 20,
      bawangMerah: 2,  // butir per porsi
      bawangPutih: 1,
      minyak: 1.5      // sdm per porsi
    },
    rendang: {
      name: 'Bumbu Rendang Sapi',
      merahKeriting: 50,
      merahBesar: 25,
      bawangMerah: 3,
      bawangPutih: 1.5,
      minyak: 1
    },
    rica: {
      name: 'Ayam Rica-Rica Merah',
      merahKeriting: 45,
      merahBesar: 15,
      bawangMerah: 2.5,
      bawangPutih: 2,
      minyak: 2
    }
  };

  function recalculate() {
    if (portionValElem) portionValElem.textContent = currentPortion;
    const dishKey = dishSelect ? dishSelect.value : 'balado';
    const recipe = dishes[dishKey] || dishes.balado;

    const totalKeriting = currentPortion * recipe.merahKeriting;
    const totalBesar = currentPortion * recipe.merahBesar;
    const totalBawangMerah = Math.round(currentPortion * recipe.bawangMerah);
    const totalBawangPutih = Math.round(currentPortion * recipe.bawangPutih);
    const totalMinyak = (currentPortion * recipe.minyak).toFixed(1);

    const resKeriting = document.getElementById('resKeriting');
    const resBesar = document.getElementById('resBesar');
    const resBawang = document.getElementById('resBawang');
    const resMinyak = document.getElementById('resMinyak');
    const dishNameElem = document.getElementById('currentDishName');

    if (resKeriting) resKeriting.textContent = `${totalKeriting} gram (~${Math.round(totalKeriting / 6)} buah)`;
    if (resBesar) resBesar.textContent = `${totalBesar} gram (~${Math.round(totalBesar / 15)} buah)`;
    if (resBawang) resBawang.textContent = `${totalBawangMerah} butir Merah & ${totalBawangPutih} siung Putih`;
    if (resMinyak) resMinyak.textContent = `${totalMinyak} Sendok Makan`;
    if (dishNameElem) dishNameElem.textContent = recipe.name;
  }

  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      if (currentPortion > 1) {
        currentPortion--;
        sfx.playPop();
        recalculate();
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      if (currentPortion < 50) {
        currentPortion++;
        sfx.playPop();
        recalculate();
      }
    });
  }

  if (dishSelect) {
    dishSelect.addEventListener('change', () => {
      sfx.playSizzle();
      recalculate();
    });
  }

  recalculate();
}

// ==========================================
// 7. MITOS VS FAKTA CARDS
// ==========================================
function initFactCards() {
  const cards = document.querySelectorAll('.fact-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      sfx.playPop();
      card.classList.toggle('flipped');
      const hint = card.querySelector('.fact-click-hint');
      if (hint) {
        hint.textContent = card.classList.contains('flipped') ? '👆 Klik untuk tutup' : '👆 Klik untuk baca penjelasannya';
      }
    });
  });
}

// ==========================================
// 8. KUIS PENIKMAT CABAI HIJAU
// ==========================================
function initHijauQuiz() {
  const quizForm = document.getElementById('hijauQuizContainer');
  if (!quizForm) return;

  const optButtons = document.querySelectorAll('.quiz-opt-btn');
  const resultCard = document.getElementById('quizResultCard');
  const scoreElem = document.getElementById('quizScoreNumber');
  const titleElem = document.getElementById('quizResultTitle');
  const descElem = document.getElementById('quizResultDesc');
  const resetQuizBtn = document.getElementById('resetQuizBtn');

  let answers = { q1: null, q2: null, q3: null };

  const correctAnswers = {
    q1: 'A', // Kenapa hijau? Belum matang sempurna
    q2: 'A', // Trik agar tidak pahit/hitam? Jeruk nipis & minyak panas
    q3: 'B'  // Tingkat pedas? Lebih ramah & gurih
  };

  optButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const qGroup = btn.dataset.question;
      const val = btn.dataset.val;

      // deselect other options in same question
      document.querySelectorAll(`.quiz-opt-btn[data-question="${qGroup}"]`).forEach(b => {
        b.classList.remove('selected', 'correct', 'wrong');
      });

      btn.classList.add('selected');
      answers[qGroup] = val;
      sfx.playPop();

      // Check if all 3 questions answered
      if (answers.q1 && answers.q2 && answers.q3) {
        evaluateQuiz();
      }
    });
  });

  function evaluateQuiz() {
    let score = 0;
    for (const q in answers) {
      const isCorrect = answers[q] === correctAnswers[q];
      const selectedBtn = document.querySelector(`.quiz-opt-btn[data-question="${q}"][data-val="${answers[q]}"]`);
      if (selectedBtn) {
        if (isCorrect) {
          selectedBtn.classList.add('correct');
          score++;
        } else {
          selectedBtn.classList.add('wrong');
        }
      }
    }

    if (resultCard) {
      resultCard.style.display = 'block';
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (scoreElem) scoreElem.textContent = `${score}/3`;

    if (score === 3) {
      sfx.playSuccess();
      if (titleElem) titleElem.textContent = '🏆 Gelar: Duta Besar Sambal Ijo Padang!';
      if (descElem) descElem.textContent = 'Luar biasa! Pengetahuan kulinermu soal cabai hijau sempurna. Beli nasi bungkus auto minta kuah ijo melimpah!';
    } else if (score === 2) {
      sfx.playSizzle();
      if (titleElem) titleElem.textContent = '🥈 Gelar: Juragan Nasi Kapau Magang';
      if (descElem) descElem.textContent = 'Bagus banget! Sedikit lagi paham seluk-beluk sambal ijo sejati!';
    } else {
      sfx.playPop();
      if (titleElem) titleElem.textContent = '🌱 Gelar: Pemula Pecinta Sambal';
      if (descElem) descElem.textContent = 'Gak apa-apa, yang penting nafsu makanmu tetap membara! Yuk coba baca lagi tipsnya di atas!';
    }
  }

  if (resetQuizBtn) {
    resetQuizBtn.addEventListener('click', () => {
      answers = { q1: null, q2: null, q3: null };
      optButtons.forEach(btn => btn.classList.remove('selected', 'correct', 'wrong'));
      if (resultCard) resultCard.style.display = 'none';
      sfx.playPop();
    });
  }
}
