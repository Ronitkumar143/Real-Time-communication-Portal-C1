import { useCallback, useRef, useState } from 'react'

const MAX_EVENTS = 200

/**
 * Lightweight in-memory analytics/telemetry buffer. In a real deployment
 * trackEvent would also forward to a collector; here it just keeps a
 * capped, ordered log that the TelemetryDrawer can render, and marks
 * whether each event should be announced to assistive tech.
 */
export function useAnalytics() {
  const [events, setEvents] = useState([])
  const counterRef = useRef(0)

  const trackEvent = useCallback((name, payload = {}, opts = {}) => {
    counterRef.current += 1
    const event = {
      id: counterRef.current,
      name,
      payload,
      announce: Boolean(opts.announce),
      timestamp: Date.now()
    }

    setEvents((prev) => {
      const next = [...prev, event]
      return next.length > MAX_EVENTS ? next.slice(next.length - MAX_EVENTS) : next
    })

    console.log(name === 'message.sent' ? '[Analytics] User emitted payload' : `[Analytics] ${name}`, payload)

    return event
  }, [])

  const clearEvents = useCallback(() => setEvents([]), [])

  return { events, trackEvent, clearEvents }
}
