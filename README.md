# droptop v2

A bookmark manager built as a learning project to solidify full stack development skills. This is the second version of Droptop - the first was built with Vite + Express + MongoDB. This rebuild uses a completely different stack to deepen understanding of each layer.

> Work in progress. Built in public as part of my journey from frontend to full stack.

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

**PostgreSQL and relational databases**
Coming from MongoDB, this was my first real project with a relational database. Understanding tables, columns, migrations and how relations work between models was a big shift from the document-based thinking I was used to.

**Prisma 7**
Prisma 7 has significant breaking changes from earlier versions - the database URL moved out of `schema.prisma` into a `prisma.config.ts` file, the client now requires a driver adapter (`@prisma/adapter-pg`), and the generated client import path changed. Most tutorials online are written for Prisma 6 so I had to work through the official docs and GitHub issues to get it right.

**Next.js API Routes vs Express**
In my first version I had a separate Express backend and a Vite frontend as two different repos. This time everything lives in one Next.js project. API routes follow the same request/response mental model as Express but with a different syntax - you export named functions (`GET`, `POST`, `DELETE`) that match HTTP methods, and return `Response` objects instead of calling `res.send()`.

**Open Graph scraping**
Used `open-graph-scraper` to fetch page metadata when a user pastes a URL. The form auto-populates title, description and image on `onBlur` of the URL input - the same mechanic Pinterest uses when you save a pin.

**JWT auth without a library**
Signed and verified JWT tokens manually with `jsonwebtoken` and `bcryptjs`. Auth middleware in Next.js API routes is just a helper function you call at the top of each protected route, rather than Express-style middleware chaining.

---

## Challenges

- **Prisma 7 setup** - almost no community resources existed for this version at the time of building. Had to read source code, GitHub issues and official docs to piece together the correct configuration.
- **Postgres locally** - setting up PostgreSQL locally on Mac required manually adding the binary path to `.zshrc` since the installer doesn't do it automatically.
- **Type mismatches** - JWT stores `userId` as a number but TypeScript needed explicit casting at multiple points. Small thing but a good lesson in tracing types through a system.

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

This is a living project. Planned additions:

- [ ] Email verification on register
- [ ] Collections and folders
- [ ] Public vs private bookmarks
- [ ] Tag filtering UI
- [ ] Browser extension to save current tab
- [ ] Full text search
- [ ] Import bookmarks from browser HTML export
- [ ] Real-time collaborative collections (WebSockets)

---

## Version 1

The first version of Droptop was built with a split architecture:

- Backend: Express + MongoDB + Mongoose + JWT
- Frontend: Vite + React + TypeScript

Repo: [droptop-v1](https://github.com/morganthen/droptop) _(link when published)_

---

## Author

[@morganthen](https://github.com/morganthen) - learning in public, building real things.
