# Naanda

A one-page personal site. It shows the name Naanda, a short sentence, and two links: LinkedIn and GitHub. The sentence and both profile URLs are placeholders.

The page is a single Next.js route. Pictures and video live in `public/sites/`. The page component is `src/app/page.tsx`.

## Run

[Bun](https://bun.sh) 1.4 or newer.

```bash
bun install
bun run dev
```

Open http://localhost:3000.

## Scripts

| Command             | What it does               |
| ------------------- | -------------------------- |
| `bun run dev`       | Start the dev server       |
| `bun run build`     | Production build           |
| `bun run start`     | Serve the production build |
| `bun run lint`      | ESLint                     |
| `bun run typecheck` | TypeScript check           |
| `bun run check`     | Lint, typecheck, and build |
