import * as WebBrowser from 'expo-web-browser';
import React, {useState} from 'react';
import { StyleSheet, Button, FlatList, TouchableOpacity, TextInput } from 'react-native';

import Colors from '../constants/Colors';
import { Text, View } from './Themed';
import useSpotify from '../hooks/useSpotify';

const SearchItem = ({ item, onPress, onLongPress, style }) => (
  <TouchableOpacity onPress={() => onPress(item.uri)} onLongPress={() => onLongPress(null, item.uri)} style={[styles.item, style]}>
    <Text style={styles.title}>{item.name}</Text>
    <Text style={styles.artist}>{item.artists.map(({name}) => name).join(', ')}</Text>
  </TouchableOpacity>
);

export default function Search({goBack}) {
  const {searchSongs, getSongs, addToPlaylist, playSong} = useSpotify()
  const [query, setQuery] = useState()
  const [results, setResults] = useState()

  const handleSearch = async () => {
    const res = await searchSongs(query)
    console.log('res', res)
    setResults(res)
  }

  const handleAdd = async (uri) => {
    const success = await addToPlaylist(uri)
    if (success) {
      getSongs()
      goBack()
    }
    return success
  }
  return (
    <View style={{  flex: 1, width: '100%' }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10 }}
        onChangeText={text => setQuery(text)}
        value={query}
        onSubmitEditing={handleSearch}
      />
      <Button title='Search' onPress={handleSearch} />
      <FlatList
        data={results}
        renderItem={({item}) => <SearchItem item={item} onPress={handleAdd} onLongPress={playSong} />}
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