import React, { useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri, ResponseType, useAuthRequest } from 'expo-auth-session'
import { ActivityIndicator, Button, View, Platform } from 'react-native'
import useAuth from '../hooks/useAuth'

WebBrowser.maybeCompleteAuthSession()

export default function Login ({ navigation }) {
  const {request, promptAsync} = useAuth()
  const [loading, setLoading] = useState()
  const handlePress = () => {
    promptAsync()
    setLoading(true)
  }
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      {loading ? <ActivityIndicator /> : <Button disabled={false} title='Login' onPress={handlePress} />}
    </View>
  )
}
