import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import axios from 'axios';
import RNPrint from 'react-native-print';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReceiptHTML } from '../screens/receiptTemplate';
import { BASE_URL } from '../config/constants';

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

  const downloadReceipt = async () => {
    try {
      // 1️⃣ Candidate data
      const candidate = JSON.parse(await AsyncStorage.getItem('candidate'));

      if (!candidate?.can_email) {
        Toast.show({
          type: 'error',
          text1: 'Please login again',
        });
        return;
      }

      // 2️⃣ Fetch payment using email
      const res = await axios.post(`${BASE_URL}admin/getdatawhere`, {
        table: 'tbl_payments',
        column: 'pay_email',
        value: candidate.can_email,
        orderby: 'created_at DESC',
        limit: 1,
      });

      const pay = res.data?.data?.[0];
      if (!pay) {
        Toast.show({
          type: 'error',
          text1: 'No payment record found',
        });
        return;
      }

      // 3️⃣ Prepare payment object
      const payment = {
        name: candidate.can_name,
        mobile: candidate.can_mobile,
        email: candidate.can_email,
        paymentId: pay.razorpay_payment_id,
        orderId: pay.razorpay_order_id,
        amount: pay.pay_amount,
        date: pay.created_at,
        role: pay.pay_role,
        paymentFor: pay.pay_for,
      };

      // 4️⃣ Generate HTML receipt
      const html = getReceiptHTML(payment);

      // 5️⃣ Print / Download PDF
      await RNPrint.print({ html });

      Toast.show({
        type: 'success',
        text1: 'Receipt downloaded successfully',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Receipt download failed',
      });
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={{ flex: 1 }} onPress={onClose} />

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideX }] }]}
      >
        <Text style={styles.title}>Menu</Text>

        <MenuItem label="🏠 Home" screen="Jobs" />
        <MenuItem label="💼 My Jobs" screen="MyJobs" />
        <MenuItem label="🔔 Notifications" screen="Notification" />
        <MenuItem label="🏢 Companies" screen="Company" />
        <MenuItem label="ℹ️ About" screen="About" />
        <MenuItem label="📞 Contact" screen="Contact" />
        <MenuItem label="❓ Help" screen="Help" />
        <MenuItem label="📜 Terms & Conditions" screen="Terms" />
        <MenuItem label="♻️ Return Policy" screen="ReturnPolicy" />
        <MenuItem label="🔐 Privacy Policy" screen="PrivacyPolicies" />
        <TouchableOpacity style={styles.item} onPress={downloadReceipt}>
          <Text style={styles.itemText}>🧾 Download Receipt</Text>
        </TouchableOpacity>

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
