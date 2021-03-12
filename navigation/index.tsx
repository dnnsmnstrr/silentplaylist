import * as React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ColorSchemeName } from 'react-native';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import useAuth from '../hooks/useAuth';
import useSpotify from '../hooks/useSpotify';

import NotFoundScreen from '../screens/NotFoundScreen';
import Login from '../screens/Login';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';


// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator({navigation}) {
  const { token } = useAuth()
  const {setPlaylistId} = useSpotify()
  React.useEffect(() => console.log('token', token), [token])
  if (!token) {
    return <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>

  }

  const handleUrl = url => {
    if (!url) return
    let { path, queryParams } = Linking.parse(url);
    // alert(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`);
    console.log(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`);
    if (queryParams && queryParams.id) {
      setPlaylistId(queryParams.id)
      navigation.navigate('SelectedPlaylist')
    }
  };

  React.useEffect(() => {
    Linking.getInitialURL().then(handleUrl)
    Linking.addEventListener('url', (event) => {
      handleUrl(event.url)
    })
    Notifications.addNotificationResponseReceivedListener(response => {
      const {url} = response.notification.request.content.data
      handleUrl(url)
    })
  }, [])
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
