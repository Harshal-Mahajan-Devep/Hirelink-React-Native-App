import React, { useEffect, useRef } from 'react';
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
    // ✅ Smooth animation sequence
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
      Animated.delay(900),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 6500);

    return () => clearTimeout(timer);
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
