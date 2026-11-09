# Confidence Inventory — Authority Assessment

A private, browser-based self-assessment that measures the five capacities behind
**confidence and composure** across the seven areas that make up a life.

> **Premise:** Confidence and composure are a function of **authority**, and authority
> grows from five capacities — **Confidence, Leadership, Enjoyment, Gratitude, and
> Discipline** — exercised across every area of life.

## The model

Five capacities are measured across seven life domains. Rather than asking about each
capacity directly ("how confident are you about money?"), the inventory uses **~12 concrete,
behavioral statements per domain** (≈84 in total) — e.g. *"I pay my bills on time without
scrambling"* — each rated **1 (not true of me) → 10 (completely true of me)**. Every
statement is silently **tagged to one capacity**, so the same five-capacity profile still
falls out of the scoring without ever naming it to the participant.

| | Confidence | Leadership | Enjoyment | Gratitude | Discipline |
|---|---|---|---|---|---|
| **Finance** | ● | ● | ● | ● | ● |
| **Social & Relationships** | ● | ● | ● | ● | ● |
| **Physical & Mental Health** | ● | ● | ● | ● | ● |
| **Environment** (home, office, car) | ● | ● | ● | ● | ● |
| **Appearance** | ● | ● | ● | ● | ● |
| **Spiritual** | ● | ● | ● | ● | ● |
| **Time Management** | ● | ● | ● | ● | ● |

Scoring it this way reveals two things at once:

- **Wheel of Life** — average each domain's statements to see which **life areas** carry or drain your authority.
- **Capacity profile** — average each capacity's statements (across all domains) to see which **capacities** are strong or weak everywhere.
- The **domain × capacity heatmap** pinpoints exactly where authority leaks out.

### Design grounding
The instrument adapts wording and structure from validated self-report tools — the
**Wheel of Life** (life-domain satisfaction), the **General Self-Efficacy Scale**
(confidence), the **GQ-6 Gratitude Questionnaire**, and the **Brief Self-Control Scale**
(discipline) — on a 1–10 rating scale per best practice for self-assessment.

## Running it

It's a static single-page app with **no dependencies and no build step**.

```bash
# just open the file
open index.html            # macOS
# or serve locally
python3 -m http.server 8000   # then visit http://localhost:8000
```

### Hosting on GitHub Pages
Push this repo and enable **Settings → Pages → Deploy from branch** (root). The app
runs entirely client-side; **no answers ever leave the participant's browser** — they're
saved only to `localStorage` so a session can be resumed.

## Files

| File | Purpose |
|---|---|
| `index.html` | Markup and the three screens (intro · survey · results) |
| `styles.css` | All styling (dark theme, print styles for PDF export) |
| `app.js` | Question bank, survey wizard, scoring, and results (SVG wheel, pillar bars, heatmap, insights) |

## Results include

- A **composite authority score** with an interpretation band.
- A **radar "wheel of life"** across the seven domains.
- **Capacity bars** for the five pillars.
- A color-coded **domain × capacity heatmap**.
- **Strengths, growth edges, and a "focus first" recommendation**, plus **JSON export** and **print-to-PDF**.

> Not a clinical or diagnostic instrument — it's a reflection and coaching tool.
