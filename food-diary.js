/* ============================================
   NUTRITIVE HARMONY — FOOD DIARY
   3-day food diary with autosave and Google Sheets submission
   ============================================ */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdnnFn4Qf38CZoJnbCbTm1RkosBJtFQKqDhJSpBI2GU636H_Ga8Huf3lJA1BRXZs31_g/exec';

const STORAGE_KEY = 'nh_diary_progress';

// ============================================
// FORM DEFINITION — 1 intro + 3 days × 3 pages + 1 final
// ============================================

function buildDayPages(dayNum) {
  return [
    // === MEALS PAGE for this day ===
    {
      title: `Day ${dayNum} — what you ate`,
      description: 'For each meal: what you ate (in your own words — no need for measurements), time, mood/energy and fullness after.',
      questions: [
        { id: `d${dayNum}_breakfast_food`, type: 'textarea', label: 'Breakfast — what did you eat?' },
        { id: `d${dayNum}_breakfast_time`, type: 'time', label: 'Breakfast — time' },
        { id: `d${dayNum}_breakfast_portion`, type: 'select', label: 'Portion size',
          options: ['Small', 'Medium', 'Large', 'Skipped'] },
        { id: `d${dayNum}_breakfast_mood`, type: 'scale5', label: 'Energy / mood after (1 low — 5 great)' },
        { id: `d${dayNum}_breakfast_fullness`, type: 'scale5', label: 'Fullness after (1 still hungry — 5 too full)' },
        { id: `d${dayNum}_breakfast_symptoms`, type: 'text', label: 'Any symptoms after? (e.g., bloating, brain fog, sleepy)' },

        { id: `d${dayNum}_lunch_food`, type: 'textarea', label: 'Lunch — what did you eat?' },
        { id: `d${dayNum}_lunch_time`, type: 'time', label: 'Lunch — time' },
        { id: `d${dayNum}_lunch_portion`, type: 'select', label: 'Portion size',
          options: ['Small', 'Medium', 'Large', 'Skipped'] },
        { id: `d${dayNum}_lunch_mood`, type: 'scale5', label: 'Energy / mood after (1 low — 5 great)' },
        { id: `d${dayNum}_lunch_fullness`, type: 'scale5', label: 'Fullness after (1 still hungry — 5 too full)' },
        { id: `d${dayNum}_lunch_symptoms`, type: 'text', label: 'Any symptoms after?' },

        { id: `d${dayNum}_dinner_food`, type: 'textarea', label: 'Dinner — what did you eat?' },
        { id: `d${dayNum}_dinner_time`, type: 'time', label: 'Dinner — time' },
        { id: `d${dayNum}_dinner_portion`, type: 'select', label: 'Portion size',
          options: ['Small', 'Medium', 'Large', 'Skipped'] },
        { id: `d${dayNum}_dinner_mood`, type: 'scale5', label: 'Energy / mood after (1 low — 5 great)' },
        { id: `d${dayNum}_dinner_fullness`, type: 'scale5', label: 'Fullness after (1 still hungry — 5 too full)' },
        { id: `d${dayNum}_dinner_symptoms`, type: 'text', label: 'Any symptoms after?' },

        { id: `d${dayNum}_snacks_food`, type: 'textarea', label: 'Snacks — what and when?' },
        { id: `d${dayNum}_snacks_reason`, type: 'select', label: 'Why did you snack?',
          options: ['No snacks today', 'Hungry', 'Bored / habit', 'Stressed / emotional', 'Social', 'Other'] }
      ]
    },
    // === DAILY HABITS PAGE for this day ===
    {
      title: `Day ${dayNum} — drinks, water & movement`,
      description: 'Quick check on hydration, alcohol and movement for this day.',
      questions: [
        { id: `d${dayNum}_water`, type: 'select', label: 'Water intake',
          options: ['Less than 1L', '1-1.5L', '1.5-2L', '2-2.5L', 'More than 2.5L'] },
        { id: `d${dayNum}_other_drinks`, type: 'textarea', label: 'Other drinks (tea, coffee, juice, fizzy etc.) — how many?' },
        { id: `d${dayNum}_alcohol`, type: 'textarea', label: 'Alcohol — what and how much? (skip if none)' },
        { id: `d${dayNum}_movement`, type: 'textarea', label: 'Movement / exercise (including walking)' },
        { id: `d${dayNum}_meds`, type: 'textarea', label: 'Medications / supplements taken today' }
      ]
    },
    // === BODY & WELLBEING PAGE for this day ===
    {
      title: `Day ${dayNum} — how you felt`,
      description: 'Sleep, bowels, mood — the wellbeing picture for this day.',
      questions: [
        { id: `d${dayNum}_sleep_hours`, type: 'select', label: 'Hours of sleep last night',
          options: ['<5', '5-6', '6-7', '7-8', '8-9', '>9'] },
        { id: `d${dayNum}_sleep_quality`, type: 'scale5', label: 'Sleep quality (1 poor — 5 great)' },
        { id: `d${dayNum}_bowel_count`, type: 'select', label: 'Bowel movements today',
          options: ['None', '1', '2', '3 or more'] },
        { id: `d${dayNum}_bowel_type`, type: 'select', label: 'Stool type (Bristol scale — optional)',
          options: ['Skip / N/A', '1 — Hard lumps', '2 — Lumpy sausage', '3 — Cracked sausage', '4 — Smooth sausage (ideal)', '5 — Soft blobs', '6 — Mushy', '7 — Watery'] },
        { id: `d${dayNum}_overall_energy`, type: 'scale5', label: 'Overall energy today (1 exhausted — 5 great)' },
        { id: `d${dayNum}_overall_mood`, type: 'scale5', label: 'Overall mood today (1 low — 5 great)' },
        { id: `d${dayNum}_stress`, type: 'scale5', label: 'Stress level (1 calm — 5 very stressed)' },
        { id: `d${dayNum}_notes`, type: 'textarea', label: 'Anything else notable today?' }
      ]
    }
  ];
}

const FORM_PAGES = [
  // -------- PAGE 1: Intro & personal info --------
  {
    title: 'Before you start',
    description: 'A few basics so I know whose diary this is.',
    questions: [
      { id: 'name', type: 'text', label: 'Your name', required: true },
      { id: 'email', type: 'email', label: 'Email', required: true },
      { id: 'startDate', type: 'date', label: 'Day 1 — date', required: true, default: 'today' }
    ]
  },
  ...buildDayPages(1),
  ...buildDayPages(2),
  ...buildDayPages(3),
  {
    title: 'Almost done',
    description: 'A quick look back over the three days.',
    questions: [
      { id: 'typical', type: 'select', label: 'Were these three days typical for you?',
        options: ['Yes — typical', 'Mostly typical', 'Not typical (unusual week)'] },
      { id: 'noticed', type: 'textarea', label: 'Did you notice any patterns? (e.g., always tired after lunch, bloated when eating bread, etc.)' },
      { id: 'feelings', type: 'textarea', label: 'How do you feel about your eating after observing 3 days?' },
      { id: 'finalNotes', type: 'textarea', label: "Anything else you'd like me to know?" }
    ]
  }
];

// ============================================
// STATE
// ============================================
let currentPage = 0;
let answers = {};
let autosaveTimeout = null;

// ============================================
// PAGE RENDERING
// ============================================
function renderPage(pageIndex) {
  const page = FORM_PAGES[pageIndex];
  const total = FORM_PAGES.length;
  const percent = Math.round(((pageIndex + 1) / total) * 100);
  document.getElementById('progressLabel').textContent = `Step ${pageIndex + 1} of ${total}`;
  document.getElementById('progressPercent').textContent = `${percent}%`;
  document.getElementById('progressFill').style.width = `${percent}%`;
  document.getElementById('pageTitle').textContent = page.title;
  document.getElementById('pageDescription').textContent = page.description;
  const container = document.getElementById('questionsContainer');
  container.innerHTML = '';
  page.questions.forEach(q => {
    const questionEl = renderQuestion(q);
    container.appendChild(questionEl);
  });
  document.getElementById('prevBtn').style.display = pageIndex === 0 ? 'none' : 'inline-flex';
  const nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = pageIndex === FORM_PAGES.length - 1 ? 'Submit diary ✓' : 'Continue →';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuestion(q) {
  const wrap = document.createElement('div');
  wrap.className = 'question-block';
  const label = document.createElement('label');
  label.className = 'question-label';
  label.textContent = q.label + (q.required ? ' *' : '');
  wrap.appendChild(label);
  let input;
  if (q.type === 'text' || q.type === 'email' || q.type === 'tel') {
    input = document.createElement('input');
    input.type = q.type;
    input.className = 'question-input';
    input.value = answers[q.id] || '';
    if (q.required) input.required = true;
    input.addEventListener('input', e => { answers[q.id] = e.target.value; scheduleAutosave(); });
  } else if (q.type === 'date') {
    input = document.createElement('input');
    input.type = 'date';
    input.className = 'question-input';
    let value = answers[q.id];
    if (!value && q.default === 'today') value = new Date().toISOString().split('T')[0];
    input.value = value || '';
    input.addEventListener('change', e => { answers[q.id] = e.target.value; scheduleAutosave(); });
  } else if (q.type === 'time') {
    input = document.createElement('input');
    input.type = 'time';
    input.className = 'question-input';
    input.value = answers[q.id] || '';
    input.addEventListener('change', e => { answers[q.id] = e.target.value; scheduleAutosave(); });
  } else if (q.type === 'select') {
    input = document.createElement('select');
    input.className = 'question-input';
    const blank = document.createElement('option');
    blank.value = ''; blank.textContent = '— Choose —';
    input.appendChild(blank);
    q.options.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt; o.textContent = opt;
      if (answers[q.id] === opt) o.selected = true;
      input.appendChild(o);
    });
    input.addEventListener('change', e => { answers[q.id] = e.target.value; scheduleAutosave(); });
  } else if (q.type === 'textarea') {
    input = document.createElement('textarea');
    input.className = 'question-input'; input.rows = 3;
    input.value = answers[q.id] || '';
    input.addEventListener('input', e => { answers[q.id] = e.target.value; scheduleAutosave(); });
  } else if (q.type === 'scale5') {
    input = renderScale5(q);
  }
  if (input) wrap.appendChild(input);
  return wrap;
}

function renderScale5(q) {
  const wrap = document.createElement('div');
  wrap.className = 'scale-group scale-group-5';
  for (let i = 1; i <= 5; i++) {
    const opt = document.createElement('button');
    opt.type = 'button';
    opt.className = 'scale-option';
    opt.dataset.value = i;
    const num = document.createElement('span');
    num.className = 'scale-number';
    num.textContent = i;
    opt.appendChild(num);
    if (answers[q.id] === i) opt.classList.add('selected');
    opt.addEventListener('click', () => {
      answers[q.id] = i;
      wrap.querySelectorAll('.scale-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      scheduleAutosave();
    });
    wrap.appendChild(opt);
  }
  return wrap;
}

// ============================================
// NAVIGATION
// ============================================
function goToPage(idx) {
  if (idx < 0 || idx >= FORM_PAGES.length) return;
  currentPage = idx;
  saveProgress();
  renderPage(idx);
}

function nextPage() {
  if (currentPage === FORM_PAGES.length - 1) submitForm();
  else goToPage(currentPage + 1);
}

function prevPage() { goToPage(currentPage - 1); }

// ============================================
// AUTOSAVE
// ============================================
function scheduleAutosave() {
  if (autosaveTimeout) clearTimeout(autosaveTimeout);
  autosaveTimeout = setTimeout(saveProgress, 800);
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentPage, answers, savedAt: new Date().toISOString()
    }));
  } catch (e) { console.warn('Could not save:', e); }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (e) { return null; }
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

// ============================================
// SUBMISSION
// ============================================
async function submitForm() {
  document.getElementById('formScreen').style.display = 'none';
  document.getElementById('submittingScreen').style.display = 'block';
  
  const submission = {
    submittedAt: new Date().toISOString(),
    answers: answers
  };
  
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(submission)
    });
    document.getElementById('submittingScreen').style.display = 'none';
    document.getElementById('successScreen').style.display = 'block';
    clearProgress();
  } catch (err) {
    console.error('Submission error:', err);
    document.getElementById('submittingScreen').style.display = 'none';
    document.getElementById('errorScreen').style.display = 'block';
  }
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const saved = loadProgress();
  if (saved && saved.answers && Object.keys(saved.answers).length > 0) {
    document.getElementById('resumeBtn').style.display = 'inline-flex';
  }
  document.getElementById('startBtn').addEventListener('click', () => {
    answers = {}; currentPage = 0; clearProgress();
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('formScreen').style.display = 'block';
    renderPage(0);
  });
  document.getElementById('resumeBtn').addEventListener('click', () => {
    const saved = loadProgress();
    if (saved) {
      answers = saved.answers || {};
      currentPage = saved.currentPage || 0;
      document.getElementById('welcomeScreen').style.display = 'none';
      document.getElementById('formScreen').style.display = 'block';
      renderPage(currentPage);
    }
  });
  document.getElementById('prevBtn').addEventListener('click', prevPage);
  document.getElementById('nextBtn').addEventListener('click', nextPage);
  document.getElementById('retryBtn')?.addEventListener('click', () => {
    document.getElementById('errorScreen').style.display = 'none';
    document.getElementById('formScreen').style.display = 'block';
  });
});
