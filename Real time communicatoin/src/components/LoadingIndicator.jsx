export function LoadingIndicator({ label = 'Loading feed…' }) {
  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <span className="loading-indicator__dot" />
      <span className="loading-indicator__dot" />
      <span className="loading-indicator__dot" />
      <span className="loading-indicator__label">{label}</span>
    </div>
  )
}
