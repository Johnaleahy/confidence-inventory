/* ===========================================================================
   Confidence Inventory — Authority Assessment
   Authority = Confidence + Leadership + Enjoyment + Gratitude + Discipline,
   measured across 7 life domains. 5 x 7 = 35 items, rated 1–10.
   Dependency-free: all rendering (including the radar wheel) is hand-rolled.
   =========================================================================== */

const PILLARS = [
  { id: 'confidence', name: 'Confidence', blurb: 'belief you can handle what comes' },
  { id: 'leadership', name: 'Leadership', blurb: 'setting the direction yourself' },
  { id: 'enjoyment',  name: 'Enjoyment',  blurb: 'ease and satisfaction in the area' },
  { id: 'gratitude',  name: 'Gratitude',  blurb: 'appreciation for what you have' },
  { id: 'discipline', name: 'Discipline', blurb: 'consistent follow-through' },
];

const DOMAINS = [
  {
    id: 'finance', name: 'Finance', icon: '💰',
    intro: 'How you feel about and manage your money and resources.',
    items: {
      confidence: "I'm confident I can handle whatever financial situations come my way.",
      leadership: "I actively set the direction of my finances rather than reacting to whatever happens.",
      enjoyment:  "I feel at ease — even a sense of enjoyment — when dealing with my money.",
      gratitude:  "I feel genuinely grateful for the financial resources I have.",
      discipline: "I consistently stick to the money habits (saving, budgeting, paying on time) that keep me healthy.",
    },
  },
  {
    id: 'social', name: 'Social & Relationships', icon: '🤝',
    intro: 'Family, friends, partner, and your wider social world.',
    items: {
      confidence: "I'm confident in my ability to build and keep the relationships I want.",
      leadership: "I take initiative in my relationships rather than waiting for others to reach out.",
      enjoyment:  "I genuinely enjoy the time I spend with the people in my life.",
      gratitude:  "I feel deeply grateful for the people around me.",
      discipline: "I consistently invest time and attention in my key relationships, even when I'm busy.",
    },
  },
  {
    id: 'health', name: 'Physical & Mental Health', icon: '🧠',
    intro: 'Your body, your energy, and your mental wellbeing.',
    items: {
      confidence: "I'm confident in my ability to take care of my body and mind.",
      leadership: "I take ownership of my health rather than leaving it to chance.",
      enjoyment:  "I enjoy the activities that keep me physically and mentally well.",
      gratitude:  "I feel grateful for my body and my mental wellbeing.",
      discipline: "I consistently follow the routines (sleep, movement, nutrition, recovery) that keep me well.",
    },
  },
  {
    id: 'environment', name: 'Environment', icon: '🏡',
    intro: 'The spaces you live and work in — home, office, car.',
    items: {
      confidence: "I'm confident I can create and maintain spaces that work for me.",
      leadership: "I intentionally shape my environment rather than tolerating whatever it becomes.",
      enjoyment:  "I genuinely enjoy spending time in my home, workspace, and car.",
      gratitude:  "I feel grateful for the spaces I get to live and work in.",
      discipline: "I consistently keep my spaces organized and in order.",
    },
  },
  {
    id: 'appearance', name: 'Appearance', icon: '✨',
    intro: 'How you present yourself and feel about how you look.',
    items: {
      confidence: "I feel confident in how I present myself and look.",
      leadership: "I make deliberate choices about my appearance rather than defaulting or neglecting it.",
      enjoyment:  "I enjoy taking care of and presenting my appearance.",
      gratitude:  "I feel grateful for how I'm able to look and present myself.",
      discipline: "I consistently maintain the grooming and self-care habits I value.",
    },
  },
  {
    id: 'spiritual', name: 'Spiritual', icon: '🕊️',
    intro: 'Meaning, purpose, faith, and your inner life.',
    items: {
      confidence: "I feel grounded and confident in my sense of meaning or purpose.",
      leadership: "I actively cultivate my spiritual or inner life rather than ignoring it.",
      enjoyment:  "I find genuine fulfillment in my spiritual or reflective practices.",
      gratitude:  "I feel a deep sense of gratitude for life and for what's bigger than me.",
      discipline: "I consistently make time for what nourishes me spiritually (prayer, meditation, reflection, nature).",
    },
  },
  {
    id: 'time', name: 'Time Management', icon: '⏳',
    intro: 'How you direct your hours, attention, and priorities.',
    items: {
      confidence: "I'm confident in my ability to manage my time and priorities.",
      leadership: "I proactively direct how I spend my time rather than letting it get away from me.",
      enjoyment:  "I feel a sense of ease and satisfaction with how I use my time.",
      gratitude:  "I feel grateful for how I'm able to spend my days.",
      discipline: "I consistently follow through on my plans and protect my priorities.",
    },
  },
];

const STORAGE_KEY = 'confidence-inventory-v1';

/* ---------- State ---------- */
let responses = {}; // responses[domainId][pillarId] = 1..10
let stepIndex = 0;

/* ---------- Persistence ---------- */
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ responses, stepIndex })); } catch (e) {}
}
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    responses = data.responses || {};
    stepIndex = data.stepIndex || 0;
    return Object.keys(responses).length > 0;
  } catch (e) { return false; }
}
function clearSaved() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

/* ---------- Screen routing ---------- */
function show(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Survey rendering ---------- */
function renderStep() {
  const domain = DOMAINS[stepIndex];
  const block = document.getElementById('domain-block');
  responses[domain.id] = responses[domain.id] || {};

  let html = `
    <div class="domain-head">
      <span class="domain-icon">${domain.icon}</span>
      <h2 class="domain-title">${domain.name}</h2>
    </div>
    <p class="domain-intro">${domain.intro}</p>
  `;

  PILLARS.forEach(p => {
    const current = responses[domain.id][p.id];
    let scaleBtns = '';
    for (let n = 1; n <= 10; n++) {
      const sel = current === n ? ' selected' : '';
      scaleBtns += `<button type="button" class="scale-btn${sel}" data-domain="${domain.id}" data-pillar="${p.id}" data-value="${n}" aria-label="${n} out of 10">${n}</button>`;
    }
    html += `
      <div class="q">
        <span class="q-pillar">${p.name}</span>
        <p class="q-text">${domain.items[p.id]}</p>
        <div class="scale">${scaleBtns}</div>
        <div class="scale-legend"><span>1 · Not true of me</span><span>Completely true · 10</span></div>
      </div>
    `;
  });

  block.innerHTML = html;

  block.querySelectorAll('.scale-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = btn.dataset.domain, pi = btn.dataset.pillar, v = parseInt(btn.dataset.value, 10);
      responses[d][pi] = v;
      // update selection within this question's scale
      btn.parentElement.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      save();
      updateSurveyNav();
    });
  });

  // progress
  const pct = (stepIndex) / DOMAINS.length * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-step').textContent = stepIndex + 1;
  document.getElementById('progress-name').textContent = domain.name;
  document.getElementById('btn-back').style.visibility = stepIndex === 0 ? 'hidden' : 'visible';
  document.getElementById('btn-next').textContent = stepIndex === DOMAINS.length - 1 ? 'See my results' : 'Next';
  updateSurveyNav();
}

function stepComplete(i) {
  const d = DOMAINS[i];
  const r = responses[d.id] || {};
  return PILLARS.every(p => typeof r[p.id] === 'number');
}

function updateSurveyNav() {
  const ok = stepComplete(stepIndex);
  document.getElementById('btn-next').disabled = !ok;
  document.getElementById('survey-hint').style.visibility = ok ? 'hidden' : 'visible';
}

/* ---------- Scoring ---------- */
function computeScores() {
  const domainScores = {}; // mean across 5 pillars
  const pillarScores = {}; // mean across 7 domains
  PILLARS.forEach(p => pillarScores[p.id] = 0);

  DOMAINS.forEach(d => {
    let sum = 0;
    PILLARS.forEach(p => {
      const v = responses[d.id][p.id];
      sum += v;
      pillarScores[p.id] += v;
    });
    domainScores[d.id] = sum / PILLARS.length;
  });
  PILLARS.forEach(p => pillarScores[p.id] = pillarScores[p.id] / DOMAINS.length);

  let total = 0;
  DOMAINS.forEach(d => PILLARS.forEach(p => total += responses[d.id][p.id]));
  const composite = total / (DOMAINS.length * PILLARS.length);

  return { domainScores, pillarScores, composite };
}

function band(score) {
  if (score >= 8.5) return { label: 'Commanding', desc: 'You carry deep authority across your life. The work now is protecting it and lifting your lowest areas to match.' };
  if (score >= 7)   return { label: 'Grounded',   desc: 'You operate from real composure most of the time. A few targeted areas are holding back your full authority.' };
  if (score >= 5.5) return { label: 'Building',    desc: 'A solid foundation with clear room to grow. Focus on your lowest pillar and lowest domain first — they compound.' };
  if (score >= 4)   return { label: 'Emerging',    desc: 'Your authority is uneven. Pick one area and one capacity to strengthen this month; momentum builds fast from here.' };
  return { label: 'Foundational', desc: 'This is a starting line, not a verdict. Choose a single area to stabilize first — small wins rebuild confidence quickly.' };
}

// 1–10 -> color from danger(red) to gold to green
function scoreColor(score) {
  const t = Math.max(0, Math.min(1, (score - 1) / 9));
  let r, g, b;
  if (t < 0.5) {            // red -> gold
    const k = t / 0.5;
    r = Math.round(227 + (227 - 227) * k);
    g = Math.round(103 + (179 - 103) * k);
    b = Math.round(92 + (65 - 92) * k);
  } else {                  // gold -> green
    const k = (t - 0.5) / 0.5;
    r = Math.round(227 + (111 - 227) * k);
    g = Math.round(179 + (207 - 179) * k);
    b = Math.round(65 + (151 - 65) * k);
  }
  return `rgb(${r},${g},${b})`;
}

/* ---------- Radar / wheel (SVG) ---------- */
function radarSVG(domainScores) {
  const size = 360, cx = size / 2, cy = size / 2, R = 130;
  const n = DOMAINS.length;
  const angle = i => (-Math.PI / 2) + i * (2 * Math.PI / n);
  const point = (i, r) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];

  let rings = '';
  [2, 4, 6, 8, 10].forEach(v => {
    const r = R * v / 10;
    let pts = '';
    for (let i = 0; i < n; i++) { const [x, y] = point(i, r); pts += `${x},${y} `; }
    rings += `<polygon points="${pts.trim()}" fill="none" stroke="#2a3644" stroke-width="1"/>`;
  });

  let spokes = '';
  for (let i = 0; i < n; i++) { const [x, y] = point(i, R); spokes += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#2a3644" stroke-width="1"/>`; }

  let dataPts = '';
  const dots = [];
  DOMAINS.forEach((d, i) => {
    const s = domainScores[d.id];
    const [x, y] = point(i, R * s / 10);
    dataPts += `${x},${y} `;
    dots.push(`<circle cx="${x}" cy="${y}" r="4" fill="${scoreColor(s)}"/>`);
  });

  let labels = '';
  DOMAINS.forEach((d, i) => {
    const [x, y] = point(i, R + 26);
    let anchor = 'middle';
    if (x < cx - 8) anchor = 'end';
    else if (x > cx + 8) anchor = 'start';
    labels += `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle" fill="#93a4b5" font-size="11" font-family="sans-serif">${d.icon} ${d.name.split(' ')[0]}</text>`;
  });

  return `
  <svg class="radar" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Wheel of life scores by domain">
    ${rings}${spokes}
    <polygon points="${dataPts.trim()}" fill="rgba(79,157,222,0.22)" stroke="#4f9dde" stroke-width="2"/>
    ${dots.join('')}${labels}
  </svg>`;
}

/* ---------- Heatmap ---------- */
function heatmapHTML() {
  let head = '<tr><th class="corner"></th>';
  PILLARS.forEach(p => head += `<th>${p.name}</th>`);
  head += '<th>Avg</th></tr>';

  let rows = '';
  DOMAINS.forEach(d => {
    let row = `<tr><th class="row-h">${d.icon} ${d.name}</th>`;
    let sum = 0;
    PILLARS.forEach(p => {
      const v = responses[d.id][p.id];
      sum += v;
      row += `<td style="background:${scoreColor(v)}">${v}</td>`;
    });
    const avg = sum / PILLARS.length;
    row += `<td style="background:${scoreColor(avg)}">${avg.toFixed(1)}</td></tr>`;
    rows += row;
  });

  // pillar averages footer
  let foot = '<tr><th class="row-h">Average</th>';
  PILLARS.forEach(p => {
    let s = 0; DOMAINS.forEach(d => s += responses[d.id][p.id]);
    const avg = s / DOMAINS.length;
    foot += `<td style="background:${scoreColor(avg)}">${avg.toFixed(1)}</td>`;
  });
  foot += '<td class="corner"></td></tr>';

  return `<div class="heatmap-wrap"><table class="heatmap">${head}${rows}${foot}</table></div>`;
}

/* ---------- Insights ---------- */
function insights(scores) {
  const pillarsSorted = PILLARS.map(p => ({ ...p, score: scores.pillarScores[p.id] })).sort((a, b) => b.score - a.score);
  const domainsSorted = DOMAINS.map(d => ({ ...d, score: scores.domainScores[d.id] })).sort((a, b) => b.score - a.score);

  // individual cells
  const cells = [];
  DOMAINS.forEach(d => PILLARS.forEach(p => cells.push({ d, p, v: responses[d.id][p.id] })));
  cells.sort((a, b) => a.v - b.v);
  const weakest = cells.slice(0, 3);
  const strongest = cells.slice(-3).reverse();

  const topPillar = pillarsSorted[0], lowPillar = pillarsSorted[pillarsSorted.length - 1];
  const topDomain = domainsSorted[0], lowDomain = domainsSorted[domainsSorted.length - 1];

  return `
    <div class="insight-cols">
      <div class="insight">
        <h3>Your strengths</h3>
        <ul>
          <li>Strongest capacity: <span class="tag-strong">${topPillar.name}</span> (${topPillar.score.toFixed(1)}) — ${topPillar.blurb}.</li>
          <li>Strongest area of life: <span class="tag-strong">${topDomain.name}</span> (${topDomain.score.toFixed(1)}).</li>
          ${strongest.map(c => `<li><span class="tag-strong">${c.v}</span> · ${c.p.name} in ${c.d.name}</li>`).join('')}
        </ul>
      </div>
      <div class="insight">
        <h3>Your growth edges</h3>
        <ul>
          <li>Weakest capacity: <span class="tag-weak">${lowPillar.name}</span> (${lowPillar.score.toFixed(1)}) — strengthen this and it lifts every area.</li>
          <li>Area needing most attention: <span class="tag-weak">${lowDomain.name}</span> (${lowDomain.score.toFixed(1)}).</li>
          ${weakest.map(c => `<li><span class="tag-weak">${c.v}</span> · ${c.p.name} in ${c.d.name}</li>`).join('')}
        </ul>
      </div>
    </div>
    <div class="card" style="margin-top:22px">
      <h3 style="margin-top:0">Where to focus first</h3>
      <p style="margin-bottom:0;color:var(--muted)">
        The fastest gains usually come from your single lowest cell:
        <strong style="color:var(--text)">${weakest[0].p.name} in ${weakest[0].d.name}</strong>.
        Pair it with your weakest overall capacity — <strong style="color:var(--text)">${lowPillar.name}</strong> —
        and pick one small, repeatable action for the next two weeks. Re-take this inventory monthly to watch the wheel round out.
      </p>
    </div>
  `;
}

/* ---------- Results ---------- */
function renderResults() {
  const scores = computeScores();
  const b = band(scores.composite);
  const pillarsSorted = PILLARS.map(p => ({ ...p, score: scores.pillarScores[p.id] }));

  let pillarBars = '';
  pillarsSorted.forEach(p => {
    pillarBars += `
      <div class="bar-row">
        <div class="bar-label"><span>${p.name}</span><span class="v">${p.score.toFixed(1)} / 10</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${p.score * 10}%;background:${scoreColor(p.score)}"></div></div>
      </div>`;
  });

  document.getElementById('results-content').innerHTML = `
    <div class="result-hero">
      <div class="score-big">${scores.composite.toFixed(1)}<small> / 10</small></div>
      <div class="score-band">${b.label} authority</div>
      <p>${b.desc}</p>
    </div>

    <h2 class="section-title">Your wheel of life</h2>
    <p class="section-sub">Each spoke is a life area, scored by averaging its five authority capacities. A round, full wheel means balanced authority.</p>
    <div class="card radar-wrap">${radarSVG(scores.domainScores)}</div>

    <h2 class="section-title">Your five capacities</h2>
    <p class="section-sub">How each authority capacity shows up across every area of your life.</p>
    <div class="card">${pillarBars}</div>

    <h2 class="section-title">The full picture</h2>
    <p class="section-sub">Every capacity × every area. Find the red cells — that's where authority leaks out.</p>
    ${heatmapHTML()}

    <h2 class="section-title">What it means</h2>
    ${insights(scores)}
  `;
  show('screen-results');
}

/* ---------- Export ---------- */
function exportJSON() {
  const scores = computeScores();
  const payload = {
    generated: new Date().toISOString(),
    scale: '1-10',
    responses,
    scores: {
      composite: Number(scores.composite.toFixed(2)),
      pillars: Object.fromEntries(PILLARS.map(p => [p.id, Number(scores.pillarScores[p.id].toFixed(2))])),
      domains: Object.fromEntries(DOMAINS.map(d => [d.id, Number(scores.domainScores[d.id].toFixed(2))])),
    },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'confidence-inventory.json';
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------- Wiring ---------- */
function startFresh() {
  responses = {};
  stepIndex = 0;
  clearSaved();
  renderStep();
  show('screen-survey');
}

document.addEventListener('DOMContentLoaded', () => {
  const hasSaved = load();
  if (hasSaved) document.getElementById('btn-resume').classList.remove('hidden');

  document.getElementById('btn-start').addEventListener('click', startFresh);

  document.getElementById('btn-resume').addEventListener('click', () => {
    // resume to first incomplete step, or results if all done
    const firstIncomplete = DOMAINS.findIndex((_, i) => !stepComplete(i));
    if (firstIncomplete === -1) { renderResults(); }
    else { stepIndex = firstIncomplete; renderStep(); show('screen-survey'); }
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    if (!stepComplete(stepIndex)) return;
    if (stepIndex === DOMAINS.length - 1) { save(); renderResults(); }
    else { stepIndex++; save(); renderStep(); }
  });

  document.getElementById('btn-back').addEventListener('click', () => {
    if (stepIndex > 0) { stepIndex--; save(); renderStep(); }
  });

  document.getElementById('btn-print').addEventListener('click', () => window.print());
  document.getElementById('btn-export').addEventListener('click', exportJSON);
  document.getElementById('btn-retake').addEventListener('click', startFresh);
});
