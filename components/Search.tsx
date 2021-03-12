import React, { useState } from 'react';
import { StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';

import { Text, View, TextInput } from './Themed';
import useSpotify from '../hooks/useSpotify';
import useAuth from '../hooks/useAuth';

const SearchItem = ({ item, onPress, onLongPress, style }) => (
  <TouchableOpacity onPress={() => onPress(item)} onLongPress={() => onLongPress(null, item.uri)} style={[styles.item, style]}>
    <Text style={styles.title}>{item.name}</Text>
    <Text style={styles.artist}>{item.artists.map(({name}) => name).join(', ')}</Text>
  </TouchableOpacity>
);

export default function Search({goBack}) {
  const {searchSongs, getSongs, addToPlaylist, playSong, playlistId} = useSpotify()
  const {partnerToken} = useAuth()
  const [query, setQuery] = useState()
  const [results, setResults] = useState()

  const handleSearch = async () => {
    const res = await searchSongs(query)
    setResults(res)
  }

  const handleAdd = async (item) => {
    const success = await addToPlaylist(item.uri)
    if (success) {
      getSongs()
      goBack()
    }
    if (partnerToken) {
      const body = JSON.stringify({
        to: partnerToken,
        title: "Your turn to choose a song",
        body: 'Last title: ' + item.name,
        data: {url: `'exp://192.168.0.34:19000/--/playlist/add/?id=${playlistId}'`}
      })
      console.log('body', body)
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body
      })
      .then(response => response.json())
      .then(responseJson => {
        console.log('responseJson', responseJson)
      })
      .catch(error => {
        console.error(error);
      });
    }

  }
  return (
    <View style={{  flex: 1, width: '100%' }}>
      <TextInput
        autoFocus
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
