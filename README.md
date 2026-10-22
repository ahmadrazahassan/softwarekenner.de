# Softwarekenner

German B2B software review, comparison and buying guide platform (de-DE, EUR).

The full specification is [docs/BUILD_PROMPT.md](docs/BUILD_PROMPT.md); image rules are in [docs/IMAGE_PROMPTS.md](docs/IMAGE_PROMPTS.md). Work is planned in [docs/PLAN.md](docs/PLAN.md) and decisions are logged in [docs/DECISIONS.md](docs/DECISIONS.md).

## Requirements

- Node.js 24 (Active LTS) or newer
- pnpm (version pinned in `package.json` under `packageManager`)

## Commands

| Command                             | Purpose                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| `pnpm dev`                          | Development server (Turbopack), shows drafts; `CONTENT_PREVIEW=0` for the public view |
| `pnpm build`                        | Validate content, build the search index, then the production build (Turbopack)       |
| `pnpm content:validate`             | Schemas, cross references, publishing rules and copy lint for content/                |
| `pnpm lint:copy`                    | Copy rules (Appendix B) for UI strings                                                |
| `pnpm search:index`                 | Write public/search-index.json                                                        |
| `pnpm start`                        | Serve the production build                                                            |
| `pnpm lint`                         | ESLint (flat config)                                                                  |
| `pnpm format` / `pnpm format:check` | Prettier with the Tailwind class sorter                                               |
| `pnpm typecheck`                    | Generate route types, then `tsc --noEmit`                                             |
| `pnpm test`                         | Unit tests (Vitest)                                                                   |
| `pnpm test:e2e`                     | E2E and axe checks (Playwright), needs `CONTENT_PREVIEW=1 pnpm build` first           |
| `pnpm fonts:build`                  | Rebuild the subset web fonts from assets/fonts/source                                 |
| `pnpm check:css`                    | After a build: only brand color tokens and the three brand fonts in the compiled CSS  |

## Installed versions (Phase 0, 19 October 2026)

| Package                                        | Version                                |
| ---------------------------------------------- | -------------------------------------- |
| next                                           | 16.4.2                                 |
| react, react-dom                               | 19.3.1                                 |
| babel-plugin-react-compiler                    | 1.0.0                                  |
| typescript                                     | 6.0.3 (7.0.2 blocked, see DECISIONS)   |
| tailwindcss, @tailwindcss/turbopack            | 4.3.3                                  |
| @tailwindcss/typography                        | 0.5.20                                 |
| eslint                                         | 10.13.0                                |
| eslint-config-next                             | 16.4.2                                 |
| eslint-config-prettier                         | 10.1.8                                 |
| prettier                                       | 3.9.10                                 |
| prettier-plugin-tailwindcss                    | 0.8.1                                  |
| vitest                                         | 5.0.5 (with vite 8.3.3, see DECISIONS) |
| @playwright/test                               | 1.64.1                                 |
| @axe-core/playwright                           | 4.14.0                                 |
| @types/node                                    | 24.19.2 (matches the Node 24 runtime)  |
| @types/react, @types/react-dom                 | 19.3.0                                 |
| radix-ui                                       | 1.8.1                                  |
| class-variance-authority, clsx, tailwind-merge | 0.7.1, 2.1.1, 3.7.0                    |
| motion                                         | 14.3.0 (see DECISIONS)                 |
| lucide-react                                   | 1.59.0                                 |
| embla-carousel-react                           | 8.6.0                                  |
| cmdk                                           | 1.1.1                                  |
| subset-font (dev, font build)                  | 2.9.0                                  |
| @content-collections/core, /next, /mdx         | 0.15.3, 0.2.11, 0.2.2                  |
| zod                                            | 4.6.7                                  |
| fuse.js                                        | 7.5.0                                  |
| server-only                                    | 0.0.1                                  |
| Node.js (local)                                | 24.16.0                                |
| pnpm (local)                                   | 11.9.0                                 |

## Content

All content lives in `content/` (JSON for data, MDX for long form) and is read only through `lib/content`. `pnpm dev` shows drafts by default, so the local site shows every profile while content is being written (`CONTENT_PREVIEW=0 pnpm dev` shows the public view). Builds show drafts only with `CONTENT_PREVIEW=1`, which is fixed when the build runs. All 42 profiles are still drafts, so a normal public build shows no software until the owner verifies and publishes them. Status per profile: docs/CONTENT_STATUS.md.

## Styleguide

`/styleguide` (noindex) shows every component and state with fictitious demo data.

## Project rules in short

- German only, formal "Sie", euro only, net B2B prices.
- Fonts: Outfit, Nunito Sans and Work Sans only, self hosted via `next/font/local` (OFL files in assets/fonts).
- Colors: brand tokens from `styles/globals.css` only; the default Tailwind palette is removed.
- No em or en dashes in content or UI copy. No fabricated reviews, quotes or statistics.
- All brand and legal placeholders live in `site.config.ts`.
