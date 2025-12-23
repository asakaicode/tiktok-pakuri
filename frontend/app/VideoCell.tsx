import { FeedItem } from '@/api/feed'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import styles from './styles'

const VideoCell = ({
  item,
  isActive,
}: {
  item: FeedItem
  isActive: boolean
}) => {
  const player = useVideoPlayer(
    { uri: item.hlsUrl, contentType: 'hls' as const },
    (p) => {
      ;(p.loop = true), (p.muted = true)
    },
  )

  useEffect(() => {
    if (isActive) {
      player.play()
    } else {
      player.pause()
    }
  }, [isActive, player])

  return (
    <View style={styles.page}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="cover"
        // AndroidでVideoViewが重なったりするケースの回避策（必要になったらON）
        // surfaceType="textureView"
      />
      {!!item.caption ? (
        <View style={styles.caption}>
          <Text style={styles.captionText}>{item.caption}</Text>
        </View>
      ) : null}
    </View>
  )
}

export default VideoCell
