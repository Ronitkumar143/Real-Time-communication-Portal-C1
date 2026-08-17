# Relay — Realtime Portal

A small React + Vite app that simulates a resilient realtime message feed:
connection lifecycle, exponential-backoff reconnects, sanitized message
rendering, scroll anchoring, and a telemetry drawer for observing what the
client is doing.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`).

## What's inside

- **`src/components/LiveFeedEngine.jsx`** — `useLiveFeedEngine` hook that
  models connection state (`connecting` → `open` → `reconnecting` /
  `offline`), simulates inbound messages, and randomly drops the
  connection so you can watch the reconnect path. Swap the simulated
  `connect`/`startStreaming` internals for a real `WebSocket`/SSE client
  to go from demo to production — the state machine and consumers don't
  need to change.
- **`src/utils/backoff.js`** — exponential backoff with full jitter and a
  capped max attempt count, used to schedule reconnects.
- **`src/utils/sanitizer.js`** — strips tags/control characters and caps
  length on any text before it's stored or rendered, for both inbound
  feed content and the composer.
- **`src/hooks/useAnalytics.js`** — capped in-memory event log
  (`trackEvent`) surfaced in the telemetry drawer.
- **`src/hooks/useScrollAnchor.js`** — keeps the feed pinned to the
  bottom on new messages, unless the reader has scrolled up, with a
  "jump to latest" affordance.
- **`src/components/`** — presentational pieces: `Header` (with a live
  pulse-strip signature), `ConnectionBanner`, `LoadingIndicator`,
  `EmptyState`, `MessageList`/`MessageItem`, `MessageInput`, and
  `TelemetryDrawer`.

## Accessibility notes

- The message list uses `aria-live="polite"` so new messages are
  announced without interrupting the reader.
- Connection state changes are exposed via `role="status"` /
  `role="alert"` in the banner.
- Focus is visibly styled, and pulse/dot animations respect
  `prefers-reduced-motion`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build
- `npm run lint` — lint the project
