---
doc: scope
status: approved
---

# Freelancer Swipe (working name)

A Tinder-style app where clients swipe through freelancers for a skill they need, save the ones they like, and get their contact info right away.

## The Unique Kernel
Flip the hiring flow: instead of posting a job and waiting for proposals, the client **actively browses** freelancers one card at a time and decides in seconds based on **portfolio images of past projects**. Saving a freelancer instantly reveals how to contact them. The platform only connects the two people; the conversation happens elsewhere.

## Who It's For
Individual clients and small, low-budget startups with **short, specific, fast jobs**: making a short video, testing a game, and similar. Today they post a job, wait for submissions, sift through proposals, and run slow interviews (Upwork, Facebook groups). They want to pick someone they like and talk to them now.

## The Core Loop
1. Client opens the app and enters the skill they need.
2. The app finds matching freelancers in the database and shows them **one at a time**.
3. Client looks at the card (name, location, and most importantly portfolio + project images) and swipes past or saves.
4. A save shows that freelancer's contact info and contact methods, and saves them for the client.

They come back whenever a new small job comes up.

## Inspiration & Identity
- Tinder's swipe interaction: fast, light, one card at a time, easy to swipe back and forth.
- Visual-first: portfolio images dominate the card; text is secondary.

## Why This Matters to the Learner
"Khách hàng tìm Freelancer rất nhanh." (Clients find freelancers very fast.) The current post-and-wait process is too slow; the learner wants clients to proactively find someone they like and interview them immediately. The learner's goal for the course is learning how to work with an agent.

## What "Working" Looks Like
A client opens the app, enters a skill, and the app pulls matching freelancers from the database and shows them one by one. The client swipes through and saves a few. **The "oh, that's cool" beat:** a save immediately shows that freelancer's contact details, and the saved freelancers are there in a saved list afterward.

## The POC Boundary
- Skill search → matching freelancers from a database.
- Swipe card UI, one freelancer at a time: name, location, skills, portfolio/project images.
- Swipe past or save.
- Save reveals contact info and contact methods, and adds the freelancer to a saved list.
- Freelancers come from **10–20 pre-made sample profiles** with portfolio images (seed data).

## Later
- Freelancer self-registration: sign up, fill in profile, portfolio, skills, project images, self-promotion text.
- Enforcing that freelancers must have a portfolio, skills, and project images before appearing.
- Client accounts/login so saved contacts persist per client.

## Explicitly Cut
- In-app messaging, calls, and interview scheduling. The platform only connects people; contact happens outside it.
- Job posting and proposals. This is exactly the slow flow the idea replaces.

## Changes After Judge Feedback (Oct 26)
After the "Will It Ship" live review, the scope stayed the same, but the demo and wording changed. See `judge-feedback-plan.md` for the full list.
- Sample profiles now show realistic work images that match each freelancer's skill, a portrait avatar, and a real YouTube clip, instead of random stock photos and search-page links.
- "Tick" became "save" everywhere, so the wording is the same on phone and desktop and translates cleanly.
- The freelancer form validates links properly and asks for a display name and a city plus a country chosen from a list.
