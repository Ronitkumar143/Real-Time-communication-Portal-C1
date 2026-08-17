function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function TelemetryDrawer({ open, events, onClose, onClear }) {
  return (
    <aside
      id="telemetry-drawer"
      className={`telemetry-drawer ${open ? 'telemetry-drawer--open' : ''}`}
      aria-hidden={!open}
    >
      <div className="telemetry-drawer__header">
        <h2>Telemetry</h2>
        <div className="telemetry-drawer__actions">
          <button type="button" onClick={onClear}>
            Clear
          </button>
          <button type="button" onClick={onClose} aria-label="Close telemetry drawer">
            ✕
          </button>
        </div>
      </div>

      <ol className="telemetry-drawer__list">
        {events.length === 0 && <li className="telemetry-drawer__empty">No events recorded yet.</li>}
        {[...events].reverse().map((event) => (
          <li key={event.id} className="telemetry-drawer__item">
            <span className="telemetry-drawer__time">{formatTime(event.timestamp)}</span>
            <span className="telemetry-drawer__name">{event.name}</span>
            {Object.keys(event.payload || {}).length > 0 && (
              <span className="telemetry-drawer__payload">{JSON.stringify(event.payload)}</span>
            )}
          </li>
        ))}
      </ol>
    </aside>
  )
}
