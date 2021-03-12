import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

export default {
  prefixes: [Linking.makeUrl('/'), 'https://muensterer.xyz'],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              Playlists: 'playlists',
              SelectedPlaylist: 'playlist/:id?',
              Add: 'playlist/add/:id?'
            },
          },
          TabTwo: {
            screens: {
              Config: 'config',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);
    return () => {
      // Clean up the event listeners
      Linking.removeEventListener('url', onReceiveURL);
    };
  },
};
