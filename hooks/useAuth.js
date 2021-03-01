import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications'
import { makeRedirectUri, ResponseType, useAuthRequest } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import Auth from '../constants/Auth';

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const scopes = [
  'user-read-email',
  'playlist-modify-public',
  'playlist-modify-private',
  'playlist-read-collaborative',
  'user-modify-playback-state'
]
export const AuthContext = React.createContext({})

export const AuthProvider = ({ children }) => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: Auth.clientId,
      responseType: ResponseType.Token,
      scopes,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({ useProxy: false }),
    },
    discovery
  );

  useEffect(() => {
    console.log('response', response)
    if (response?.type === 'success') {
      const { access_token, ...restParams } = response.params;
      setToken(access_token)
      const auth = response.params;
      const storageValue = JSON.stringify(auth);

      if (Platform.OS !== 'web') {
        SecureStore.setItemAsync(Auth.authTokenKey, storageValue);
        // navigation.navigate('Root')
      }
    }
  }, [response]);

  async function getValueFor(key) {
    const result = await SecureStore.getItemAsync(key);
    if (result) {
      return JSON.parse(result);
    } else {
      console.log('No values stored under the key: ', key);
    }
  }

  const logout = () => {
    SecureStore.setItemAsync(Auth.authTokenKey, '');
    setToken(null)
  }

  const [token, setToken] = useState()

  const getToken = async () => {
    const tokenData = await getValueFor(Auth.authTokenKey)
    console.log('tokenData', tokenData)
    if (tokenData) {
      setToken(tokenData.access_token)
    }
  }
  useEffect(() => {
    getToken()
  }, [])

  const [notificationToken, setNotificationToken] = useState()
  const [partnerToken, setPartnerToken] = useState()
  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      console.log('finalStatus', finalStatus)
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setNotificationToken(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
  }, [])

  return (
    <AuthContext.Provider value={{ token, notificationToken, partnerToken, setPartnerToken, request, promptAsync, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default () => useContext(AuthContext)
