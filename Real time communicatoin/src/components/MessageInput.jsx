import { useState } from 'react'
import { isBlank, sanitizerLimits } from '../utils/sanitizer'

export function MessageInput({ onSend, disabled }) {
  const [value, setValue] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isBlank(value)) return
    const sent = onSend(value)
    if (sent) setValue('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event)
    }
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <label htmlFor="composer" className="visually-hidden">
        Message
      </label>
      <textarea
        id="composer"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? 'Reconnecting…' : 'Send a message…'}
        maxLength={sanitizerLimits.maxMessageLength}
        rows={1}
        disabled={disabled}
        aria-disabled={disabled}
      />
      <button type="submit" disabled={disabled || isBlank(value)} aria-label="Send message">
        Send
      </button>
    </form>
  )
}
