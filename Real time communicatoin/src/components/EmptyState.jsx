export function EmptyState() {
  return (
    <div className="empty-state">
      <span className="empty-state__glyph" aria-hidden="true">
        ◌
      </span>
      <p className="empty-state__title">No signal yet</p>
      <p className="empty-state__body">Messages will appear here the moment the feed starts streaming.</p>
    </div>
  )
}
