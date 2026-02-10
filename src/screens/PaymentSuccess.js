import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import RNPrint from 'react-native-print';

import { getReceiptHTML } from '../screens/receiptTemplate';

export default function PaymentSuccess({ navigation }) {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const redirectTimer = useRef(null);

  /* ================= LOAD PAYMENT (SAME LOGIC) ================= */
  useEffect(() => {
    const load = async () => {
      const saved = JSON.parse(await AsyncStorage.getItem('paymentDetails'));
      const temp = JSON.parse(await AsyncStorage.getItem('signupTempData'));

      if (!saved || !temp) {
        navigation.replace('Signin');
        return;
      }

      // ✅ FINAL SAVE
      if (temp.role === 'candidate') {
        await AsyncStorage.setItem('candidate', JSON.stringify(temp.data));
      }

      await AsyncStorage.removeItem('signupTempData');

      setPayment({
        ...saved,
        receiptNo: saved.receiptNo || `HRLK-${Date.now().toString().slice(-8)}`,
      });
    };

    load();

    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, [navigation]);

  /* ================= DOWNLOAD RECEIPT ================= */
  const downloadReceipt = async () => {
    try {
      setLoading(true);

      const html = getReceiptHTML(payment);
      await RNPrint.print({ html });

      Toast.show({
        type: 'success',
        text1: 'Receipt downloaded successfully',
      });

      // ✅ REDIRECT AFTER 3 SECONDS (ONLY AFTER DOWNLOAD)
      redirectTimer.current = setTimeout(async () => {
        await AsyncStorage.removeItem('paymentUser');
        await AsyncStorage.removeItem('paymentDetails');
        navigation.replace('Jobs');
      }, 3000);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Receipt download failed',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!payment) return null;

  /* ================= UI ================= */
  return (
    <View style={styles.page}>
      <View style={styles.card}>
        {/* SUCCESS ICON */}
        <View style={styles.iconCircle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.success}>Payment successful</Text>
        <Text style={styles.sub}>
          Your account has been activated successfully
        </Text>

        {/* DETAILS */}
        <View style={styles.detailBox}>
          <Text style={styles.label}>Receipt No</Text>
          <Text style={styles.value}>{payment.receiptNo}</Text>

          <Text style={styles.label}>Amount paid</Text>
          <Text style={styles.amount}>{payment.amount}</Text>
        </View>

        {/* DOWNLOAD */}
        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.6 }]}
          onPress={downloadReceipt}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Download receipt (PDF)</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          You will be redirected to Home after downloading the receipt
        </Text>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f4f7fb',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  check: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },

  success: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },

  sub: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 18,
  },

  detailBox: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },

  label: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '700',
  },

  value: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    color: '#111827',
  },

  amount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#16a34a',
  },

  btn: {
    backgroundColor: '#047e04',
    height: 48,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  btnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },

  note: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
});
