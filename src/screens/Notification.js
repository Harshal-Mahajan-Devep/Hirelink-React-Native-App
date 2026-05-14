import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import { BASE_URL } from "../config/constants";

export default function Notification({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async (candidateId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}candidate/notifications/${candidateId}`
      );

      if (res.data?.status) {
        setNotifications(res.data.data || []);
      }
    } catch (err) {
      console.log("Notification load error", err);
    }
  };

  const markAsRead = async (notiId, candidateId) => {
    try {
      await axios.get(`${BASE_URL}candidate/notification-read/${notiId}`);
      loadNotifications(candidateId);
    } catch (err) {
      console.log("Mark read error", err);
    }
  };

  const handleClick = async (item) => {
    const candidateStr = await AsyncStorage.getItem("candidate");
    const candidate = candidateStr ? JSON.parse(candidateStr) : null;
    if (!candidate) return;

    if (item.noti_is_read == 0) {
      await markAsRead(item.noti_id, candidate.can_id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.noti_id === item.noti_id ? { ...n, noti_is_read: 1 } : n
        )
      );
    }
  };

  // ✅ Initial Load
  useEffect(() => {
    (async () => {
      const candidateStr = await AsyncStorage.getItem("candidate");
      const candidate = candidateStr ? JSON.parse(candidateStr) : null;

      if (!candidate) {
        navigation.replace("Signin");
        return;
      }

      setLoading(true);
      await loadNotifications(candidate.can_id);
      setLoading(false);
    })();
  }, [navigation]);

  // ✅ Real-time refresh when FCM received (Foreground)
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("🔥 Foreground FCM:", remoteMessage);

      const candidateStr = await AsyncStorage.getItem("candidate");
      const candidate = candidateStr ? JSON.parse(candidateStr) : null;

      const candidateIdFromMsg = remoteMessage?.data?.candidate_id;

      if (candidate && candidateIdFromMsg === String(candidate.can_id)) {
        loadNotifications(candidate.can_id);
      }
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }) => {
    const unread = item.noti_is_read == 0;

    return (
      <TouchableOpacity
        style={[styles.item, unread ? styles.unread : null]}
        onPress={() => handleClick(item)}
        activeOpacity={0.8}
      >
        {/* LEFT ICON */}
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>
            {item.noti_type === "interview" ? "📅" : "🔔"}
          </Text>
        </View>

        {/* CENTER CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item.noti_title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.noti_message}
          </Text>
        </View>

        {/* RIGHT */}
        <View style={styles.right}>
          <Text style={styles.time}>
            {new Date(item.noti_created_date).toLocaleString()}
          </Text>

          {unread ? <View style={styles.dot} /> : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.countBox}>
          <Text style={styles.countText}>{notifications.length}</Text>
        </View>
      </View>

      {/* LIST */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Loading...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: "#6b7280" }}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.noti_id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  countBox: {
    backgroundColor: "#e8f0fe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  countText: {
    color: "#0a66c2",
    fontWeight: "800",
  },

  item: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
  },

  unread: {
    backgroundColor: "#eef3f8",
    borderColor: "#cfe3ff",
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },

  iconText: { fontSize: 20 },

  content: { flex: 1 },

  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1f2937",
  },

  message: {
    marginTop: 4,
    fontSize: 13,
    color: "#555",
  },

  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
    maxWidth: 130,
  },

  time: {
    fontSize: 11,
    color: "#888",
    textAlign: "right",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#0a66c2",
  },
});
