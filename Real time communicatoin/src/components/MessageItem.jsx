function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function MessageItem({ message }) {
  if (message.kind === 'system') {
    return (
      <li className="message-row message-row--system">
        <span className="message-row__system-text">{message.text}</span>
        <span className="message-row__time">{formatTime(message.timestamp)}</span>
      </li>
    )
  }

  const isOutgoing = message.kind === 'outgoing'

  return (
    <li className={`message-row ${isOutgoing ? 'message-row--outgoing' : ''}`}>
      <div className="message-row__body">
        <div className="message-row__meta">
          <span className="message-row__author">{isOutgoing ? 'you' : 'server'}</span>
          <span className="message-row__time">{formatTime(message.timestamp)}</span>
        </div>
        <p className="message-row__text">{message.text}</p>
      </div>
    </li>
  )
}
