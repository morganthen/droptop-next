# droptop v2

A bookmark manager rebuilt to go deeper on the full stack fundamentals I had previously learned through abstraction. This is part of an ongoing series of projects I've been building to get from frontend-comfortable to genuinely full stack.

> Work in progress. Built in public as part of my journey to mid-level.

---

## Context

This isn't my first full stack project. I've previously built:

- **Remit** - a full stack invoice app built with Next.js and Supabase
- **Decisiv** - an AI-powered task manager, also built with Next.js and Supabase

Both of those used Supabase which handles auth, database and API concerns behind the scenes. I knew it was abstracting a lot from me, so I took a deliberate step back to learn the underlying pieces properly.

That led to an Express learning series where I built several APIs from scratch in Node.js - including a full auth API with JWT and bcrypt, MongoDB with Mongoose, and a first version of Droptop using Vite + Express as a split frontend/backend architecture.

**This version** rebuilds Droptop again, this time back in Next.js but with PostgreSQL and Prisma instead of Supabase - so I'm working closer to the metal than before while still in a familiar framework.

The whole Droptop saga was built in under a day. I work closely with Claude as a learning tool - not to generate code for me, but as a senior engineer I can ask questions to, get unblocked by, and have review my attempts. Every piece of code here I wrote or attempted myself first.

---

## What it does

- Save bookmarks by pasting a URL
- Automatically pulls the page title, description and cover image via Open Graph scraping (like Pinterest)
- Tag and organise bookmarks
- Auth with JWT - your bookmarks are private to you
- Masonry card grid layout

---

## Stack

| Layer     | Tech                         |
| --------- | ---------------------------- |
| Framework | Next.js 15 (App Router)      |
| Language  | TypeScript                   |
| Database  | PostgreSQL (local)           |
| ORM       | Prisma 7                     |
| Auth      | JWT + bcrypt, rolled by hand |
| Styling   | Tailwind CSS                 |
| API       | Next.js API Routes           |

---

## What I learned building this

**Raw PostgreSQL vs Supabase**
I'd used PostgreSQL before via Supabase but never touched it directly. Setting it up locally, connecting via a connection string, and managing it through Prisma Studio and pgAdmin gave me a much clearer picture of what Supabase was doing under the hood the whole time.

**Prisma 7**
Prisma 7 has significant breaking changes from earlier versions - the database URL moved out of `schema.prisma` into a `prisma.config.ts` file, the client now requires a driver adapter (`@prisma/adapter-pg`), and the generated client import path changed. Most tutorials online are written for Prisma 6 so I had to work through the official docs and GitHub issues to get the setup right.

**Next.js API Routes vs Express**
After spending time building Express APIs I now have a clear mental model of the request/response cycle. Coming back to Next.js API routes with that foundation made them much easier to understand - they follow the same pattern, just different syntax. You export named functions (`GET`, `POST`, `DELETE`) that match HTTP methods, and return `Response` objects instead of calling `res.send()`.

**Open Graph scraping**
Used `open-graph-scraper` to fetch page metadata when a user pastes a URL. The form auto-populates title, description and image on `onBlur` of the URL input - the same mechanic Pinterest uses when you save a pin.

**Rolling JWT auth by hand**
Having done this in Express first, doing it again in Next.js was about reinforcing the mental model - not learning something new. That was intentional. I wanted the auth pattern to feel automatic before moving on.

---

## Challenges

- **Prisma 7 setup** - almost no community resources existed for this version at the time of building. Had to work through official docs, GitHub issues and source code to piece together the correct configuration.
- **Postgres locally on Mac** - the installer doesn't add the binary to PATH automatically. Had to manually add `/Library/PostgreSQL/18/bin` to `.zshrc`.
- **Type mismatches** - JWT stores `userId` as a number but TypeScript needed explicit casting at multiple points. Small detail but a good lesson in tracing types through a system end to end.

---

## Project structure

```
droptop-v2/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── bookmarks/
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   └── scrape/route.ts
│   ├── bookmarks/page.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
├── components/
│   ├── AddBookmarkForm.tsx
│   └── BookmarkCard.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── types.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
└── prisma.config.ts
```

---

## Roadmap

- [ ] Email verification on register
- [ ] Collections and folders
- [ ] Public vs private bookmarks
- [ ] Tag filtering UI
- [ ] Browser extension to save current tab
- [ ] Full text search
- [ ] Import bookmarks from browser HTML export
- [ ] Real-time collaborative collections (WebSockets)

---

## The Droptop saga

**v1** - Built with Express + MongoDB + Mongoose on the backend, Vite + React on the frontend. Two separate repos, CORS config, JWT auth from scratch, full bookmark CRUD with tag filtering.

Repo: [droptop-v1](https://github.com/morganthen/droptop) _(link when published)_

**v2** - This repo. Same app, different stack. Next.js + PostgreSQL + Prisma. One repo, API routes instead of Express, Prisma instead of Mongoose.

---

## Author

[@morganthen](https://github.com/morganthen) - learning in public, building real things.
