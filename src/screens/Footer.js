import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FooterMenu({ navigation, active }) {
  const tabs = [
    { name: 'Home', route: 'Jobs', icon: '🏠' },
    { name: 'My jobs', route: 'MyJobs', icon: '💾' },
    { name: 'Notifications', route: 'Notification', icon: '🔔' },
    { name: 'Profile', route: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.footer}>
      {tabs.map(t => {
        const isActive = active === t.name;

        return (
          <TouchableOpacity
            key={t.name}
            style={styles.tab}
            onPress={() => navigation.navigate(t.route)}
          >
            <Text style={[styles.icon, isActive && styles.active]}>
              {t.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.active]}>
              {t.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute', // ✅ FIXED
    bottom: 0, // ✅ ALWAYS BOTTOM
    left: 0,
    right: 0,
    height: 64,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 8, // Android shadow
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    color: '#6b7280',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
  },
  active: {
    color: '#2557a7',
  },
});
