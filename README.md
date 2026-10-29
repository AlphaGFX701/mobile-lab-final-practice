# Mobile Lab

Final exam practice for Mobile Application Development. English questions, Thai explanations and linked references. The original exam and topic practice remain available. A separate analytical exam draws scenario questions from the same course topics and adds code completion and project commands.

Each full set has 50 multiple-choice questions and 12 short answers, worth 74 points. The analytical set draws six code blanks and six commands in Part 2. Check each answer in a review dialog and advance only when you choose Next. Short answers outside the accepted answer list await manual review. Answers and optional timer state are saved locally in the browser. The interface supports light and dark themes.

The analytical questions are simulated practice, not an instructor exam or generated with a Gemini API. Most facts and examples come from the course slides and videos linked beside each explanation. Basic Expo project creation and start commands are supplementary practice linked to official Expo documentation.

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
