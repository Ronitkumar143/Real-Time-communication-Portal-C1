# Relay — Real-Time Communication Portal

A production-oriented React application designed to demonstrate a resilient real-time communication interface using the native WebSocket API.

The application establishes a persistent `wss://` connection, displays incoming messages in real time, allows users to send messages, automatically reconnects after connection loss, sanitizes message content, maintains scroll position, and provides a lightweight telemetry interface for observing connection and messaging events.

---

## 🚀 Features

### Real-Time WebSocket Communication

* Establishes a persistent WebSocket connection on application startup.
* Uses the native browser `WebSocket` API.
* Receives incoming messages in real time.
* Allows users to send messages through the WebSocket connection.
* Displays connection state in the interface.

### Connection Management

The application maintains three connection states:

* `CONNECTING`
* `CONNECTED`
* `DISCONNECTED`

When the connection is lost, the application automatically starts the reconnection process.

### Automatic Reconnection

The application implements exponential backoff for failed connections:

```text
Attempt 1 → 1 second
Attempt 2 → 2 seconds
Attempt 3 → 4 seconds
Attempt 4 → 8 seconds
Attempt 5+ → 10 seconds maximum
```

A maximum of 10 retry attempts is supported.

Users can also manually trigger a new connection using the **Retry now** control.

### Message Sanitization

All incoming and outgoing message content passes through a sanitization layer.

The sanitizer:

* Removes HTML tags.
* Removes unsafe control characters.
* Trims unnecessary whitespace.
* Limits message length to 2000 characters.
* Prevents raw HTML from being rendered.

### Smart Scroll Behaviour

The message feed automatically remains anchored to the latest message while the user is at the bottom.

If the user scrolls upward to read previous messages:

* Automatic scrolling stops.
* New messages do not interrupt the user's reading position.
* A **Jump to latest** button appears.

### Telemetry

A dedicated telemetry drawer provides visibility into application events such as:

* Connection opened
* Connection errors
* Connection dropped
* Reconnection scheduled
* Messages sent
* Connection retry exhaustion

The telemetry buffer is capped at 200 events to prevent unbounded memory growth.

### Accessibility

Accessibility has been considered throughout the interface.

Implemented features include:

* Semantic HTML elements.
* ARIA live region for real-time messages.
* `role="status"` for connection information.
* `role="alert"` for connection-loss notifications.
* Accessible form labels.
* Keyboard-friendly message submission.
* Visible focus indicators.
* `aria-label` and `aria-controls` where appropriate.
* Reduced-motion support using `prefers-reduced-motion`.

---

## 🛠️ Technology Stack

* React 18
* Vite
* JavaScript ES2022
* Native WebSocket API
* CSS
* ESLint
* GitHub Actions

No Socket.IO or third-party WebSocket abstraction is required for the client connection.

---

## 📁 Project Structure

```text
realtime-portal/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── src/
│   ├── components/
│   │   ├── ConnectionBanner.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Header.jsx
│   │   ├── LiveFeedEngine.jsx
│   │   ├── LoadingIndicator.jsx
│   │   ├── MessageInput.jsx
│   │   ├── MessageItem.jsx
│   │   ├── MessageList.jsx
│   │   └── TelemetryDrawer.jsx
│   │
│   ├── hooks/
│   │   ├── useAnalytics.js
│   │   └── useScrollAnchor.js
│   │
│   ├── utils/
│   │   ├── backoff.js
│   │   └── sanitizer.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── eslint.config.js
├── vite.config.js
└── README.md
```

---

## ⚙️ WebSocket Configuration

The application currently uses a public WebSocket echo endpoint for development and demonstration:

```text
wss://echo.websocket.events
```

The WebSocket URL is configurable through the `useLiveFeedEngine` hook, allowing the connection to be replaced with a designated production/mock endpoint without changing the rest of the UI architecture.

---

## 💻 Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js 20+
* npm
* Git

### Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd realtime-portal
```

Install dependencies:

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the local URL displayed by Vite, normally:

```text
http://localhost:5173
```

---

## 📦 Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 🔍 Code Quality

Run ESLint:

```bash
npm run lint
```

The project also contains a GitHub Actions workflow that runs linting and production builds on pushes and pull requests targeting the `main` branch.

---

## 🔄 Application Flow

```text
Application Start
       │
       ▼
   CONNECTING
       │
       ▼
  WebSocket Open
       │
       ▼
   CONNECTED
       │
       ├───────────────┐
       │               │
       ▼               ▼
 Send Message      Receive Message
       │               │
       └───────┬───────┘
               ▼
          Message Feed
               
If Connection Drops
               │
               ▼
        DISCONNECTED
               │
               ▼
       Schedule Retry
               │
               ▼
      Exponential Backoff
               │
               ▼
          CONNECTING
               │
               ▼
          CONNECTED
```

---

## 🧹 Message Processing

Messages follow the following processing pipeline:

```text
Incoming / Outgoing Message
            ↓
      Type Validation
            ↓
      HTML Tag Removal
            ↓
   Control Character Removal
            ↓
       Whitespace Cleanup
            ↓
      Length Validation
            ↓
       Safe Message
            ↓
       Render / Send
```

---

## 📊 Telemetry Events

The application tracks important client-side events including:

| Event                        | Description                      |
| ---------------------------- | -------------------------------- |
| `connection.opened`          | WebSocket successfully connected |
| `connection.error`           | WebSocket error occurred         |
| `connection.dropped`         | Existing connection was closed   |
| `connection.retry_scheduled` | Automatic reconnection scheduled |
| `connection.gave_up`         | Maximum retry attempts reached   |
| `message.sent`               | User successfully sent a message |

---

## ♿ Accessibility

The interface follows accessibility-oriented implementation practices including:

* Semantic HTML.
* Keyboard interaction.
* ARIA labels.
* Live message announcements.
* Connection status announcements.
* Visible keyboard focus.
* Reduced-motion support.

---

## 🔐 Security Considerations

The client does not render message content using `dangerouslySetInnerHTML`.

Instead, message text is sanitized before being displayed.

Additional defensive measures include:

* Maximum message length.
* HTML tag removal.
* Control-character filtering.
* Validation of message types.
* WebSocket state verification before sending.

---

## 🧪 Validation Checklist

Before submission, verify the following:

* [ ] Application loads successfully.
* [ ] WebSocket connection is established automatically.
* [ ] Connection status changes correctly.
* [ ] Incoming messages appear in real time.
* [ ] Outgoing messages are displayed correctly.
* [ ] Empty messages cannot be sent.
* [ ] HTML content is sanitized.
* [ ] Long messages are limited.
* [ ] Connection loss triggers reconnection.
* [ ] Exponential backoff is visible through telemetry.
* [ ] Manual retry works.
* [ ] Scroll anchoring works.
* [ ] Jump-to-latest works.
* [ ] Telemetry drawer works.
* [ ] Keyboard navigation works.
* [ ] Production build completes successfully.
* [ ] ESLint completes succes
## 📌 Project Status

**Status:** Completed

**Development Duration:** 10 Days

**Application Type:** Real-Time Web Application

**Frontend:** React + Vite

**Communication:** Native WebSocket API

**Build System:** Vite

**Code Quality:** ESLint + GitHub Actions

---

## 👨‍💻 Development Notes

The application is intentionally structured around a separation between:

* Connection lifecycle management
* UI presentation
* Message processing
* Scroll behaviour
* Telemetry
* Utility functions

This architecture makes it possible to replace the current development WebSocket endpoint with a designated backend/mock endpoint without requiring major changes to the presentation layer.

---

## 📄 License

This project was developed for educational and technical evaluation purposes.
