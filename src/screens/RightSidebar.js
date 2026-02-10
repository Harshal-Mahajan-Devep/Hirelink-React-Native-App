import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RightSidebar({ visible, onClose, navigation }) {
  const slideX = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideX, {
      toValue: visible ? 0 : 300,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Signin');
  };

  const MenuItem = ({ label, screen }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onClose();
        if (screen) navigation.navigate(screen);
      }}
    >
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={{ flex: 1 }} onPress={onClose} />

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideX }] }]}
      >
        <Text style={styles.title}>Menu</Text>

        <MenuItem label="🏠 Home" screen="Home" />
        <MenuItem label="💼 My Jobs" screen="MyJobs" />
        <MenuItem label="🔔 Notifications" screen="Notification" />
        <MenuItem label="🏢 Companies" screen="Company" />
        <MenuItem label="ℹ️ About" screen="About" />
        <MenuItem label="📞 Contact" screen="Contact" />
        <MenuItem label="❓ Help" screen="Help" />
        <MenuItem label="📜 Terms & Conditions" screen="Terms" />
        <MenuItem label="♻️ Return Policy" screen="ReturnPolicy" />
        <MenuItem label="🔐 Privacy Policy" screen="PrivacyPolicies" />

        {/* <View style={styles.divider} /> */}

        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 999,
  },

  drawer: {
    width: 280,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 18,
  },

  title: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 20,
  },

  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },

  itemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 14,
  },

  logout: {
    paddingVertical: 12,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#dc2626',
  },
});
