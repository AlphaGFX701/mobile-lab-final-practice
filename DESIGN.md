---
version: 1
name: Mobile Lab
description: Black and green mobile technology studio for Thai students practising English exam questions.
colors:
  background: '#090C0A'
  panel: '#141A16'
  primary: '#B5F36A'
  text: '#EDF2EA'
  muted: '#A5B0A7'
  border: '#2B352D'
  warning: '#F1C27A'
  review: '#F1A597'
typography:
  sans:
    fontFamily: 'Sarabun, Noto Sans Thai, sans-serif'
  mono:
    fontFamily: 'IBM Plex Mono, monospace'
rounded:
  DEFAULT: '8px'
  button: '4px'
spacing:
  page-max: '1328px'
  desktop-gutter: '48px'
  mobile-gutter: '20px'
  section-gap: '70px'
components:
  button: 'One .btn owner, primary and small variants'
  question: 'Native radio rows and terminal textarea'
  review: 'Native details plus radio score control'
  dialog: 'Native dialog via confirmAction'
---

# Mobile Lab design system

## Context and direction
The user's approved black–green redesign replaces the earlier blue–orange design. Hybrid register: expressive open-space 3D home, quiet functional exam and review. Thai students use phones and desktop browsers for repeated final exam practice. UI and explanations are Thai; questions, code and terminal commands stay English. The original exam uses the existing post–3 September course bank. A separate analytical mode draws scenario questions and code blanks from the same topics. A few basic project setup commands are supplementary and link to official Expo documentation.

The visual signature is a graphite phone under green rim lighting with restrained orbital lines and Bluetooth / Sensors / Commands annotations. Topic rows use whitespace and fine dividers instead of a grid of decorative cards. No marketing slogans, fake metrics, colored gradients behind exam questions, glass panels, or repeated badges.

## References and scope
- https://dribbble.com/tags/3d-website — dimensional object composition and negative space.
- https://www.magnific.com/vectors/3d-website-templates — depth and layered composition; no stock assets copied.
- https://academy.hackthebox.com/ — dark training interface with a focused green action color.
- https://grab3d.com/models/electronics/smartphone/ — CC0 phone geometry in public/smartphone.glb; materials and screen are customized locally.

These are design references only. They do not supply exam content. mock.html records the three-screen layout study inspected before app integration.

## Runtime token ownership
style.css :root is the sole runtime token owner. The palette above maps to --bg, --panel, --green, --text, --muted, --line, --warn and --wrong respectively; fonts map to --sans and --mono. app.js uses shared classes and no independent theme. scene.js necessarily maps the approved graphite/green palette to Three.js materials and a canvas texture. Changes to palette require updating this file, CSS and scene together.

## Typography and layout
Sarabun provides Thai and English reading text. IBM Plex Mono is reserved for commands, metadata, timers and scores. Google Fonts has local sans-serif/monospace fallbacks. Body line-height is 1.7; Thai explanatory paragraphs use 1.85–1.9. Headings scale with clamp. Long commands wrap without truncation.

The light theme is an approved companion to the original dark lab: CSS variables own both schemes. Light uses #f5f7f3 background, #e8eee5 panel, #356c29 accent, #1b281d text and #526557 secondary text. The theme preference is browser-local. A compact, optional timer sits in normal document flow above exam questions, preserving focus and scroll position. Countdown expiry warns without submitting; elapsed duration continues to be tracked until paused or submitted.

1328px shell, 48px desktop gutters, 28px tablet, 20px phone, 16px at <=360px. The home hero is two columns above 760px, with actions before the model on phones. Exam layout is a flexible question area plus 250px sidebar. At <=760px the question map is toggled above the question; previous/next stay in document flow so they cannot obscure answers. No viewport-height locks. Scrollbar gutter remains stable.

## Components and states
Shared .btn provides outlined secondary, filled green primary, hover border and pressed 1px offset. Native checked radio plus green border indicates selection; color is never the only signal. :focus-visible is a 2px green outline. Disabled controls lower opacity and cannot fire. Pending command grades use muted amber text, never an incorrect red grade.

All exam and topic practice modes show the same primary “ตรวจคำตอบ” action immediately after the answer input. The compact status beside it reports the result without navigation; a separate native review dialog distinguishes the student's answer, reference answer, Thai explanation, and source. Its middle scrolls while the close and Next actions remain visible. On phones it opens from the bottom; on desktop it is centered. Correct uses green, review uses coral, and short answers needing human judgment use amber, always with explicit text and an icon. Changing an answer clears the stale status and offers “ตรวจคำตอบใหม่”. Checking an unanswered question gives a local prompt without opening the dialog. Closing restores the question's scroll and focus; only an explicit Next advances.

The original native dialog confirms replacement of an unfinished session and ending a set; the review dialog is separate so their actions never conflict. Backdrops dim the app; Escape closes review, focus stays within it and returns to the check button. No custom select or menu is needed. Topic rows use fine dividers; only controls, terminal and question rows use modest radii. No box shadows on exam/review surfaces outside the modal elevation.

## Behavior and preservation
exam-core.js owns random selection and scoring. Full exams always have 50 distinct MC questions followed by 12 distinct short answers, 74 possible points. The original exam draws 12 commands. Analytical mode draws six code blanks and six commands, with at least one project creation, Android and build command. Comparison ignores only outer whitespace, preserves case and shell syntax, and accepts explicit acceptedAnswers if supplied. Otherwise pending manual review, with 0/1/2 radios. Pending points are not counted and the total is labelled provisional.

mobilelab-v1 remains the session key and old sessions without reviews continue to load. Starting a new set saves the previous snapshot under mobilelab-v1-previous. Existing bank.js and its public copy are unchanged; analysis-bank.js owns the new mode. No answers are transmitted to a server.

recordAnswer never replaces question inputs. Question changes replace only question-body and update navigation. Per the user's latest correction, Next must never scroll down automatically: focus moves with preventScroll and scrolling occurs only upward when the new heading is above the viewport. Review score updates preserve expanded details and focused inputs.

## Motion, 3D and printing
Three.js is lazy-loaded only on home. The scene pauses offscreen and when the document is hidden, releases resources on route change, and disposes late arriving loads. Reduced-motion starts paused and updates when the media preference changes. Touch devices initially retain pan-y; the explicit interaction toggle enables dragging. Mouse drag pauses auto-rotation; arrow buttons, pause and reset provide keyboard alternatives. Failure shows a code-native static phone and disables unavailable controls.

Print uses white A4 pages, black text, Thai-capable font, wrapped source URLs, separate part headings, and break-inside:avoid for each question. A separate print section sits outside #app; application controls and decorations are hidden.

## Verification
See VERIFICATION.md and verification/ screenshots. Tests are isolated on port 5173; the user's saved session on port 8765 is not used as test data.
