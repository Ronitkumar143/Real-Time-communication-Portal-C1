import { CONNECTION_STATE } from './LiveFeedEngine'

const STATE_LABEL = {
  [CONNECTION_STATE.CONNECTING]: 'Connecting',
  [CONNECTION_STATE.CONNECTED]: 'Connected',
  [CONNECTION_STATE.DISCONNECTED]: 'Disconnected'
}

export function Header({ connectionStatus, messageCount, onToggleTelemetry, telemetryOpen }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <h1>Relay</h1>
        <p className="app-header__subtitle">realtime feed</p>
      </div>

      <div className="app-header__status" role="status">
        <span className={`status-dot status-dot--${connectionStatus.toLowerCase()}`} aria-hidden="true" />
        <span className="app-header__status-label">{STATE_LABEL[connectionStatus]}</span>
        <span className="app-header__count" aria-hidden="true">
          {messageCount} msg
        </span>
      </div>

      <button
        type="button"
        className="app-header__telemetry-toggle"
        onClick={onToggleTelemetry}
        aria-pressed={telemetryOpen}
        aria-controls="telemetry-drawer"
      >
        Telemetry
      </button>
    </header>
  )
}
