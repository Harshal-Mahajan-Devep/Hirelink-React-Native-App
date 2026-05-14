import React, { useEffect, useState } from 'react';
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

  /* ================= LOAD PAYMENT ================= */
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

      // ✅ AUTO REDIRECT AFTER 3 SECONDS
      setTimeout(async () => {
        await AsyncStorage.removeItem('paymentUser');
        await AsyncStorage.removeItem('paymentDetails');
        navigation.replace('Home');
      }, 3000);
    };

    load();
  }, [navigation]);

  /* ================= DOWNLOAD RECEIPT ================= */
  const downloadReceipt = async () => {
    try {
      setLoading(true);

      const html = getReceiptHTML(payment);

      await RNPrint.print({ html });

      Toast.show({
        type: 'success',
        text1: 'Receipt opened successfully',
      });
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
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={styles.success}>Payment Successful 🎉</Text>

        <Text style={styles.info}>
          Receipt No: <Text style={styles.bold}>{payment.receiptNo}</Text>
        </Text>

        <Text style={styles.info}>
          Amount Paid: <Text style={styles.bold}>{payment.amount}</Text>
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={downloadReceipt}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>📄 Download Receipt PDF</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.redirect}>Redirecting to Home in 3 seconds...</Text>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f4f7fb',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    elevation: 6,
    alignItems: 'center',
  },
  success: {
    fontSize: 22,
    fontWeight: '800',
    color: '#16a34a',
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    marginBottom: 6,
  },
  bold: {
    fontWeight: '800',
  },
  btn: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 999,
    marginTop: 16,
  },
  btnText: {
    color: '#fff',
    fontWeight: '800',
  },
  redirect: {
    marginTop: 12,
    fontSize: 12,
    color: '#6b7280',
  },
});
