# Judge Feedback Update Plan

Source: the "Will It Ship" live review by Joe Holmes and Darlyze Calixte (Freelancer Swipe segment, about 26:16–37:14), plus the general submission checklist from the same session.

**Deadline:** Monday, Oct 26, 5:00 PM ET. Work runs top to bottom by priority. P0 must ship before the deadline. P1 should ship. P2 is only if time allows, otherwise it goes in the README's "Known limits / next steps".

## Status (Oct 26)

**Done in code and docs:** #1 (10 skill-matched work images, portrait avatars, real YouTube clips; profiles reduced from 15 to 10 so no face repeats), #2, #3, #4, #5, #6, #7, #8 (`.md` files and the `.html` companions' wording), #9 (optional portfolio link and "Listen" label for audio skills; real file upload stays a next step), and part of #10 (visible keyboard focus outline).

**Still open:** a manual pass in a real browser on desktop and phone, the remaining design polish in #10, swapping the few sample images that have watermarks or tutorial-style text (work-1, work-5, work-7, work-8), recording the demo video, pushing to `main`, and updating the Devpost submission.

---

## What the judges liked (keep these)

- The idea is creative and simple, and the first screen says what the app does.
- The look is somewhat distinctive (dark theme, purple accent, ScratchCard-inspired style).
- Swiping feels fun. ✓/✕ buttons and swipe gestures both work.
- Freelancer info is shown plainly on the card.
- The form already blocks empty or invalid required fields on submit.

---

## P0: Must fix before the deadline

### 1. Make the demo content realistic
> "The thing that holds this back as a demo the most is that I didn't get a feel for what it would actually be like to use… If I see a picture of some stock photography, what am I judging?"

Problem: the sample cards use random `picsum.photos` photos (grapes, landscapes) and video links that only open TikTok/YouTube search pages.

Changes:
- [ ] Give each sample freelancer an image that looks like real work **for their first skill**:
  - Logo design: a logo sheet
  - Social media content: a mocked Instagram/TikTok post
  - Landing page design: a website screenshot
  - Illustration: an illustration
  - Photo editing: a before/after split
  - Short video editing: a video timeline or thumbnail frame
  - Game testing: a bug-report card or screenshot
  - Voice-over / Music & sound effects: a waveform or audio-player cover
  - Subtitles & translation: a video frame with subtitles
- [ ] Store the images locally in `public/samples/` so they always load and stay consistent. Reference them with paths relative to the Vite `base`.
- [ ] Make `imageUrl` per-seed in `src/data/sampleFreelancers.ts` instead of the shared `picsum` pattern.
- [ ] Video links: point to a real, relevant public example video per skill. If that isn't possible, drop `videoUrl` from samples so no card links to a search page.
- [ ] Keep the "Sample" badge so it stays honest that profiles are fictional.

Files: `src/data/sampleFreelancers.ts`, `public/samples/*`

### 2. Replace "tick" with plain, platform-neutral wording
> "Tick… use very specific language… if it's a click say click, if it's a check say check." / "Swiping is a mobile move… then in the subtitle we have an action that describes computer mouse use. Mixed message."

Rule: one verb for the positive action everywhere, **"Save"**. Avoid device-specific verbs (tick, click, tap). "Swipe" stays in the product name, and the copy always mentions the button alternative.

| Location | Current | New |
|---|---|---|
| `src/screens/RoleScreen.tsx:15` | Swipe through freelancers for the skill you need. Tick the ones you like. Get their contact now. | Hire freelancers for small, fast jobs. Pick a skill, browse portfolios one at a time, and save the people you like to get their contact. |
| `src/components/MarqueeFooter.tsx:1` | FREELANCER SWIPE • FIND TALENT FAST • TICK TO CONNECT | Remove the marquee (see #3) |
| `src/screens/SwipeDeck.tsx:76` stamp | TICK | SAVE |
| `src/screens/SwipeDeck.tsx:102` aria-label | Tick | Save |
| `src/screens/SavedList.tsx:23` | Everyone you ticked, with how to reach them. | Everyone you saved, with how to reach them. |
| `src/screens/SavedList.tsx:28` | Nothing ticked yet. Go swipe! | No one saved yet. Browse freelancers to start. |
| `src/screens/FreelancerForm.tsx:135` hint | …watch it before ticking. | …watch it before deciding. |
| `src/screens/FreelancerForm.tsx:139` hint | Shown to clients who tick you. | Shown only to clients who save you. |
| `README.md` | "tick" throughout | "save" |

- [ ] Rename the internal `tick`/`onTick` identifiers to `save`/`onSave` (`src/App.tsx`, `src/screens/SwipeDeck.tsx`) so code and UI agree.
- [ ] Add a short hint under the deck, for example "Swipe right or press ✓ to save · Swipe left or press ✕ to skip".

### 3. Remove the confusing marquee footer
> "What's this down below? It's like something moving… I thought it was like a snake game."

- [ ] Delete `src/components/MarqueeFooter.tsx` and its usage in `src/App.tsx`. Remove the `animate-marquee` keyframes from `src/index.css` if nothing else uses them.

### 4. Strengthen link validation
> "I put http just in front of this and that worked." / "You also open yourself to security risks… you communicate to a user that this might not be the most reputable site."

Problem: `isHttpUrl` only checks the protocol. `new URL()` accepts strings like `http:foo` or `http://abc`.

Changes in `src/lib/validate.ts`:
- [ ] `isHttpUrl`: also require a hostname that contains a dot and a valid TLD-like ending (`/^[^.\s]+(\.[^.\s]+)+$/`). Reject spaces and `localhost`.
- [ ] Image link: also require that it **looks like an image**. Either the path ends in `.jpg|.jpeg|.png|.webp|.gif|.avif`, or the image actually loads. Show a live preview thumbnail under the field. If the preview fails to load, show "We couldn't load this image. Check that the link opens the image itself."
- [ ] Video link: accept only YouTube (`youtube.com`, `youtu.be`) and TikTok (`tiktok.com`) hosts, since the label promises those. Error: "Use a YouTube or TikTok link."
- [ ] Trim and cap field lengths (name ≤ 60, location ≤ 60, contact ≤ 300, custom skill ≤ 40).
- [ ] Validate on blur, not only on submit, so a bad link is flagged as soon as the user leaves the field (`src/screens/FreelancerForm.tsx`).
- [ ] Add test cases in `src/lib/validate.test.ts`: `http:foo`, `http://abc`, `https://exa mple.com`, a non-image URL for the image field, a non-YouTube/TikTok video URL, over-long fields.

Note: React already escapes rendered text, and links render with `rel="noopener noreferrer"`. Mention this in the spec security notes to show the risk was considered.

---

## P1: Should fix

### 5. Clarify the form fields
> "Name… is it display name or first and last name?" / "City, country… you may get Miami, Florida… or just Florida."

- [ ] Rename "Name" to **"Display name"** with the hint "How clients will see you, e.g. Linh Nguyen."
- [ ] Split Location into **City** (free text, optional) and **Country** (a `<select>` from a fixed country list, optional). Store as `"City, Country"` so the `Freelancer` type and existing saved data still work.
- [ ] Image field hint: explain what to do without a public link, e.g. "Upload your image to Imgur, Google Drive (public), or Behance and paste the direct image link."

### 6. Fix deck and picker wording and flow
- [ ] Deck subtitle `src/screens/SwipeDeck.tsx:60`: change "3 freelancers · card 1 of 3" to **"1 of 3"**.
- [ ] Skill picker: make the pills clearly single-choice. Either use a radio-style look (no check icon, a single highlighted state), or keep the pill and add a short highlight + "Showing freelancers for X…" transition (~300 ms) before switching screens so the jump isn't jarring (`src/screens/SkillPicker.tsx`, `src/components/SkillChips.tsx`).
- [ ] Empty skill (for example "Animation"): keep the toast, and add a suggestion: "No freelancers for Animation yet. Are you one? Add yourself."

### 7. Make desktop feel natural
> "The swipe on desktop is… probably not really necessary."

- [ ] Add keyboard shortcuts: ← skip, → save, Backspace/Z undo. Show them in the hint line on wide screens.
- [ ] Keep swipe as the main gesture on touch devices. On desktop, the buttons are the main action.

### 8. Bring the planning docs in line with what was built
> Checklist: "Your public repo includes scope.md, prd.md, and spec.md, and they match what you built."

- [ ] `devpost/prd.md`: update the copy ("tick" → "save"), the form fields (Display name, City/Country), validation rules, and removing the marquee.
- [ ] `devpost/spec.md`: update the validation rules, sample-image approach (`public/samples/`), keyboard shortcuts, and security notes.
- [ ] `devpost/scope.md`: check that it still matches. Add a "Changes after judge feedback" section linking to this plan.
- [ ] Regenerate `prd.html`, `spec.html`, `scope.html`, and `app-map.html` if they are kept in the repo.
- [ ] `README.md`: update "Try it" with the new wording.

---

## P2: Only if time allows (otherwise list as next steps)

### 9. Support non-image portfolios
> "If the list… was audio design and this other stuff too… you need to be able to support people uploading audio they're proud of."

- [ ] Allow an optional "Portfolio link" (SoundCloud, Behance, GitHub, website) next to the image.
- [ ] For audio skills, show a waveform-style cover and a "Listen" link instead of "Watch".
- [ ] Longer term: real file upload, which needs the planned shared backend.

### 10. Design polish (reduce the "AI flavor")
- [ ] Add one or two signature details that are clearly yours, for example a custom card back, a distinctive "SAVED" stamp animation, or a personal empty-state illustration.
- [ ] Check hover/focus states on every button and chip.

---

## Submission checklist (from the session)

- [ ] Judges can get in without an account. **Already met**: no login.
- [ ] The first screen says what the app does and who it's for (covered by #2's new hero copy, which names "small, fast jobs" and clients/freelancers).
- [ ] Demo video: **show the app within the first few seconds**, with no long intro. Under 30 seconds, show a client picking a skill, swiping, saving, and seeing the contact. Then show the freelancer form. Then walk through the build process with the skill pack: scope → PRD → spec → build, where it was hard, what changed after judge feedback.
- [ ] Public repo contains `scope.md`, `prd.md`, `spec.md` that match the app (#8).
- [ ] Design looks directed, not default one-prompt output (#1, #10).
- [ ] Devpost write-up mentions what changed after the live review.

---

## Verification before re-submitting

- [ ] `npm test`: all tests pass, including the new validation cases.
- [ ] `npm run build`: succeeds.
- [ ] Manual pass on desktop and on a phone (or devtools mobile view):
  - [ ] No "tick" anywhere: `grep -rni tick src README.md devpost/*.md` returns nothing user-facing.
  - [ ] Every sample card shows a work-like image that matches its skill.
  - [ ] `http:foo`, `http://abc`, and a non-image link are rejected with clear messages. A non-YouTube/TikTok video link is rejected.
  - [ ] Keyboard ← / → / undo work on desktop.
- [ ] Push to `main`. The GitHub Pages deploy succeeds, and the live demo shows the changes.
- [ ] Update the Devpost submission (video + description) before 5:00 PM ET.
