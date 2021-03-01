import React, {useEffect} from 'react';
import { StyleSheet, Button, TextInput } from 'react-native';
import useAuth from '../hooks/useAuth'
import Clipboard from 'expo-clipboard';

import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {
  const {notificationToken, partnerToken, setPartnerToken} = useAuth()

  const copyToClipboard = () => {
    Clipboard.setString(notificationToken);
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setPartnerToken(text);
  };

  useEffect(() => {
    if (!partnerToken) {
      fetchCopiedText()
    }
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>{notificationToken}</Text>
      <Button title="Copy Notification Token" onPress={copyToClipboard} />
      <TextInput
        style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1, paddingHorizontal: 10 }}
        onChangeText={setPartnerToken}
        value={partnerToken}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
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
