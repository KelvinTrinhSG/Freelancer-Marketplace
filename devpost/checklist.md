---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. A client picks a skill and flips through sample freelancer cards**
  Becomes usable: The app runs in the ScratchCard theme. Role screen → I'm a Client → pick a skill → matching sample freelancers appear one card at a time (big image, name, location, skills, video link). ✕ skips, ↶ returns to the last skipped card, ✓ moves on (saving comes in slice 3), and the deck wraps after the last card. A skill nobody has shows a "no freelancers" toast. I'm a Freelancer is visible but leads to a "coming soon" placeholder.
  Why now: This is the unique kernel (browse one card at a time, judge by the best image), so it comes first. Bootstrapping (Vite, Tailwind, theme, sample data) lands here so every later slice has a running app to build on.
  PRD ref: `prd.md > Role Selection`, `prd.md > Skill Picker`, `prd.md > Swipe Deck`, `prd.md > States and Boundaries`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Stack`, `spec.md > Look and Feel`, `spec.md > Components` (App, RoleScreen, SkillChips, SkillPicker, SwipeDeck, FreelancerCard, Toast, MarqueeFooter, Logic modules: `pool.ts`, `deck.ts`), `spec.md > Data Model`, `spec.md > File Structure`
  Build: Scaffold Vite React-TS in the project root; add Tailwind v4, lucide-react, Vitest; `.gitignore` gets `node_modules/` and `dist/`; theme tokens, JetBrains Mono, glow, marquee footer; `types.ts`, `skills.ts`, 15 labeled sample profiles; `pool.ts` and `deck.ts` with tests; RoleScreen, SkillPicker (single-select chips + typed skill), SwipeDeck with ✕/↶/✓ buttons, FreelancerCard with image-error placeholder.
  Verify (mechanical): `npm test` passes (skill normalization and matching, skip/back/wrap, one-card deck); `npm run build` succeeds with no TypeScript errors; `npm run dev` starts and the page serves.
  Learner check: Run `npm run dev`, open the URL, tap I'm a Client, pick "Short video editing", click ✕ a few times, then ↶, and keep going past the last card. Then type a skill like "underwater welding" and check that the no-match message appears. Does the theme and the card look the way you pictured?
  Commit: `Add skill picker and sample freelancer deck`

- [x] **2. Swipe the card with a finger or mouse**
  Becomes usable: Dragging the card follows the pointer and tilts. Releasing past the threshold flies the card out (left = skip, right = tick), otherwise it snaps back. The ✕/✓ buttons play the same fly-out. Tapping the video link opens it without starting a drag.
  Why now: The hand-written gesture is the biggest unknown in the spec, so it gets proven right after the deck exists, before more screens depend on it. The deck from slice 1 means the gesture only has to call existing actions.
  PRD ref: `prd.md > Swipe Deck`
  Spec ref: `spec.md > Components` (useSwipe, FreelancerCard, SwipeDeck), `spec.md > Important Failure Modes`
  Build: `hooks/useSwipe.ts` with pointer capture, translate + rotate, 30% / 100px threshold, ~200ms fly-out, `touch-action: pan-y`; wire it into SwipeDeck; buttons trigger the programmatic fly-out; the video link stops pointer propagation.
  Verify (mechanical): `npm test` and `npm run build` pass; in the browser (agent-driven or a dev-server check), simulate a drag left and right and confirm the card index changes; a short drag snaps back; clicking the link doesn't change the index.
  Learner check: In `npm run dev`, drag a card a little and let go (it should snap back), then drag it far left and far right. Try it on a phone or in the browser's mobile emulation (F12 → device toolbar). Click the video link and check that it opens in a new tab without swiping.
  Commit: `Add drag-to-swipe gesture`

- [x] **3. A tick reveals contact info and saves the freelancer, even after reload**
  Becomes usable: ✓ or a right swipe opens the contact reveal with the freelancer's contact info. The freelancer goes into the Saved list (count on the deck header), with a "Saved" badge when the deck loops. Saved survives a page reload. An empty Saved list shows a friendly message.
  Why now: This is the "oh, that's cool" beat from the scope and the first persistence, so it's the first place the data model can turn out wrong. It builds directly on the tick action from slices 1–2.
  PRD ref: `prd.md > Tick and Contact Reveal`, `prd.md > Saved List`, `prd.md > States and Boundaries` (persistence, empty Saved list)
  Spec ref: `spec.md > Components` (ContactReveal, SavedList, Logic modules: `storage.ts`), `spec.md > Data Model`, `spec.md > Important Failure Modes` (localStorage unavailable)
  Build: `storage.ts` (safe parse, `fs.saved.v1`, no duplicates) with tests; ContactReveal overlay; SavedList screen with empty state; Saved button and count on the deck; Saved badge on the card; a "Can't save on this browser" toast on storage failure.
  Verify (mechanical): `npm test` passes (save, dedupe, corrupted JSON → empty); `npm run build` passes; in the browser, tick two freelancers, reload, and confirm `localStorage["fs.saved.v1"]` holds both and the Saved list shows both.
  Learner check: Tick two freelancers and read the contact popup each time. Open Saved and check both are there. Reload the page (F5), go back to Saved, and check they're still there.
  Commit: `Add contact reveal and persistent saved list`

- [x] **4. A freelancer adds themselves and shows up in the client's deck**
  Becomes usable: I'm a Freelancer opens the form: name, location, skills (chips + custom), video link, image link, contact. Missing required fields are highlighted and nothing is saved. A valid submit shows a confirmation. As a client, the custom skill now appears in the picker, and that freelancer's card shows up in the deck. This is still there after reload.
  Why now: It completes the second side of the core journey and reuses the pool, chips, and storage already proven. It sits after the kernel because the deck was already demoable with sample data.
  PRD ref: `prd.md > Freelancer Profile Form`, `prd.md > The Core Journey` (freelancer side)
  Spec ref: `spec.md > Components` (FreelancerForm, SkillChips, Logic modules: `validate.ts`, `storage.ts`, `pool.ts`), `spec.md > Data Model`
  Build: `validate.ts` with tests; `storage.addFreelancer` / `loadFreelancers` (`fs.freelancers.v1`); `pool.getPool` and `allSkills` include submissions; SkillChips multi-select mode; FreelancerForm with errors and a confirmation panel; replace the slice-1 placeholder.
  Verify (mechanical): `npm test` passes (validation rules, http(s) links, submitted profiles merged into the pool, custom skill in `allSkills`); `npm run build` passes; in the browser, an empty submit shows errors and stores nothing, a valid submit stores one profile, and the picker → deck shows it.
  Learner check: Tap I'm a Freelancer and press Submit with everything empty (errors should show). Fill it in with a new skill you type yourself, such as "Drone filming", and a real image link. Then go to I'm a Client, pick "Drone filming", and check that your card is there.
  Commit: `Add freelancer profile form`

- [ ] **5. Anyone can open it from a public GitHub Pages link**
  Becomes usable: Pushing to `main` builds and deploys the site to GitHub Pages via GitHub Actions. The README explains what it is, how to run it, the demo steps, and the known limits (one pool per browser, sample data).
  Why now: Last, because deploying only makes sense once the full journey works. Kept small because `base: './'` was set from slice 1.
  PRD ref: `prd.md > What We're Building`
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > External Services and Dependencies`, `spec.md > Important Failure Modes` (blank page on Pages)
  Build: `.github/workflows/deploy.yml` (checkout, setup-node, `npm ci`, `npm test`, `npm run build`, configure-pages, upload-pages-artifact `dist`, deploy-pages); `README.md`. The learner creates the public GitHub repo and enables Pages → Source: GitHub Actions; the agent pushes once the learner agrees.
  Verify (mechanical): `npm run build` then `npx vite preview` serves a working app from `dist/`; after the push, the Actions run succeeds (`gh run list` or the Actions tab) and the Pages URL loads with styles and images.
  Learner check: Open the Pages link on your phone, run through the whole client journey, and add one freelancer profile.
  Commit: `Add GitHub Pages deploy workflow and README`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 2 (theme, card, and swipe feel, while there's still time to change them). Learner tried it in the browser: "quá tuyệt" (great), no changes requested.
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence:
Route and stops:
Edit outcome:
Reflection:
Activity mode:

## Revisions

