import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { Button } from 'react-native'
import TextButton from '../components/TextButton'
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import Playlists from '../screens/Playlists';
import Config from '../screens/Config';
import SelectedPlaylist from '../screens/SelectedPlaylist';
import Add from '../screens/Add';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import useAuth from '../hooks/useAuth';
import useSpotify from '../hooks/useSpotify';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator({navigation}) {
  const colorScheme = useColorScheme();
  const {setPlaylistId} = useSpotify()

  const handleUrl = url => {
    if (!url) return
    let { path, queryParams } = Linking.parse(url);
    // alert(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`);
    console.log(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`);
    if (queryParams && queryParams.id) {
      setPlaylistId(queryParams.id)
      // navigation.navigate('SelectedPlaylist')
    }
  };

  React.useEffect(() => {
    Linking.getInitialURL().then(handleUrl)
    Linking.addEventListener('url', (event) => {
      handleUrl(event.url)
    })
  }, [])
  return (
    <BottomTab.Navigator
      initialRouteName="Playlists"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Playlists"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "musical-notes" : 'musical-notes-outline'} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "cog" : 'cog-outline'} color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

const logoutButton = () => {
  const {logout} = useAuth()
  return <Button
  title='Logout'
  color='red'
  onPress={() => {
    logout()
  }}
  />}

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="Playlists"
        component={Playlists}
        options={({navigation, route}) => ({
          headerTitle: 'Select playlist',
          headerRight: logoutButton,
        })}
      />
      <TabOneStack.Screen
        name="SelectedPlaylist"
        component={SelectedPlaylist}
        options={({navigation, route}) => ({
          headerTitle: 'Songs',
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate("Add")}
              title="Add"
            />
          ),
        })}
      />
      <TabOneStack.Screen
        name="Add"
        component={Add}
        options={({navigation}) => ({
          headerTitle: 'Add song',
        })}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {

  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="Config"
        component={Config}
        options={({ navigation }) => ({
          headerTitle: 'Config',
          headerRight: logoutButton
        })}
      />
    </TabTwoStack.Navigator>
  );
}
