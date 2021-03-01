import React, {useEffect} from 'react';
import { StyleSheet, Button } from 'react-native';
import useAuth from '../hooks/useAuth'
import Clipboard from 'expo-clipboard';

import { Text, View, TextInput} from '../components/Themed';

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

  const handlePartnerToken = (text) => {
    if (text && !text.includes('ExponentPushToken')) {
      text = `ExponentPushToken[${text}]`
    }
    console.log('text', text)
    setPartnerToken(text)
  }

  const formatToken = (token = '') => {
    const [tokenString = ''] = token.match(/(\[.*\])/) || []
    return tokenString.replace('[', '').replace(']', '')
  }
  const tokenRegex = new RegExp(/(ExponentPushToken)(\[.*\])/);
  const validateToken = (token = '') => {
    return tokenRegex.test(token) && token.length === 41
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>{formatToken(notificationToken)}</Text>
      <Button title="Copy Notification Token" onPress={copyToClipboard} />
      <TextInput
        style={{
          height: 40,
          width: '80%',
          borderColor: validateToken(partnerToken) ? 'green' : 'gray',
          borderWidth: 1,
          paddingHorizontal: 10,
          textAlign: 'center',
        }}
        onChangeText={handlePartnerToken}
        value={formatToken(partnerToken)}
        clearButtonMode='while-editing'
        textContentType='oneTimeCode'
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
