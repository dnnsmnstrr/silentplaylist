import React, { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native'
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
      redirectUri: makeRedirectUri({
        useProxy: false,
        native: 'exp://192.168.0.34:19000',
      }),
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

  return (
    <AuthContext.Provider value={{ token, request, promptAsync, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default () => useContext(AuthContext)
