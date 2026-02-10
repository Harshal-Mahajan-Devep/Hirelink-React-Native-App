import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import Header from './Header';
import FooterMenu from './Footer';
import { BASE_URL } from '../config/constants';

export default function Notification({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ================= */
  const loadNotifications = async candidateId => {
    try {
      const res = await axios.get(
        `${BASE_URL}candidate/notifications/${candidateId}`,
      );
      if (res.data?.status) {
        setNotifications(res.data.data || []);
      }
    } catch (err) {
      console.log('Notification load error', err);
    }
  };

  const markAsRead = async (id, candidateId) => {
    try {
      await axios.get(`${BASE_URL}candidate/notification-read/${id}`);
      loadNotifications(candidateId);
    } catch {}
  };

  const handleClick = async item => {
    const stored = await AsyncStorage.getItem('candidate');
    const cand = stored ? JSON.parse(stored) : null;
    if (!cand) return;

    if (item.noti_is_read == 0) {
      await markAsRead(item.noti_id, cand.can_id);
      setNotifications(prev =>
        prev.map(n =>
          n.noti_id === item.noti_id ? { ...n, noti_is_read: 1 } : n,
        ),
      );
    }
  };

  /* ================= INITIAL ================= */
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('candidate');
      const cand = stored ? JSON.parse(stored) : null;
      if (!cand) {
        navigation.replace('Signin');
        return;
      }
      setLoading(true);
      await loadNotifications(cand.can_id);
      setLoading(false);
    })();
  }, []);

  /* ================= REAL-TIME FCM ================= */
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async msg => {
      const stored = await AsyncStorage.getItem('candidate');
      const cand = stored ? JSON.parse(stored) : null;
      if (cand && msg?.data?.candidate_id === String(cand.can_id)) {
        loadNotifications(cand.can_id);
      }
    });
    return unsubscribe;
  }, []);
  
  const NotificationSkeleton = () => (
    <View style={[styles.item, { opacity: 0.6 }]}>
      <View style={styles.skelIcon} />

      <View style={{ flex: 1 }}>
        <View style={styles.skelTitle} />
        <View style={styles.skelMsg} />
        <View style={styles.skelMsgShort} />
      </View>

      <View style={styles.skelTime} />
    </View>
  );

  /* ================= RENDER ================= */
  const renderItem = ({ item }) => {
    const unread = item.noti_is_read == 0;

    return (
      <TouchableOpacity
        style={[styles.item, unread && styles.unread]}
        onPress={() => handleClick(item)}
        activeOpacity={0.8}
      >
        <View style={styles.iconBox}>
          <Text style={styles.icon}>
            {item.noti_type === 'interview' ? '📅' : '🔔'}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item.noti_title}
          </Text>
          <Text style={styles.msg} numberOfLines={2}>
            {item.noti_message}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.time}>
            {new Date(item.noti_created_date).toLocaleDateString()}
          </Text>
          {unread && <View style={styles.dot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f6fb' }}>
      <Header navigation={navigation} />

      {/* HEADER */}
      <View style={styles.top}>
        <Text style={styles.topTitle}>Notifications</Text>
        <View style={styles.count}>
          <Text style={styles.countText}>{notifications.length}</Text>
        </View>
      </View>

      {/* LIST */}
      {loading ? (
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, i) => `skeleton-${i}`}
          renderItem={() => <NotificationSkeleton />}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#6b7280' }}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={i => String(i.noti_id)}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100, // footer space
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FIXED FOOTER */}
      <FooterMenu navigation={navigation} active="Messages" />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },

  topTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },

  count: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  countText: {
    fontWeight: '900',
    color: '#2557a7',
  },

  item: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },

  unread: {
    backgroundColor: '#eef3f8',
    borderColor: '#cfe3ff',
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: { fontSize: 20 },

  content: { flex: 1 },

  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },

  msg: {
    marginTop: 4,
    fontSize: 13,
    color: '#4b5563',
  },

  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  time: {
    fontSize: 11,
    color: '#6b7280',
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#2557a7',
  },
  skelIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },

  skelTitle: {
    height: 14,
    width: '70%',
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 6,
  },

  skelMsg: {
    height: 12,
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 4,
  },

  skelMsgShort: {
    height: 12,
    width: '60%',
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
  },

  skelTime: {
    width: 40,
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
  },
});
