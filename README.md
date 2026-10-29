# Mobile Lab

Final exam practice for Mobile Application Development. English questions, Thai explanations and course references. Full sets contain 50 multiple-choice questions and 12 command questions, worth 74 points. Check each answer in place without moving to the next question; commands outside the accepted answer list await manual review. Answers and optional timer state are saved locally in the browser. The interface supports light and dark themes.

## Run

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

## Validate and build

```sh
npm test
npm run build
```

## Vercel

Connect the repository to the `mobile-lab-final-practice` project in the `god-like1` team. Select Vite, build with `npm run build`, and serve `dist`. No environment variables are required. Configuration is in vercel.json.

Design references and model credit are documented in DESIGN.md. Course references are linked from each answer explanation.
