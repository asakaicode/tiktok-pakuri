import { useCallback, useMemo, useRef, useState } from 'react'
import { Dimensions, FlatList, ViewToken } from 'react-native'
import VideoCell, { FeedItem } from './VideoCell'

const { height: SCREEN_H } = Dimensions.get('window')

const MOCK_DATA: FeedItem[] = [
  {
    id: '1',
    hlsUrl: 'https://example.com/video1/master.m3u8',
    caption: 'hello',
  },
  {
    id: '2',
    hlsUrl: 'https://example.com/video2/master.m3u8',
    caption: 'world',
  },
]

const FeedScreen = () => {
  const [activeItemId, setActiveItemId] = useState<string | null>(null)

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
      data={MOCK_DATA}
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
    />
  )
}

export default FeedScreen
