<h1 align="center">
  Printed Event Nostalgia Information Sheets
</h1>

<p align="center">
  Create and print custom event tickets at home — design, tweak, and export locally in the browser.
</p>

<p align="center">
  <a href="https://github.com/felixhir/ticket-generator/actions/workflows/build.yml"><img src="https://github.com/felixhir/ticket-generator/actions/workflows/build.yml/badge.svg" alt="Build status" /></a>
</p>

---

**Local-first.** No accounts, no cloud storage — your tickets stay in the browser until you export or print them.

**Not for real admission.** This tool is for keepsakes and DIY prints only. Do not use it to produce commercially valid or fraudulent tickets.

## Quick start

Requires **Node.js 24+**.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Development server (Turbopack) |
| `npm run build`| Production build               |
| `npm run check`| Lint & format (Biome)          |

## Stack

Next.js · React · TypeScript · Tailwind CSS · i18next
