import { useCallback, useEffect, useRef, useState } from 'react'
import { computeBackoffDelay, hasAttemptsRemaining } from '../utils/backoff'
import { sanitizeMessageText } from '../utils/sanitizer'

export const CONNECTION_STATE = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED'
}

const SOCKET_URL = 'wss://echo.websocket.events'

function toMessageRecord(rawText, kind) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: sanitizeMessageText(rawText),
    kind, // 'incoming' | 'outgoing' | 'system'
    timestamp: Date.now()
  }
}

/**
 * Owns the WebSocket connection lifecycle: connect, listen, send, and
 * reconnect with exponential backoff on drop. Talks to a real socket
 * (the public echo test server by default) rather than simulating one.
 */
export function useLiveFeedEngine({ trackEvent, url = SOCKET_URL } = {}) {
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATE.CONNECTING)
  const [messageLog, setMessageLog] = useState([])
  const [retryInfo, setRetryInfo] = useState(null) // { attempt, delayMs, resumeAt }

  const wsRef = useRef(null)
  const attemptRef = useRef(0)
  const reconnectTimerRef = useRef(null)
  const mountedRef = useRef(true)
  const intentionalCloseRef = useRef(false)

  const appendMessage = useCallback((rawText, kind) => {
    setMessageLog((prev) => [...prev, toMessageRecord(rawText, kind)])
  }, [])

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
  }, [])

  const scheduleReconnect = useCallback(() => {
    attemptRef.current += 1
    const attempt = attemptRef.current

    if (!hasAttemptsRemaining(attempt)) {
      setRetryInfo(null)
      trackEvent?.('connection.gave_up', { attempts: attempt - 1 })
      return
    }

    const delayMs = computeBackoffDelay(attempt)
    setRetryInfo({ attempt, delayMs, resumeAt: Date.now() + delayMs })
    trackEvent?.('connection.retry_scheduled', { attempt, delayMs })

    reconnectTimerRef.current = setTimeout(() => {
      connect()
    }, delayMs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackEvent])

  const connect = useCallback(() => {
    if (!mountedRef.current) return
    intentionalCloseRef.current = false
    setConnectionStatus(CONNECTION_STATE.CONNECTING)

    let ws
    try {
      ws = new WebSocket(url)
    } catch {
      // Construction can throw synchronously for a malformed URL — treat
      // it the same as a failed connection rather than an unhandled
      // exception.
      scheduleReconnect()
      return
    }
    wsRef.current = ws

    ws.onopen = () => {
      if (!mountedRef.current) return
      attemptRef.current = 0
      setRetryInfo(null)
      setConnectionStatus(CONNECTION_STATE.CONNECTED)
      trackEvent?.('connection.opened', {})
    }

    ws.onmessage = (event) => {
      if (!mountedRef.current) return
      let text = event.data
      // Defensively handle JSON payloads as well as plain text (the echo
      // server just reflects back whatever was sent).
      if (typeof text === 'string') {
        try {
          const parsed = JSON.parse(text)
          if (parsed && typeof parsed.text === 'string') text = parsed.text
        } catch {
          // Not JSON — use the raw string as-is.
        }
      }
      appendMessage(text, 'incoming')
    }

    ws.onerror = () => {
      // Degrade gracefully — the onclose handler (fired right after by
      // the browser) is responsible for driving the reconnect flow, so
      // this just avoids an unhandled exception surfacing to the user.
      trackEvent?.('connection.error', {})
    }

    ws.onclose = () => {
      wsRef.current = null
      if (!mountedRef.current || intentionalCloseRef.current) return
      setConnectionStatus(CONNECTION_STATE.DISCONNECTED)
      appendMessage('Connection lost. Attempting to reconnect…', 'system')
      trackEvent?.('connection.dropped', {})
      scheduleReconnect()
    }
  }, [url, appendMessage, scheduleReconnect, trackEvent])

  const retryNow = useCallback(() => {
    clearReconnectTimer()
    connect()
  }, [clearReconnectTimer, connect])

  const sendMessage = useCallback(
    (text) => {
      const clean = sanitizeMessageText(text)
      if (!clean) return false
      const ws = wsRef.current
      if (!ws || ws.readyState !== WebSocket.OPEN) return false

      ws.send(clean)
      appendMessage(clean, 'outgoing')
      trackEvent?.('message.sent', { length: clean.length })
      return true
    },
    [appendMessage, trackEvent]
  )

  useEffect(() => {
    mountedRef.current = true
    connect()
    return () => {
      mountedRef.current = false
      intentionalCloseRef.current = true
      clearReconnectTimer()
      // Required cleanup: close the socket on unmount so we don't leak
      // an open connection.
      wsRef.current?.close()
      wsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    connectionStatus,
    messageLog,
    retryInfo,
    sendMessage,
    retryNow
  }
}
