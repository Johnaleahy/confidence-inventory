/* ===========================================================================
   Confidence Inventory — Authority Assessment
   Authority = Confidence + Leadership + Enjoyment + Gratitude + Discipline,
   measured across 7 life domains.

   Questions are deliberately INDIRECT: concrete, behavioral statements that
   reveal authority without ever naming the capacity. Each statement is tagged
   (under the hood) to one of the five capacities so the wheel, capacity bars,
   and domain × capacity heatmap still work. ~12 statements per domain.
   Dependency-free: all rendering (including the radar wheel) is hand-rolled.
   =========================================================================== */

const PILLARS = [
  { id: 'confidence', name: 'Confidence', blurb: 'belief you can handle what comes' },
  { id: 'leadership', name: 'Leadership', blurb: 'setting the direction yourself' },
  { id: 'enjoyment',  name: 'Enjoyment',  blurb: 'ease and satisfaction in the area' },
  { id: 'gratitude',  name: 'Gratitude',  blurb: 'appreciation for what you have' },
  { id: 'discipline', name: 'Discipline', blurb: 'consistent follow-through' },
];

// Each item: { t: statement shown to the user, c: capacity it secretly measures }
const DOMAINS = [
  {
    id: 'finance', name: 'Finance', icon: '💰',
    intro: 'How you handle and relate to your money and resources.',
    items: [
      { t: "I don't lie awake worrying about money.", c: 'confidence' },
      { t: "I know exactly what I owe and what I own.", c: 'leadership' },
      { t: "I pay my bills on time without scrambling.", c: 'discipline' },
      { t: "I live comfortably within my means.", c: 'discipline' },
      { t: "I have enough set aside to handle an unexpected expense.", c: 'confidence' },
      { t: "I make spending decisions deliberately, not impulsively.", c: 'discipline' },
      { t: "My beliefs about money are my own, not inherited from someone else.", c: 'leadership' },
      { t: "I'm on a path that will give me the financial life I want.", c: 'leadership' },
      { t: "Money is one factor in my decisions, not the thing that runs them.", c: 'confidence' },
      { t: "I feel genuinely thankful for what I'm able to afford and provide.", c: 'gratitude' },
      { t: "Dealing with my finances feels manageable — not something I dread.", c: 'enjoyment' },
      { t: "I have no money secrets I'm hiding or ashamed of.", c: 'confidence' },
    ],
  },
  {
    id: 'social', name: 'Social & Relationships', icon: '🤝',
    intro: 'Family, friends, partner, and your wider social world.',
    items: [
      { t: "I reach out and make plans rather than waiting to be invited.", c: 'leadership' },
      { t: "When there's tension with someone, I address it instead of letting it fester.", c: 'confidence' },
      { t: "The people close to me know they can count on me.", c: 'discipline' },
      { t: "I look forward to time with the people in my life.", c: 'enjoyment' },
      { t: "I have people I can turn to when things get hard.", c: 'confidence' },
      { t: "I keep in touch with the people who matter, even when life is busy.", c: 'discipline' },
      { t: "I can be myself around the people closest to me.", c: 'confidence' },
      { t: "I feel genuinely lucky to have the people I have.", c: 'gratitude' },
      { t: "I set the tone in my relationships rather than just going along.", c: 'leadership' },
      { t: "I can say no to plans that drain me without feeling guilty.", c: 'leadership' },
      { t: "Time with friends and family energizes me rather than wearing me out.", c: 'enjoyment' },
      { t: "I make a point of telling people I appreciate them.", c: 'gratitude' },
    ],
  },
  {
    id: 'health', name: 'Physical & Mental Health', icon: '🧠',
    intro: 'Your body, your energy, and your mental wellbeing.',
    items: [
      { t: "I get enough sleep to feel rested most days.", c: 'discipline' },
      { t: "I move my body regularly, not just when I feel like it.", c: 'discipline' },
      { t: "When I'm stressed, I have ways of coping that actually work.", c: 'confidence' },
      { t: "I trust my body to carry me through what I ask of it.", c: 'confidence' },
      { t: "I take care of small health issues before they become big ones.", c: 'leadership' },
      { t: "I actually enjoy the things I do to stay healthy.", c: 'enjoyment' },
      { t: "I decide what goes into my body rather than eating on autopilot.", c: 'leadership' },
      { t: "I'm grateful for what my body lets me do.", c: 'gratitude' },
      { t: "I make time for rest and recovery without feeling guilty.", c: 'discipline' },
      { t: "I feel steady and clear-headed most of the time.", c: 'confidence' },
      { t: "I'd rather prevent problems with my health than react to them.", c: 'leadership' },
      { t: "I feel good in my own skin.", c: 'enjoyment' },
    ],
  },
  {
    id: 'environment', name: 'Environment', icon: '🏡',
    intro: 'The spaces you live and work in — home, office, car.',
    items: [
      { t: "My home is set up the way I want it, not just how it ended up.", c: 'leadership' },
      { t: "I can find what I need when I need it.", c: 'discipline' },
      { t: "My spaces feel calm and welcoming to me.", c: 'enjoyment' },
      { t: "I deal with clutter and repairs before they pile up.", c: 'discipline' },
      { t: "I'm comfortable having people over without a panic to clean up.", c: 'confidence' },
      { t: "I've made my spaces feel like mine.", c: 'leadership' },
      { t: "I keep my car, desk, and home in reasonable order without much effort.", c: 'discipline' },
      { t: "I genuinely enjoy spending time in my own space.", c: 'enjoyment' },
      { t: "I feel grateful for the places I get to live and work in.", c: 'gratitude' },
      { t: "My environment supports what I'm doing rather than getting in the way.", c: 'confidence' },
      { t: "If something breaks, I'm confident I can get it handled.", c: 'confidence' },
      { t: "I appreciate the comfort and security my spaces give me.", c: 'gratitude' },
    ],
  },
  {
    id: 'appearance', name: 'Appearance', icon: '✨',
    intro: 'How you present yourself and feel about how you look.',
    items: [
      { t: "I make deliberate choices about how I present myself.", c: 'leadership' },
      { t: "I feel comfortable in what I wear.", c: 'enjoyment' },
      { t: "I keep up the grooming and self-care habits that matter to me.", c: 'discipline' },
      { t: "I feel good about how I look without needing others to confirm it.", c: 'confidence' },
      { t: "I dress for myself, not just to meet others' expectations.", c: 'leadership' },
      { t: "I take care of my appearance consistently, not just for special occasions.", c: 'discipline' },
      { t: "I'm at ease with how I look in photos and mirrors.", c: 'confidence' },
      { t: "I appreciate the things I like about my appearance.", c: 'gratitude' },
      { t: "Getting ready is something I enjoy rather than endure.", c: 'enjoyment' },
      { t: "I present myself the way I want to be seen.", c: 'leadership' },
      { t: "I invest the time and effort my appearance deserves.", c: 'discipline' },
      { t: "I'm thankful for the features and health that let me look my best.", c: 'gratitude' },
    ],
  },
  {
    id: 'spiritual', name: 'Spiritual', icon: '🕊️',
    intro: 'Meaning, purpose, faith, and your inner life.',
    items: [
      { t: "I have a clear sense of what gives my life meaning.", c: 'confidence' },
      { t: "I make regular time for reflection, prayer, or stillness.", c: 'discipline' },
      { t: "My sense of purpose holds up even when things get hard.", c: 'confidence' },
      { t: "I actively tend to my inner life rather than ignoring it.", c: 'leadership' },
      { t: "I find genuine peace in my spiritual or reflective practices.", c: 'enjoyment' },
      { t: "I live in line with my values, not just talk about them.", c: 'discipline' },
      { t: "I feel a deep gratitude for being alive.", c: 'gratitude' },
      { t: "I've thought through what I believe rather than inheriting it unquestioned.", c: 'leadership' },
      { t: "I feel connected to something larger than myself.", c: 'confidence' },
      { t: "Quiet, reflective time feels nourishing — not boring or pointless.", c: 'enjoyment' },
      { t: "I make space for what feeds me spiritually even when life is busy.", c: 'discipline' },
      { t: "I regularly notice and appreciate the good in my life.", c: 'gratitude' },
    ],
  },
  {
    id: 'time', name: 'Time Management', icon: '⏳',
    intro: 'How you direct your hours, attention, and priorities.',
    items: [
      { t: "I decide how my day goes rather than letting it happen to me.", c: 'leadership' },
      { t: "I follow through on what I plan to do.", c: 'discipline' },
      { t: "I protect time for what matters most to me.", c: 'discipline' },
      { t: "I rarely feel rushed or behind.", c: 'confidence' },
      { t: "I can say no to things that don't fit my priorities.", c: 'leadership' },
      { t: "I trust myself to get done what needs to get done.", c: 'confidence' },
      { t: "I spend my time in line with what I actually value.", c: 'leadership' },
      { t: "I make time for things I enjoy, not just obligations.", c: 'enjoyment' },
      { t: "I feel satisfied with how I spent my time at the end of most days.", c: 'enjoyment' },
      { t: "I handle interruptions and surprises without losing the day.", c: 'confidence' },
      { t: "I'm grateful for the freedom I have over my own time.", c: 'gratitude' },
      { t: "I keep my commitments to myself, not just to others.", c: 'discipline' },
    ],
  },
];

const STORAGE_KEY = 'confidence-inventory-v2';

/* ---------- State ---------- */
let responses = {}; // responses[domainId][itemIndex] = 1..10
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

  domain.items.forEach((it, i) => {
    const current = responses[domain.id][i];
    let scaleBtns = '';
    for (let n = 1; n <= 10; n++) {
      const sel = current === n ? ' selected' : '';
      scaleBtns += `<button type="button" class="scale-btn${sel}" data-domain="${domain.id}" data-idx="${i}" data-value="${n}" aria-label="${n} out of 10">${n}</button>`;
    }
    html += `
      <div class="q">
        <p class="q-text">${it.t}</p>
        <div class="scale">${scaleBtns}</div>
        <div class="scale-legend"><span>1 · Not true of me</span><span>Completely true · 10</span></div>
      </div>
    `;
  });

  block.innerHTML = html;

  block.querySelectorAll('.scale-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = btn.dataset.domain, idx = parseInt(btn.dataset.idx, 10), v = parseInt(btn.dataset.value, 10);
      responses[d][idx] = v;
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
  return d.items.every((_, idx) => typeof r[idx] === 'number');
}

function updateSurveyNav() {
  const ok = stepComplete(stepIndex);
  document.getElementById('btn-next').disabled = !ok;
  document.getElementById('survey-hint').style.visibility = ok ? 'hidden' : 'visible';
}

/* ---------- Scoring ---------- */
function computeScores() {
  const domainScores = {}; // mean across the domain's items
  const pillarSum = {}, pillarCount = {};
  PILLARS.forEach(p => { pillarSum[p.id] = 0; pillarCount[p.id] = 0; });

  let total = 0, totalCount = 0;
  DOMAINS.forEach(d => {
    let sum = 0;
    d.items.forEach((it, i) => {
      const v = responses[d.id][i];
      sum += v;
      total += v; totalCount++;
      pillarSum[it.c] += v; pillarCount[it.c]++;
    });
    domainScores[d.id] = sum / d.items.length;
  });

  const pillarScores = {};
  PILLARS.forEach(p => pillarScores[p.id] = pillarCount[p.id] ? pillarSum[p.id] / pillarCount[p.id] : 0);
  const composite = total / totalCount;

  return { domainScores, pillarScores, composite };
}

// Average of one domain's items that are tagged to a given capacity (null if none).
function cellAverage(domain, capacityId) {
  let sum = 0, n = 0;
  domain.items.forEach((it, i) => {
    if (it.c === capacityId) { sum += responses[domain.id][i]; n++; }
  });
  return n ? sum / n : null;
}

function band(score) {
  if (score >= 8.5) return { label: 'Commanding', desc: 'You carry deep authority across your life. The work now is protecting it and lifting your lowest areas to match.' };
  if (score >= 7)   return { label: 'Grounded',   desc: 'You operate from real composure most of the time. A few targeted areas are holding back your full authority.' };
  if (score >= 5.5) return { label: 'Building',    desc: 'A solid foundation with clear room to grow. Focus on your lowest capacity and lowest domain first — they compound.' };
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
function heatmapHTML(scores) {
  let head = '<tr><th class="corner"></th>';
  PILLARS.forEach(p => head += `<th>${p.name}</th>`);
  head += '<th>Avg</th></tr>';

  let rows = '';
  DOMAINS.forEach(d => {
    let row = `<tr><th class="row-h">${d.icon} ${d.name}</th>`;
    PILLARS.forEach(p => {
      const v = cellAverage(d, p.id);
      if (v === null) row += `<td class="na">—</td>`;
      else row += `<td style="background:${scoreColor(v)}">${v.toFixed(1)}</td>`;
    });
    const avg = scores.domainScores[d.id];
    row += `<td style="background:${scoreColor(avg)}">${avg.toFixed(1)}</td></tr>`;
    rows += row;
  });

  // capacity averages footer
  let foot = '<tr><th class="row-h">Average</th>';
  PILLARS.forEach(p => {
    const avg = scores.pillarScores[p.id];
    foot += `<td style="background:${scoreColor(avg)}">${avg.toFixed(1)}</td>`;
  });
  foot += '<td class="corner"></td></tr>';

  return `<div class="heatmap-wrap"><table class="heatmap">${head}${rows}${foot}</table></div>`;
}

/* ---------- Insights ---------- */
function insights(scores) {
  const pillarsSorted = PILLARS.map(p => ({ ...p, score: scores.pillarScores[p.id] })).sort((a, b) => b.score - a.score);
  const domainsSorted = DOMAINS.map(d => ({ ...d, score: scores.domainScores[d.id] })).sort((a, b) => b.score - a.score);

  // individual statements (the most actionable signal)
  const items = [];
  DOMAINS.forEach(d => d.items.forEach((it, i) => items.push({ d, it, v: responses[d.id][i] })));
  items.sort((a, b) => a.v - b.v);
  const weakest = items.slice(0, 3);
  const strongest = items.slice(-3).reverse();

  const topPillar = pillarsSorted[0], lowPillar = pillarsSorted[pillarsSorted.length - 1];
  const topDomain = domainsSorted[0], lowDomain = domainsSorted[domainsSorted.length - 1];

  return `
    <div class="insight-cols">
      <div class="insight">
        <h3>Your strengths</h3>
        <ul>
          <li>Strongest capacity: <span class="tag-strong">${topPillar.name}</span> (${topPillar.score.toFixed(1)}) — ${topPillar.blurb}.</li>
          <li>Strongest area of life: <span class="tag-strong">${topDomain.name}</span> (${topDomain.score.toFixed(1)}).</li>
          ${strongest.map(c => `<li><span class="tag-strong">${c.v}</span> · ${c.it.t} <em>(${c.d.name})</em></li>`).join('')}
        </ul>
      </div>
      <div class="insight">
        <h3>Your growth edges</h3>
        <ul>
          <li>Weakest capacity: <span class="tag-weak">${lowPillar.name}</span> (${lowPillar.score.toFixed(1)}) — strengthen this and it lifts every area.</li>
          <li>Area needing most attention: <span class="tag-weak">${lowDomain.name}</span> (${lowDomain.score.toFixed(1)}).</li>
          ${weakest.map(c => `<li><span class="tag-weak">${c.v}</span> · ${c.it.t} <em>(${c.d.name})</em></li>`).join('')}
        </ul>
      </div>
    </div>
    <div class="card" style="margin-top:22px">
      <h3 style="margin-top:0">Where to focus first</h3>
      <p style="margin-bottom:0;color:var(--muted)">
        The fastest gains usually come from your lowest-rated statement:
        <strong style="color:var(--text)">“${weakest[0].it.t}”</strong> in
        <strong style="color:var(--text)">${weakest[0].d.name}</strong>.
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
    <p class="section-sub">Each spoke is a life area, scored by averaging all of its statements. A round, full wheel means balanced authority.</p>
    <div class="card radar-wrap">${radarSVG(scores.domainScores)}</div>

    <h2 class="section-title">Your five capacities</h2>
    <p class="section-sub">How each authority capacity shows up across every area of your life.</p>
    <div class="card">${pillarBars}</div>

    <h2 class="section-title">The full picture</h2>
    <p class="section-sub">Every capacity × every area. Find the red cells — that's where authority leaks out.</p>
    ${heatmapHTML(scores)}

    <h2 class="section-title">What it means</h2>
    ${insights(scores)}
  `;
  show('screen-results');
}

/* ---------- Export ---------- */
function exportJSON() {
  const scores = computeScores();
  const detail = {};
  DOMAINS.forEach(d => {
    detail[d.id] = d.items.map((it, i) => ({ statement: it.t, capacity: it.c, value: responses[d.id][i] }));
  });
  const payload = {
    generated: new Date().toISOString(),
    scale: '1-10',
    scores: {
      composite: Number(scores.composite.toFixed(2)),
      pillars: Object.fromEntries(PILLARS.map(p => [p.id, Number(scores.pillarScores[p.id].toFixed(2))])),
      domains: Object.fromEntries(DOMAINS.map(d => [d.id, Number(scores.domainScores[d.id].toFixed(2))])),
    },
    responses: detail,
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
