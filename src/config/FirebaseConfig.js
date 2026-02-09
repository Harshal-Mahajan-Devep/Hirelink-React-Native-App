import messaging from "@react-native-firebase/messaging";

export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

export const getFcmTokenRN = async () => {
  const token = await messaging().getToken(); // ✅ RN token
  return token;
};

// ✅ Foreground listener (Real-time)
export const listenForegroundNotification = (callback) => {
  return messaging().onMessage(async (remoteMessage) => {
    callback(remoteMessage);
  });
};
