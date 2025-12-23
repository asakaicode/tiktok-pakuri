import { FeedItem, fetchFeed } from '@/api/feed'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, FlatList, RefreshControl, ViewToken } from 'react-native'
import VideoCell from './VideoCell'

const { height: SCREEN_H } = Dimensions.get('window')

const FeedScreen = () => {
  const [items, setItems] = useState<FeedItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [activeItemId, setActiveItemId] = useState<string>('')
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

  // ビデオが60%以上表示されたらアクティブとみなす
  const viewabilityConfig = useMemo(
    () => ({ itemVisiblePercentThreshold: 60 }),
    [],
  )

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<FeedItem>[] }) => {
      // アクティブになっているアイテムを取得するロジック
      const v = viewableItems.find((x) => x.isViewable)?.item

      if (v?.id) {
        setActiveItemId(v.id)
      }
    },
  ).current

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: SCREEN_H,
      offset: SCREEN_H * index,
      index,
    }),
    [],
  )

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <VideoCell item={item} isActive={item.id === activeItemId} />
      )}
      pagingEnabled
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      getItemLayout={getItemLayout}
      // for performance
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      windowSize={5}
      removeClippedSubviews
      // スクロールで次のフィードを出すためのattributes
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        void loadMore()
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void loadFirst()}
        />
      }
    />
  )
}

export default FeedScreen
