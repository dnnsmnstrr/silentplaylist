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

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data.url;
      console.log('notificationurl', url)
      alert(url)
      // Any custom logic to see whether the URL needs to be handled
      //...

      // Let React Navigation handle the URL
      listener(url);
    });

    return () => {
      // Clean up the event listeners
      Linking.removeEventListener('url', onReceiveURL);
      subscription.remove();
    };
  },
};
