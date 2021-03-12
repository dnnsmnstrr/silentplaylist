import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import { Text, View } from './Themed';
import useSpotify from '../hooks/useSpotify';

const PlaylistItem = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.name}</Text>
  </TouchableOpacity>
);

export default function Playlists({ navigation }) {
  const {playlists, getPlaylists, setSelectedPlaylist} = useSpotify()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await getPlaylists()
    setIsRefreshing(false)
  }
  const handleSelect = (playlist) => {
    setSelectedPlaylist(playlist)
    navigation.navigate('SelectedPlaylist')
  }
  return (
    <View>
      <FlatList
        data={playlists}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        renderItem={({item}) => <PlaylistItem item={item} onPress={() => handleSelect(item)} />}
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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
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
