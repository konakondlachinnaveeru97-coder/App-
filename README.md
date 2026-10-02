# MERN Website

A full-stack website built with **MongoDB, Express, React (Vite), and Node.js**.

> **Design status:** the Figma design at https://pseudo-cheer-68072933.figma.site could not be
> fetched from the build environment (network policy blocked `*.figma.site` and `figma.com`).
> The layout, copy, and colors here are placeholders. To match the design, update:
> - **Copy:** `server/src/data/siteContent.js` (or the `site` document in MongoDB)
> - **Colors, fonts, spacing:** the design tokens at the top of `client/src/styles/index.css`
> - **Sections:** `client/src/sections/*`

## Structure

```
├── client/                 React + Vite frontend
│   └── src/
│       ├── components/     Navbar, Footer, forms, icons
│       ├── sections/       Hero, Stats, Services, Process, About, Testimonials, CTA
│       ├── pages/          Home, Services, About, Contact, 404
│       └── styles/         Global CSS + design tokens
└── server/                 Express + Mongoose API
    ├── src/
    │   ├── models/         Message, Subscriber, Content
    │   ├── routes/         /api/content, /api/contact, /api/subscribe
    │   └── data/           Default site content
    └── test/               API tests (node:test + supertest)
```

## Getting started

Requires Node.js 18+ and a MongoDB instance (local or MongoDB Atlas).

```bash
npm run install:all
cp server/.env.example server/.env   # set MONGODB_URI
npm run seed                          # optional: store site content in MongoDB
npm run dev                           # API on :5000, web on :5173
```

## Production

```bash
npm run build      # builds client/dist
npm start          # Express serves the API and the built React app on $PORT
```

## API

| Method | Path             | Description                                                  |
| ------ | ---------------- | ------------------------------------------------------------ |
| GET    | `/api/health`    | Server and database status                                   |
| GET    | `/api/content`   | Site copy from MongoDB, or bundled defaults                  |
| POST   | `/api/contact`   | Save a contact message `{ name, email, subject?, message }`  |
| POST   | `/api/subscribe` | Add a newsletter subscriber `{ email }`                      |

If MongoDB is unreachable, the site still renders with the default content and the form
endpoints respond with `503`.

## Tests

```bash
npm test
```
