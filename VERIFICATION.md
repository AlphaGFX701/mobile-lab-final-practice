# Mobile Lab verification — 2026-10-29

## Passed
- Production build: `npm run build` (Vite 8.3.5).
- `npm test`: 6 tests, including 1,000 complete exam draws. Every draw has 50 MC + 12 command questions, unique IDs, four distinct MC options and 74 possible points.
- Exact command matching, unknown commands pending, manual 0/1/2, JSON restoration, legacy sessions without a reviews property, and all seven practice topics.
- Print markup: 62 questions, 12 command blanks, no answer blocks in the question paper, and 62 answer/reference blocks in the key.
- Browser: start exam, previous/next, question map, mobile map open/close, save/exit, reload/resume, submitted results resume, manual grading and reload persistence, completion of all manual reviews removes the provisional label.
- Native coordinate click on 390px layout: answer changed from Broadcaster to Keystore, scrollY stayed 195 -> 195, focus remained on the selected radio.
- Native coordinate clicks on 1440px layout: selecting an answer at scrollY 0 stayed at 0; clicking Next stayed at 0 with focus on question-heading. This is the latest user-requested regression: no downward scroll after Next.
- Terminal input on 390px: scrollY 159 -> 159 while appending ` --device`; textarea remained focused and retained text.
- Keyboard: Tab to radio group, Down to next option; selected state and saved progress updated, focus visible.
- Layout dimensions 320, 390, 768, 1440: home, exam and review screenshots captured; no horizontal document overflow measured. Review at 320 visually inspected. Main final screenshot: verification/home-final.jpg.
- Model: loads in development and production build, drag changes angle, pause updates pressed state, reset restores camera/model, fallback fixture with deliberately missing GLB displays static phone and disables unavailable controls.
- Production preview at port 4173: home, topic list, Sensors practice and correct-answer explanation/reference work; captured console error list empty.
- Print-layout fixture uses the same buildPrintMarkup function and a copy of actual print CSS applied to screen. Thai explanations, English commands and source URLs visibly wrap; 62 question blocks have zero horizontal overflow. Screenshot verification/print-key.jpg.
- Course bank unchanged; bank.js and public/bank.js SHA256 both `59C4FBFD97F549F045F967E0BB629096897A6A8535249F13A30CC582CFDAB29F`.

## Limits and remaining acceptance checks
- Browser print invocation opens a blocking print workflow that the current automation cannot inspect/save. The rendered print layout and markup were checked, but a saved PDF and its paginated output are NOT verified.
- Actual browser zoom 200% was attempted; the automation key events did not change devicePixelRatio/innerWidth. Responsive widths are verified; actual 200% zoom remains unverified.
- Physical touchscreen drag and OS reduced-motion preference changes remain unverified. Code handles coarse pointer with explicit enable/disable and pan-y, and listens for reduced-motion changes. These code paths were reviewed, not represented as device tests.
- Strict design audit reports 14 actionless-button findings: four index.html buttons have real handlers registered in app.js; nine belong to the intentionally static mock; one hidden touch button in the failure fixture has a handler registered by scene.js. The production header/dialog actions were manually exercised. Static audit does not follow cross-file property handlers, so its raw result is not claimed as a clean pass.
- Build warning: lazy 3D chunk is 635KB uncompressed (~160KB gzip). It loads on home only.

## Vercel
Target: God_like (`team_UcUqRnHkza20QKaTBJdL5EUD`), project `mobile-lab-final-practice`.
Connector project creation still returns 403. Following the user-provided team dashboard URL, the signed-in Chrome session successfully created a new empty project and renamed it mobile-lab-final-practice. Project ID: prj_fcGSNQ9uUt8VPRekqrUGvZ5ysVvk. URL: https://vercel.com/god-like1/mobile-lab-final-practice. The connector cannot read this new project (404), so browser upload is required. ZIP upload is currently blocked by the ChatGPT Chrome extension lacking Allow access to file URLs. Explicit user approval has been requested before changing that permission. No production deployment exists yet. No unrelated project was modified.

Ready artifacts: dist/, MobileLab-deploy.zip, vercel.json (Vite, npm run build, dist output).

Tests used isolated origins 5173 and 4173. The user's session at 8765 was not overwritten by QA.

