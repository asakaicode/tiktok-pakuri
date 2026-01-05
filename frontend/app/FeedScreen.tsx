import { FeedItem } from '@/api/feed'
import { useCallback, useMemo, useRef } from 'react'
import { Dimensions, FlatList, RefreshControl, ViewToken } from 'react-native'
import VideoCell from './VideoCell'
import { useFeed } from '@/hooks/useFeed'

const { height: SCREEN_H } = Dimensions.get('window')

const FeedScreen = () => {
  const {
    items,
    activeItemId,
    setActiveItemId,
    refreshing,
    loadFirst,
    loadMore,
  } = useFeed()

  // ビデオがほぼ全画面になったらアクティブとみなす
  const viewabilityConfig = useMemo(
    () => ({ itemVisiblePercentThreshold: 90 }),
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
      snapToInterval={SCREEN_H}
      snapToAlignment="start"
      disableIntervalMomentum
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
