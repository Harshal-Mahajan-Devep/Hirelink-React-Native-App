import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header({ navigation }) {
  const [isLogin, setIsLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('candidate');
      setIsLogin(!!user);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      checkLogin();
      setShowMenu(false); 
    });

    checkLogin();
    return unsubscribe;
  }, [navigation]);

  const logout = async () => {
    await AsyncStorage.removeItem('candidate');
    setIsLogin(false);
    setShowMenu(false);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.wrapper}>
      {/* HEADER BAR */}
      <View style={styles.header}>
        {/* LOGO */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image
            source={require('../assets/hirelink.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* RIGHT SIDE ICONS */}
        <View style={styles.rightArea}>
          {isLogin && (
            <>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('Notification')}
              >
                <Text style={styles.icon}>🔔</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.icon}>👤</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ☰ MENU BUTTON */}
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ DROPDOWN MENU */}
      {showMenu && (
        <>
          {/* Background click -> close */}
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />

          <View style={styles.dropdown}>
            {/* Common Links */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                navigation.navigate('Home');
              }}
            >
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                navigation.navigate('Company');
              }}
            >
              <Text style={styles.menuText}>Company Reviews</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                navigation.navigate('Jobs');
              }}
            >
              <Text style={styles.menuText}>Jobs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                navigation.navigate('Contact');
              }}
            >
              <Text style={styles.menuText}>Contact</Text>
            </TouchableOpacity>

            {/* Login / Logout section */}
            {isLogin ? (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    navigation.navigate('Profile');
                  }}
                >
                  <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem, styles.logoutItem]}
                  onPress={logout}
                >
                  <Text style={[styles.menuText, { color: '#fff' }]}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    navigation.navigate('Signin');
                  }}
                >
                  <Text style={styles.menuText}>Sign in</Text>
                </TouchableOpacity>

              </>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 999,
  },

  header: {
    height: 60,
    backgroundColor: '#0f172a',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    width: 40,
    height: 40,
  },

  rightArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  iconBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },

  icon: {
    fontSize: 14,
  },

  menuBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  menuIcon: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '900',
  },

  // ✅ Dropdown + overlay
  overlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },

  dropdown: {
    position: 'absolute',
    top: 60,
    right: 10,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 6,
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  menuText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  logoutItem: {
    backgroundColor: '#dc2626',
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 6,
  },
});
