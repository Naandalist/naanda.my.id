# Naanda

A one-page personal site. It shows the name Naanda, a short sentence, and two links: LinkedIn and GitHub. The sentence and both profile URLs are placeholders.

The page is a single Next.js route. Pictures and video live in `public/sites/`. The page component is `src/app/page.tsx`.

## Run

Node.js 24 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run check` | Lint, typecheck, and build |
