import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import useSpotify from '../hooks/useSpotify';

const ITEM_HEIGHT = 60
const ITEM_PADDING = 0
const SongItem = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.track.name}</Text>
  </TouchableOpacity>
);

export default function Songs({ playlistId }: { playlistId: string }) {
  const {songs, playSong} = useSpotify({ playlistId })
  const listRef = useRef()
  useEffect(()=>{
    console.log('songs', songs)
      if(listRef.current){
          listRef.current.scrollToEnd();

      }
  },[songs])
  return (
    <View>
      <FlatList
        ref={listRef}
        data={songs}
        renderItem={({item, index}) => <SongItem item={item} onPress={() => playSong(index)} />}
        getItemLayout={(data, index) => (
          {length: ITEM_HEIGHT + ITEM_PADDING, offset: (ITEM_HEIGHT + ITEM_PADDING + 5) * index, index}
        )}
        ListHeaderComponent={<View style={{ height: 30 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    height: ITEM_HEIGHT,
    marginVertical: ITEM_PADDING,
    marginLeft: 22,
  },
  title: {
    fontSize: 22,
  },
  developmentModeText: {
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});