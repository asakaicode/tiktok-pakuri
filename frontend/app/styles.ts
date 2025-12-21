import { Dimensions, StyleSheet } from 'react-native'

const { height: SCREEN_H } = Dimensions.get('window')

const styles = StyleSheet.create({
  page: {
    height: SCREEN_H,
    backgroundColor: 'black',
  },
  caption: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 56,
  },
  captionText: {
    color: 'white',
    fontSize: 16,
  },
})

export default styles
