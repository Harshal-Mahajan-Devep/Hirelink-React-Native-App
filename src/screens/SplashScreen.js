import React, { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Image,
} from 'react-native';

export default function SplashIntro({ navigation }) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.05,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scale, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.delay(700),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        if (isLoggedIn === 'true') {
          navigation.replace('Jobs'); // ✅ already logged in
        } else {
          navigation.replace('Signin'); // not logged in
        }
      }, 2500);
    };

    checkLogin();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* ✅ GIF Animation */}
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Image
          source={require('../assets/hirelink.png')}
          style={styles.gif}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ✅ Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: textOpacity }]}>
        Connecting Talent with Opportunity
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gif: {
    width: 260,
    height: 260,
  },
  tagline: {
    marginTop: 18,
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
