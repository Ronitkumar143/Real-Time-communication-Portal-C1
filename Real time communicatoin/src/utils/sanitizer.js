/**
 * Sanitizes text coming from the live feed or the composer before it is
 * rendered or stored. We never render raw HTML from either source, but we
 * still strip tags defensively and normalize whitespace/length so a
 * malformed payload can't blow up layout or hide control characters.
 */

const MAX_MESSAGE_LENGTH = 2000

const TAG_PATTERN = /<[^>]*>/g

// Strip ASCII control characters (0-8, 11, 12, 14-31) without a literal
// control-character regex, which linters flag as a likely mistake.
function stripControlChars(text) {
  let out = ''
  for (const ch of text) {
    const code = ch.charCodeAt(0)
    const isControl = (code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31)
    if (!isControl) out += ch
  }
  return out
}

export function sanitizeMessageText(input) {
  if (typeof input !== 'string') return ''

  let clean = stripControlChars(input.replace(TAG_PATTERN, ''))
    .replace(/\s+\n/g, '\n')
    .trim()

  if (clean.length > MAX_MESSAGE_LENGTH) {
    clean = clean.slice(0, MAX_MESSAGE_LENGTH).trimEnd() + '…'
  }

  return clean
}

export function sanitizeAuthorName(input) {
  if (typeof input !== 'string') return 'unknown'
  const clean = stripControlChars(input.replace(TAG_PATTERN, '')).trim()
  return clean.slice(0, 64) || 'unknown'
}

export function isBlank(input) {
  return sanitizeMessageText(input).length === 0
}

export const sanitizerLimits = {
  maxMessageLength: MAX_MESSAGE_LENGTH
}
