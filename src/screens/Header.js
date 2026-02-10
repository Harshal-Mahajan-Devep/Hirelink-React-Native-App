import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { COLORS } from '../config/colors';

export default function Header({ navigation, onMenuPress }) {
  const [isLogin, setIsLogin] = useState(false);
  const route = useRoute();

  const isProfileScreen = route.name === 'Profile';

  useEffect(() => {
    AsyncStorage.getItem('candidate').then(u => setIsLogin(!!u));
  }, []);

  return (
    <View style={styles.header}>
      <Text style={styles.logo}>Hirelink</Text>

      {/* ✅ MENU ICON ONLY ON PROFILE PAGE */}
      {isLogin && isProfileScreen ? (
        <TouchableOpacity onPress={onMenuPress}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      ) : !isLogin ? (
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Text style={styles.link}>Sign in</Text>
        </TouchableOpacity>
      ) : (
        <View /> // empty placeholder
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  link: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  menuIcon: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
  },
});
