import axios from 'axios';
import { BASE_URL } from '../config/constants';
import messaging from '@react-native-firebase/messaging';

export const saveFcmToken = async candidateId => {
  try {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Notification permission not granted');
      return;
    }

    const token = await messaging().getToken();
    console.log('🔥 FCM TOKEN:', token);

    if (token) {
      await axios.post(`${BASE_URL}candidate/save-fcm-token`, {
        fcm_can_id: candidateId,
        fcm_token: token,
      });

      console.log('✅ FCM token saved');
    }
  } catch (err) {
    console.log('FCM error', err);
  }
};
