import { useScrollAnchor } from '../hooks/useScrollAnchor'
import { EmptyState } from './EmptyState'
import { MessageItem } from './MessageItem'

export function MessageList({ messages }) {
  const { containerRef, isPinned, handleScroll, scrollToBottom } = useScrollAnchor([messages.length])

  return (
    <div className="message-list-wrap">
      <ul
        className="message-list"
        ref={containerRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Live message feed"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((message) => <MessageItem key={message.id} message={message} />)
        )}
      </ul>

      {!isPinned && messages.length > 0 && (
        <button
          type="button"
          className="jump-to-latest"
          onClick={() => scrollToBottom()}
          aria-label="Jump to latest message"
        >
          ↓ Jump to latest
        </button>
      )}
    </div>
  )
}
