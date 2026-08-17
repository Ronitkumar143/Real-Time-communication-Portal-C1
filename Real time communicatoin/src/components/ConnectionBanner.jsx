import { CONNECTION_STATE } from './LiveFeedEngine'

function formatCountdown(resumeAt) {
  const msLeft = Math.max(0, resumeAt - Date.now())
  return `${Math.ceil(msLeft / 1000)}s`
}

export function ConnectionBanner({ connectionStatus, retryInfo, onRetryNow }) {
  if (connectionStatus === CONNECTION_STATE.CONNECTED) return null

  if (connectionStatus === CONNECTION_STATE.CONNECTING && !retryInfo) {
    return (
      <div className="conn-banner conn-banner--connecting" role="status">
        Establishing connection…
      </div>
    )
  }

  return (
    <div className="conn-banner conn-banner--disconnected" role="alert">
      <span>
        Connection lost. Attempting to reconnect…
        {retryInfo ? ` (attempt ${retryInfo.attempt}, retrying in ${formatCountdown(retryInfo.resumeAt)})` : ''}
      </span>
      <button type="button" className="conn-banner__action" onClick={onRetryNow} aria-label="Retry connection now">
        Retry now
      </button>
    </div>
  )
}
