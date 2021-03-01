import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Button } from 'react-native'
import TextButton from '../components/TextButton'
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import SelectedPlaylist from '../screens/SelectedPlaylist';
import Add from '../screens/Add';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import useAuth from '../hooks/useAuth';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Playlists"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "musical-notes" : 'musical-notes-outline'} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Config"
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
        name="TabOneScreen"
        component={TabOneScreen}
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
        component={TabTwoScreen}
        options={({ navigation }) => ({
          headerTitle: 'Config',
          headerRight: logoutButton
        })}
      />
    </TabTwoStack.Navigator>
  );
}
