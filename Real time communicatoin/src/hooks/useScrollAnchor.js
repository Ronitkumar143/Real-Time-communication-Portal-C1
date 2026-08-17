import { useCallback, useEffect, useRef, useState } from 'react'

const BOTTOM_THRESHOLD_PX = 48

/**
 * Keeps a scroll container pinned to the bottom as new items arrive,
 * but stops auto-scrolling the moment the user scrolls up to read
 * history — and offers a way to jump back down.
 */
export function useScrollAnchor(dependencyList = []) {
  const containerRef = useRef(null)
  const [isPinned, setIsPinned] = useState(true)

  const isNearBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return true
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    return distance <= BOTTOM_THRESHOLD_PX
  }, [])

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
    setIsPinned(true)
  }, [])

  const handleScroll = useCallback(() => {
    setIsPinned(isNearBottom())
  }, [isNearBottom])

  useEffect(() => {
    if (isPinned) {
      scrollToBottom('auto')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList)

  return { containerRef, isPinned, handleScroll, scrollToBottom }
}
