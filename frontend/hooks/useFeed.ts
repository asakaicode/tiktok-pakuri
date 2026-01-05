import { FeedItem, fetchFeed } from '@/api/feed'
import { useCallback, useEffect, useState } from 'react'

export const useFeed = () => {
  const [items, setItems] = useState<FeedItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadFirst = useCallback(async () => {
    setRefreshing(true)

    try {
      const res = await fetchFeed({
        cursor: null,
        limit: 10,
      })

      setItems(res.items)
      setNextCursor(res.nextCursor)
      setActiveItemId(res.items[0]?.id ?? '')
    } finally {
      setRefreshing(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (loadingMore || !nextCursor) return

    setLoadingMore(true)

    try {
      const res = await fetchFeed({
        cursor: nextCursor,
        limit: 10,
      })

      setItems((prev) => {
        const seen = new Set(prev.map((x) => x.id))
        const add = res.items.filter((x) => !seen.has(x.id))
        return [...prev, ...add]
      })
      setNextCursor(res.nextCursor)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, nextCursor])

  // Load first page on mount
  useEffect(() => {
    void loadFirst()
  }, [loadFirst])

  return {
    items,
    activeItemId,
    setActiveItemId,
    refreshing,
    loadFirst,
    loadMore,
  }
}
