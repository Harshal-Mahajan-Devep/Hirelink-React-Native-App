/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging'; 
import App from './App';
import { name as appName } from './app.json';

// 🔥 BACKGROUND / KILLED HANDLER
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background Message:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
