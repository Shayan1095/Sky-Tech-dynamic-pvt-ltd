# SKY Tech Dynamic — Website

The public website for **SKY Tech Dynamic Private Limited**.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS v4
- GSAP + ScrollTrigger (animation) · Lenis (smooth scrolling) · Motion
- Page copy lives in `src/content/*.md` (front matter provides SEO titles and descriptions)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Type-check and create a production build |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint                           |

## Project structure

```
src/
  app/          Routes, metadata (sitemap, robots, preview image), 404 page
  components/   Page sections, grouped by page (home, about, services, contact, shared)
  content/      Page copy (Markdown)
  lib/          Shared helpers (animation setup, site/SEO config, contact form schema)
public/         Images and artwork
```

## Environment variables

| Name                   | Required | Purpose                                                        |
| ---------------------- | -------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Yes, in production | The live address, e.g. `https://skytech.com.pk`. Used for canonical URLs, the sitemap and link previews. |

Set variables in `.env.local` for local development and in the hosting dashboard for production. Never commit `.env` files.

## Security

Security headers (Content Security Policy, HSTS, frame blocking and others) are set in `next.config.ts`.

## Status

- The contact form validates on the client and server; email delivery and lead storage are not connected yet.
- Individual service pages are not built yet; service links open the contact form with that service preselected.
