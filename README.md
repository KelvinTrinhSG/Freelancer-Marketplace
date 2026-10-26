# Freelancer Swipe

A Tinder-style way to hire for small, fast jobs. Pick the skill you need, browse freelancers one card at a time, judge them by their best project image, and save the ones you like. Saving shows their contact info immediately and adds them to your list. The conversation happens outside the app.

Freelancers can add themselves with a short form (display name, city and country, skills, best-project image link, optional YouTube/TikTok and portfolio links, contact) and appear in the deck right away.

**Live demo:** https://kelvintrinhsg.github.io/Freelancer-Marketplace/

## Try it

1. **I'm a Client** → choose one skill (or type one) → ✓ or swipe right to save, ✕ or swipe left to skip, ↶ to bring back the last skipped card. On desktop: → save, ← skip, Z undo.
2. Saving reveals the freelancer's contact. Open **Saved** to see everyone you saved. The list survives a reload.
3. **I'm a Freelancer** → fill the form with a skill you type yourself → back to **I'm a Client** → pick that skill and your card is in the deck.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev      # open the URL Vite prints (http://localhost:5173)
npm test         # logic tests (Vitest)
npm run build    # production build into dist/
```

## How it works

- **Frontend only:** Vite + React + TypeScript, Tailwind CSS v4, lucide-react icons. The swipe gesture is hand-written with pointer events.
- **Data:** 10 sample profiles live in `src/data/sampleFreelancers.ts`, with photos in `public/samples/`. Submitted profiles and the Saved list are stored in the browser's `localStorage` (`fs.freelancers.v1`, `fs.saved.v1`). `src/lib/storage.ts` is the only file that touches storage.
- **Deploy:** every push to `main` runs `.github/workflows/deploy.yml`, which tests, builds, and publishes to GitHub Pages.

## Known limits (proof of concept)

- **One pool per browser.** A freelancer's profile shows up only for clients using the same browser, because there is no shared server yet. A shared database (SQL Server) is planned.
- **Sample data.** Profiles tagged "Sample" are fictional. Their portraits and work images are stock images, and their videos are public YouTube clips by other creators.
- **Links are checked by format.** The form rejects malformed links, accepts only YouTube/TikTok for video, and checks that the image link actually loads, but it can't verify that the work belongs to the person.
- No accounts, profile editing, image upload, or in-app messaging. Contact happens outside the app by design.

Visual style based on [Kali-Decoder/ScratchCard](https://github.com/Kali-Decoder/ScratchCard).
