import * as React from 'react';
import { StyleSheet } from 'react-native';

import Songs from '../components/Songs';
import { View } from '../components/Themed';

const Separator = () => <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

export default function SelectedPlaylist({route}) {
  return (
    <View style={styles.container}>
      <Songs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
