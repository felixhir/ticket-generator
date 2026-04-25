# Agent Build Guide

This file tells AI agents how to work in this repository. Read `DESIGN.md` before making product or UI decisions.

## Project Overview

This is a Next.js App Router application for creating printable event nostalgia tickets. The app is a local-first ticket creation studio with no account, auth, profile, wallet, or cloud ownership model. Tickets are created, edited, stored in the browser, and exported locally.

Current stack:

- Next.js 16 with the App Router in `src/app`.
- React 19.
- TypeScript with `strict` mode.
- Tailwind CSS 4 configured through `src/app/globals.css`.
- shadcn/ui registry components in `src/components/ui`, customized to the app tokens.
- Biome for formatting and linting.
- Husky pre-commit running `npm run check`.

## Repository Structure

Keep routing separate from implementation code. The `src/app` tree should describe URL structure, not become a general-purpose source folder.

Important areas:

- `src/app/`: App Router routes, layouts, route handlers, route metadata, `favicon.ico`, and `globals.css` only.
- `src/app/[locale]/`: localized user-facing routes. The locale layout owns the server-rendered `<html lang>`.
- `src/app/(redirects)/`: legacy root/current URL redirects such as `/`, `/create`, `/privacy`, and `/imprint`.
- `src/app/api/import/route.ts`: thin API route wrapper for URL import requests.
- `src/components/app/`: server-rendered app frame components such as `AppShell` and footer.
- `src/components/ui/`: shadcn/ui registry components and shared UI primitives such as buttons, cards, fields, dialogs, popovers, and tabs.
- `src/components/providers/`: scoped client providers. Mount providers as deep as possible.
- `src/components/shared/`: reusable shared widgets that are not screen-specific.
- `src/components/studio/`: ticket studio orchestration, screens, editor workspace, panels, and studio providers.
- `src/components/tickets/`: printable ticket renderer, ticket layouts, and ticket building blocks.
- `src/lib/domain/`: serializable domain types, defaults, enums, and pure domain helpers.
- `src/lib/i18n/`: server translation and locale routing helpers.
- `src/lib/ticket/`: pure ticket layout, sizing, color, and CSS helper functions.
- `src/lib/storage/`: browser storage helpers. These must only be imported from client components or client hooks.
- `src/lib/server/`: server-only implementation helpers for route handlers and server code.
- `src/lib/hooks/`: shared React hooks.
- `src/i18n/`: i18next setup, resources, and locale JSON.
- `public/`: static assets served by URL.

Use the `@/*` path alias for source imports. It maps to `./src/*`; do not import implementation code through `@/app/...`.

## Architecture Direction

Prefer modern Next.js App Router patterns.

- Components are Server Components by default. Add `'use client'` only where React state, effects, event handlers, refs, browser APIs, local storage, or client-only i18n hooks are required.
- Keep `src/app` route files thin. They should compose components rather than own application behavior.
- Prefer localized server routes under `src/app/[locale]` for user-facing pages so translated HTML and `<html lang>` are correct before hydration.
- Keep client boundaries small. A route or layout should not become a Client Component just because one nested control is interactive.
- Put data fetching, remote URL imports, HTML parsing, and secret-bearing logic on the server in route handlers or `src/lib/server`.
- Keep browser persistence in client-only code under `src/lib/storage`, client hooks, or client components. Never read `window`, `document`, or `localStorage` during server render.
- Pass serializable data from Server Components to Client Components, such as `locale` strings or translated labels.
- Use route handlers for HTTP APIs such as importing an event from a URL.
- Preserve print/export behavior while redesigning.

## Component Standards

Shared UI building blocks are important in this project. Do not build every screen from raw Tailwind classes.

Create and reuse small primitives for repeated UI patterns:

- App shell and page frame.
- Tabs.
- Buttons.
- Inputs and textareas.
- Cards.
- Empty states.
- Dialogs or popovers.
- Ticket preview cards.
- Form sections and field rows.

Use shadcn/ui for reusable app controls. Add new primitives with the shadcn CLI when a registry component exists, keep the lowercase file naming and named exports it generates, and customize the copied component in place to consume the app tokens. Do not reintroduce legacy uppercase UI primitive files such as `Button.tsx` or `Card.tsx`.

Prefer composition over large configuration objects. A shared component should encode visual consistency while still accepting normal React content.

Keep component responsibilities narrow:

- App-level frame and legal/footer chrome belong in `src/components/app`.
- Static app chrome, imprint, and privacy content should remain Server Components in `src/app/[locale]/` and use server translations.
- Generic reusable primitives belong in `src/components/ui`.
- Ticket data editing belongs in `src/components/studio`.
- Printable ticket rendering belongs in `src/components/tickets`.
- Visual ticket customization belongs in studio panels and domain-safe design types.
- Browser persistence belongs in `src/lib/storage` and must be called from client code only.
- Server import logic belongs in `src/lib/server/import`, with `src/app/api/*/route.ts` kept as a wrapper.

Remove confirmed-unused legacy code instead of moving it forward. If a component is intentionally kept for later, document the owner and expected use in code structure, not as a hidden orphan.

## Styling And Design Tokens

The visual system must be flexible. Define shared design decisions once, then consume them everywhere.

- Use Tailwind 4 `@theme` tokens and CSS variables in `src/app/globals.css`.
- Keep shadcn theme variables such as `--background`, `--foreground`, `--primary`, `--border`, and `--ring` mapped to the app semantic tokens instead of maintaining a separate palette.
- Do not hardcode palette hex values in React components.
- Avoid direct Tailwind default grays for app chrome once semantic tokens exist.
- Avoid repeated arbitrary values for font sizes, spacing, radii, shadows, and layout dimensions.
- Keep app chrome tokens separate from ticket design tokens.
- Keep global element styles, print rules, and theme tokens in `src/app/globals.css`, imported by the localized root layout.
- Colocate component CSS only when it is specific to a ticket layout or isolated renderer.
- Use `Ogg` as the app font once the local font asset is available.

Preferred class style:

- `bg-app-background`
- `bg-app-surface`
- `text-app-text-primary`
- `text-app-text-secondary`
- `border-app-border`
- `font-app`

Ticket-specific theme variables such as `--ticket-primary` may remain separate because tickets are user-customizable output, not app chrome.

## State And Persistence

The app is local-first.

- Store created tickets in browser local storage with the versioned key in `src/lib/storage/tickets.ts`.
- Keep stored ticket data serializable. Store dates as strings and parse them at boundaries in `src/lib/domain/stored-ticket.ts`.
- Do not introduce backend persistence unless the user explicitly asks for it.
- Keep transient UI state close to the component that owns it.
- Use context sparingly for state shared across distant parts of the app.

When local storage is involved, design for hydration carefully: render a stable server shell first, then load browser-only data in a client boundary.

## TypeScript Practices

Use TypeScript as a design tool, not just syntax.

- Prefer explicit domain types for ticket content, design settings, stored tickets, and import results.
- Keep pure types and defaults in `src/lib/domain` when they are shared across components or server code.
- Avoid `any`; use `unknown` at unsafe boundaries and narrow it.
- Keep server and client types serializable when they cross the RSC boundary.
- Use discriminated unions for meaningful UI or import states.
- Keep parsing and normalization functions pure where possible.
- Do not hide real errors behind broad fallback values.

## Next.js Practices

Use the framework intentionally.

- Keep localized root layouts focused on metadata, font variables, global CSS imports, locale validation, and the HTML shell.
- Prefer nested server components for static layout and presentation.
- Use client components for controls, tabs, forms, local storage, previews that need browser APIs, and export actions.
- Scope client providers to the smallest subtree that needs them. The i18n client provider belongs around the interactive studio, not static legal pages.
- Use route handlers for event import endpoints and other server-only operations.
- Keep server-only route helper modules under `src/lib/server`. These modules must not import hooks, client providers, browser storage, or DOM APIs.
- Use `next/font/local` for local fonts.
- Use `next/image` when image optimization is compatible with deployment. The current config has `images.unoptimized` enabled for static deployment.

## Code Quality

Modern coding best practices apply throughout the repo.

- Keep functions small and named around intent.
- Favor readable data flow over clever abstractions.
- Extract shared logic only when there is real reuse or a clear boundary.
- Prefer accessible semantic HTML before adding ARIA.
- Use forms, labels, buttons, and tabs with keyboard behavior in mind.
- Do not add comments that merely narrate code. Add comments only for non-obvious constraints or tradeoffs.
- Keep imports tidy and use the `@/*` path alias for source imports.
- Do not reintroduce `@/app/...` imports for implementation code.

## Dev Setup And Tooling

Use Node `>=24` to match `package.json`.

Common commands:

```bash
npm install
npm run dev
npm run check
npm run format
npm run build
```

Tooling notes:

- `npm run dev` starts Next with Turbopack.
- `npm run check` runs `biome check .`.
- `npm run lint` is an alias for `biome check .`.
- `npm run format` runs `biome check --write .`.
- The pre-commit hook runs `npm run check`.
- Do not reintroduce ESLint or Prettier unless the user asks for a tooling change.

Before finishing substantive code changes, run at least `npm run check` when practical. For architecture, SSR, routing, import alias, or build-sensitive changes, also run `npm run build`.

## Product Constraints

Preserve these constraints from `DESIGN.md`:

- No users, accounts, auth, profiles, balances, or wallets.
- Landing screen prompts for import by URL or manual entry.
- The first three locally stored tickets appear at the bottom of the landing screen.
- Primary navigation is simple tabs: `Your Tickets`, `Design`, `Settings`.
- Colors, typography, spacing, and radii should be tokenized.
- The app should feel like a polished dark local design tool, not an admin dashboard.
