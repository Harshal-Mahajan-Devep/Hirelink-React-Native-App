import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/Home';
import SinginScreen from '../screens/Singin';
import JobsScreen from '../screens/Jobs';
import JobDetailsScreen from '../screens/JobDetail';
import ProfileScreen from '../screens/Profile';
import JobSAIScreen from '../screens/JobsSAI';
import EditProfileScreen from '../screens/EditProfile';
import AboutScreen from '../screens/About';
import SignupScreen from '../screens/Signup';
import CompanyScreen from '../screens/Company';
import ContactScreen from '../screens/Contact';
import PrivacyPoliciesScreen from '../screens/PrivacyPolicies';
import ReturnPolicyScreen from '../screens/ReturnPolicy';
import HelpScreen from '../screens/Help';
import NotificationScreen from '../screens/Notification';
import PaymentScreen from '../screens/Payment';
import Verify from '../screens/Verify';
import PaymentSuccess from '../screens/PaymentSuccess';
import Forgotscreen from '../screens/Forgot';
import ApplyScreen from '../screens/Apply';
import TeamsScreen from '../screens/Terms';
import ChangePasswordscreen from '../screens/ChangePassword';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Signin" component={SinginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Jobs" component={JobsScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="MyJobs" component={JobSAIScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Company" component={CompanyScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Apply" component={ApplyScreen} />
        <Stack.Screen name="Terms" component={TeamsScreen} />
        <Stack.Screen
          name="PrivacyPolicies"
          component={PrivacyPoliciesScreen}
        />
        <Stack.Screen name="ReturnPolicy" component={ReturnPolicyScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Verify" component={Verify} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
        <Stack.Screen name="Forgot" component={Forgotscreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordscreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
