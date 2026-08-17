import { useState } from 'react'
import { ConnectionBanner } from './components/ConnectionBanner'
import { Header } from './components/Header'
import { CONNECTION_STATE, useLiveFeedEngine } from './components/LiveFeedEngine'
import { LoadingIndicator } from './components/LoadingIndicator'
import { MessageInput } from './components/MessageInput'
import { MessageList } from './components/MessageList'
import { TelemetryDrawer } from './components/TelemetryDrawer'
import { useAnalytics } from './hooks/useAnalytics'

export default function App() {
  const { events, trackEvent, clearEvents } = useAnalytics()
  const { connectionStatus, messageLog, retryInfo, sendMessage, retryNow } = useLiveFeedEngine({ trackEvent })
  const [telemetryOpen, setTelemetryOpen] = useState(false)

  const isInitialConnecting = connectionStatus === CONNECTION_STATE.CONNECTING && messageLog.length === 0

  return (
    <div className="app-shell">
      <Header
        connectionStatus={connectionStatus}
        messageCount={messageLog.length}
        telemetryOpen={telemetryOpen}
        onToggleTelemetry={() => setTelemetryOpen((v) => !v)}
      />

      <main className="app-main">
        <ConnectionBanner connectionStatus={connectionStatus} retryInfo={retryInfo} onRetryNow={retryNow} />

        {isInitialConnecting ? (
          <LoadingIndicator />
        ) : (
          <MessageList messages={messageLog} />
        )}

        <MessageInput onSend={sendMessage} disabled={connectionStatus !== CONNECTION_STATE.CONNECTED} />
      </main>

      <TelemetryDrawer
        open={telemetryOpen}
        events={events}
        onClose={() => setTelemetryOpen(false)}
        onClear={clearEvents}
      />
    </div>
  )
}
