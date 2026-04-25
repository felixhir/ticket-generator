# Design Direction

This document is the product and visual design contract for AI agents working on the redesign. The application should feel like a compact, polished dark dashboard inspired by the attached reference image: a rounded charcoal app shell, generous spacing, soft borders, clear tab navigation, and a focused central workspace.

Do not introduce a user, account, profile, authentication, wallet, or balance concept. The app is local-first and centered on creating, storing, editing, and exporting event tickets.

## Product Model

The app helps a user create printable event nostalgia tickets.

Primary flows:

- Import an event from a URL.
- Enter event data manually.
- View locally stored tickets.
- Edit ticket content and design.
- Adjust app or export settings.

Tickets must be stored in browser local storage. Treat the browser as the source of truth unless the user explicitly asks for backend storage later.

## Information Architecture

Use a simple tab-based navigation model:

- `Your Tickets`
- `Design`
- `Settings`

The navigation should be visually lightweight and should not imply accounts or user-owned cloud data. It can live along the top of the app shell, similar to the reference image, or as a simple horizontal tab row within the main frame.

Avoid sidebars for primary navigation unless a specific editing panel needs one. The overall app should remain simple and focused.

## Landing Screen

The home or landing screen should be a centered, minimal decision screen.

Required content:

- A short title explaining that the user can create a ticket.
- A primary action to import an event by URL.
- A secondary action to enter data manually.
- A small section at the bottom showing the first three locally stored tickets.

The stored ticket preview section should be understated. If no tickets exist, show a quiet empty state instead of hiding the section entirely.

The landing screen must not show:

- User avatar
- User name
- Login or signup controls
- Account settings
- Balance, credits, payments, or wallet UI

## Visual Structure

Use the attached image as structural inspiration, not as a literal domain copy.

Desired qualities:

- A full-screen charcoal background.
- A centered rounded application frame.
- Thin dividers and borders.
- A tab row with clear active state.
- Large, calm headings.
- Cards for major content areas.
- Dense controls only where the user is editing a ticket.
- Soft contrast instead of bright brand colors.

The app should feel more like a crafted design tool than a form-heavy admin page.

## Color System

All colors must be defined through CSS variables and Tailwind theme tokens. Do not hardcode hex values in components.

Required base palette:

- Background: `#121212`
- Primary Text: `#E0E0E0`
- Secondary Text: `#B0B0B0`
- Borders/Dividers: `#444444`
- Accent: `#888888`

Recommended semantic variables:

```css
:root {
    --app-background: #121212;
    --app-surface: #181818;
    --app-surface-elevated: #202020;
    --app-text-primary: #E0E0E0;
    --app-text-secondary: #B0B0B0;
    --app-border: #444444;
    --app-accent: #888888;
    --app-accent-foreground: #121212;
}
```

Recommended Tailwind 4 tokens:

```css
@theme {
    --color-app-background: var(--app-background);
    --color-app-surface: var(--app-surface);
    --color-app-surface-elevated: var(--app-surface-elevated);
    --color-app-text-primary: var(--app-text-primary);
    --color-app-text-secondary: var(--app-text-secondary);
    --color-app-border: var(--app-border);
    --color-app-accent: var(--app-accent);
    --color-app-accent-foreground: var(--app-accent-foreground);
}
```

Components should use semantic classes such as `bg-app-background`, `bg-app-surface`, `text-app-text-primary`, `text-app-text-secondary`, `border-app-border`, and `bg-app-accent`.

## Typography

Use `Ogg` as the app font.

The font should be added as a local font asset and configured centrally, preferably through `next/font/local` in `app/layout.tsx`. Expose it as a single CSS variable or Tailwind font token so components never reference raw font-family strings.

Recommended approach:

```tsx
const ogg = localFont({
    src: './fonts/Ogg.woff2',
    variable: '--font-app',
    display: 'swap'
})
```

Then define Tailwind tokens for type usage instead of hardcoding arbitrary font sizes in components.

Recommended typography tokens:

```css
@theme {
    --font-app: var(--font-app);
    --text-app-display: 3rem;
    --text-app-title: 2rem;
    --text-app-heading: 1.25rem;
    --text-app-body: 1rem;
    --text-app-small: 0.875rem;
    --text-app-caption: 0.75rem;
}
```

Use the same tokenized approach for font weight, line height, letter spacing, spacing, radius, and shadows when a value is reused.

## Layout Tokens

Avoid repeated arbitrary values in components. Define shared tokens for common layout decisions.

Recommended tokens:

```css
@theme {
    --radius-app-shell: 2rem;
    --radius-app-card: 1.25rem;
    --radius-app-control: 9999px;
    --spacing-app-frame: 2rem;
    --spacing-app-section: 1.5rem;
    --spacing-app-card: 1rem;
}
```

Prefer semantic utility classes derived from tokens over hardcoded values like `rounded-[32px]`, `p-[23px]`, or text sizes that only exist once.

## Components

Expected high-level components:

- `AppShell`: owns the outer rounded frame, global background, and tab navigation.
- `LandingScreen`: owns the centered import/manual choice and stored ticket previews.
- `TicketTabs`: owns the `Your Tickets`, `Design`, and `Settings` tab navigation.
- `StoredTicketPreview`: compact preview card for saved tickets.
- `TicketEditor`: content editing surface for manual entry.
- `DesignPanel`: visual customization controls.
- `SettingsPanel`: export and app preferences only.

Component names can differ if the codebase already establishes better names, but keep the responsibilities clear.

## Local Storage

Persist tickets in local storage using a versioned key.

Recommended key:

```ts
const TICKETS_STORAGE_KEY = 'ticket-generator:tickets:v1'
```

Stored data should be serializable JSON. Dates should be stored as strings and parsed at the app boundary.

Keep local storage access out of server components. In Next.js, local storage logic must live in client components, hooks, or context providers.

## Interaction Guidelines

Import by URL should feel like the fastest path:

- The landing screen should open a focused URL input flow.
- Loading and error states should be clear but quiet.
- A successful import should create or preview a ticket without requiring an account.

Manual entry should feel approachable:

- Start with the few fields required for a useful ticket.
- Put advanced fields behind the editing flow, not on the landing screen.
- Keep the preview visible when practical.

Saved tickets:

- Show only the first three stored tickets on the landing screen.
- The full list belongs in `Your Tickets`.
- Selecting a stored ticket should open it for viewing or editing.

## Implementation Rules

Follow these rules when redesigning:

- Do not add account, auth, session, avatar, or profile abstractions.
- Do not hardcode palette colors in React components.
- Do not hardcode repeated font sizes, spacing, radii, or shadows in React components.
- Do not introduce backend persistence for tickets.
- Do not use Tailwind default grays directly for app surfaces once semantic tokens exist.
- Keep ticket design-specific colors separate from app chrome colors.
- Prefer simple client state plus local storage over global complexity unless the app needs more.
- Preserve print/export behavior where possible.

## Accessibility

The dark theme still needs readable contrast. Use primary text for main content, secondary text for supporting copy, and borders for separation rather than low-contrast text.

All actions must be keyboard reachable. Tabs should have clear active and focus states. Form controls should have labels, not placeholder-only labels.

## Redesign Goal

The final app should be a small local-first ticket creation studio:

- No accounts.
- No cloud ownership model.
- No visual clutter.
- Clear import/manual entry paths.
- Stored tickets visible immediately.
- Tokenized design system that can be changed from one place.
