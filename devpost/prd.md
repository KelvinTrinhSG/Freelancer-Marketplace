---
doc: prd
status: approved
---

# Freelancer Swipe — Product Requirements

A Tinder-style app where small clients and startups swipe through freelancers for a skill they need, tick the ones they like, and instantly get their contact info, plus a quick form for freelancers to put themselves in the deck.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

**Freelancer side**
1. A freelancer opens the app and taps **I'm a Freelancer** on the role screen.
2. They fill a short form: name, location, skills (tick from a list; type any missing ones), YouTube/TikTok link, best-project image link, and contact info.
3. They submit and see a confirmation. Their profile is now in the pool clients swipe through.

**Client side**
1. A client opens the app and taps **I'm a Client** on the role screen.
2. They pick the skill they need from a list of skills (or type one that isn't listed).
3. Matching freelancers appear **one card at a time**: one big best-project image, name, location, skills, and a tappable YouTube/TikTok link.
4. They swipe left / tap ✕ to skip, swipe right / tap ✓ to tick. They can go back to the freelancer they just skipped.
5. A tick immediately shows that freelancer's contact info and adds them to the client's **Saved** list.
6. When they reach the end of the deck, it starts again from the first card.
7. **Success:** the client leaves with a saved list of freelancers they liked and the contact info to reach each one outside the app.

## Screens and Layout

1. **Role screen** (first screen): app name and tagline, two large rounded buttons: **I'm a Client** and **I'm a Freelancer**. Modeled on Tinder's sign-in screen.
2. **Freelancer profile form**: the fields above, the skill list as tickable chips plus a text input for a custom skill, and a Submit button.
3. **Skill picker (client)**: tickable list of skills plus a text input for a skill not in the list.
4. **Swipe deck (client)**: one card filling most of the screen; ✕, ↶ (back), ✓ buttons below; a way to open the Saved list.
5. **Contact reveal**: shown right after a tick, with the freelancer's contact info.
6. **Saved list (client)**: every ticked freelancer with their contact info.

Navigation: role screen → form (freelancer) or skill picker → deck (client). From the deck the client can reach the Saved list and change skill.

## Look and Feel
Reference (updated in `4-spec` by the learner): the ScratchCard project's theme, fonts, and UI (https://github.com/Kali-Decoder/ScratchCard), replacing the earlier Tinder orange-pink gradient.
- Black background, white text, purple accent (#876dff); dark cards with thin borders and rounded corners; soft purple glow.
- JetBrains Mono everywhere; bold, large headlines with a purple gradient.
- Role screen keeps a Tinder feel: two big, fully rounded pill buttons, in purple/black instead of white.
- Thin scrolling marquee footer.
- Overall: fast, mobile-first, visual-first; on the card, the project image dominates and text is secondary.

## Features and Behavior

### Role Selection
- [ ] First screen shows **I'm a Client** and **I'm a Freelancer**; each leads to its flow.

### Freelancer Profile Form
Source: `scope.md > The POC Boundary` (reopened by the learner during the PRD; see Product Decisions).
- As a freelancer, I want to add myself quickly so that clients can find me by skill.
  - [ ] Form has: name, location, skills, YouTube/TikTok link, best-project image link, contact info.
  - [ ] Skills show as a tickable list; a text input adds a skill not in the list, which then counts like any other skill.
  - [ ] Submitting with required fields missing shows which ones need filling and doesn't save. *(Assumption: required = name, at least one skill, image link, contact info.)*
  - [ ] After submit, a confirmation shows, and choosing one of their skills as a client shows their card in the deck.

### Skill Picker
- As a client, I want to pick the skill I need in one tap so that I see relevant freelancers right away.
  - [ ] A list of common skills is shown to tick; a text input accepts a skill that isn't listed.
  - [ ] Choosing a skill opens the swipe deck filtered to freelancers with that skill.
  - *(Assumption: the client picks one skill at a time.)*

### Swipe Deck
Source: `scope.md > The Unique Kernel`.
- As a small client, I want to judge freelancers one at a time by their best work so that I can decide in seconds.
  - [ ] One card at a time, showing one large best-project image, name, location, skills.
  - [ ] The YouTube/TikTok link is visible on the card; tapping it opens the video.
  - [ ] Swipe left or tap ✕ skips; swipe right or tap ✓ ticks.
  - [ ] Tapping back (↶) returns to the previously skipped freelancer.
  - [ ] After the last card, the deck starts again from the first card.

### Tick and Contact Reveal
- As a client, I want a tick to give me the contact info immediately so that I can reach out outside the app without waiting.
  - [ ] Ticking shows that freelancer's contact info right away.
  - [ ] The ticked freelancer appears in the Saved list.

### Saved List
- [ ] Shows every ticked freelancer with name, image, and contact info.
- [ ] Still there after closing and reopening the app on the same device.

## States and Boundaries
- **First use:** sample freelancer profiles (10–20) are already in the pool, so the deck is never empty on day one.
- **No match:** the client picks a skill nobody has → a notification says no freelancers have that skill and lets them pick again.
- **End of deck:** loops back to the first card.
- **Empty Saved list:** a short message that nothing has been ticked yet. *(Assumption.)*
- **Persistence:** the Saved list persists on the client's device across app restarts. Freelancer profiles stay in the pool.
- **Contact happens elsewhere:** the app never messages or calls. It only shows contact info.

## Product Decisions
- **Name: Freelancer Swipe.** Learner kept the working name.
- **Role screen first**, Tinder-style. Clear entry for both sides.
- **Skills: pick from a list, type if missing.** "Làm sao nhanh nhất có thể" (as fast as possible).
- **Freelancer form is in the POC** (moved from Later). Kept minimal: no upload, no account.
- **Image is a pasted link, not an upload.** Cheaper to build.
- **Only one big image per card.** Forces freelancers to pick their best project.
- **YouTube/TikTok link on the card while swiping.** Clients can check work before ticking.
- **Both swipe and ✕/✓ buttons, plus going back.** "Quẹt qua quẹt lại" (swipe back and forth).
- **End of deck loops back to the start.**
- **Visual style switched to the ScratchCard reference** (decided in `4-spec`).
- **Saved list kept on this device for now;** the learner plans a real server database (SQL Server) later. The technical choice is for `4-spec`.

## What We're Building
Role screen, minimal freelancer form, skill picker, swipe deck (swipe + buttons + back), tick → contact reveal, Saved list that survives restart, sample freelancer profiles, no-match notification, deck loop.

## Deferred From the POC
- **Accounts / login** for clients and freelancers. Saved list is per device instead.
- **Editing or deleting a freelancer profile.** Submit once is enough to demo.
- **Image upload.** Pasted link instead.
- **Enforcing portfolio quality** beyond requiring the image link.
- **Shared server database (SQL Server).** Planned by the learner for later.

## Possible Later Enhancements
- Multiple skills per client search, or filtering by location.
- Freelancer dashboard showing how many clients ticked them.

## Non-Goals
- In-app messaging, calls, interview scheduling. The platform only connects people.
- Job posting and proposals. That's the slow flow this replaces.
- Multiple images per card. One best image by design.

## Open Questions
- **For `4-spec` (must answer):** for a freelancer's new profile to show up in a client's deck, both need to see the same pool. With device-only storage that works only when both use the same device/browser, which is fine for the demo video, but must be a conscious choice in the spec. **Resolved in `4-spec`:** the learner accepted one pool per browser (sample list + profiles submitted on that browser).
- **Can wait:** exact starter skill list (e.g. short video editing, game testing, logo design…); the build can propose one.
