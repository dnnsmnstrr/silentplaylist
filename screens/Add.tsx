import * as React from 'react';
import { StyleSheet } from 'react-native';

import Search from '../components/Search';
import { View, Button } from '../components/Themed';

const Separator = () => <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

export default function Add ({ navigation }) {
  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: 'Add song',
  //     headerRight: () => (
  //       <Button
  //         onPress={() => {}}
  //         title='hello'
  //       />
  //     ),
  //   })
  // }, [navigation])

  return (
    <View style={styles.container}>
      <Search goBack={navigation.goBack}/>
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
