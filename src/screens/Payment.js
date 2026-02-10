import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RazorpayCheckout from 'react-native-razorpay';

import { BASE_URL } from '../config/constants';

export default function Payment({ navigation }) {
  const calledOnce = useRef(false);

  const [loading, setLoading] = useState(false);
  const [displayAmount, setDisplayAmount] = useState('₹0');
  const [orderData, setOrderData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  /* ================= CREATE ORDER ================= */
  const createOrder = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('paymentUser'));

      if (!user?.email || user.role !== 'candidate') {
        Toast.show({ type: 'error', text1: 'Session expired' });
        navigation.replace('Signin');
        return;
      }

      setLoading(true);
      setErrorMsg('');

      const { data } = await axios.post(`${BASE_URL}payment/create-order`, {
        email: user.email,
        role: 'candidate',
        for: user.for || 'Account Create',
      });

      if (!data?.status) {
        setErrorMsg(data.message || 'Order creation failed');
        setLoading(false);
        return;
      }

      setOrderData(data);
      setDisplayAmount(`₹${data.amount / 100}`);
      setLoading(false);
    } catch {
      setErrorMsg('Failed to create order');
      setLoading(false);
    }
  };

  /* ================= CALL ONCE ================= */
  useEffect(() => {
    if (calledOnce.current) return;
    calledOnce.current = true;
    createOrder();
  }, []);

  /* ================= OPEN RAZORPAY ================= */
  const openRazorpay = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('paymentUser'));
      if (!orderData || !user) return;

      RazorpayCheckout.open({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Hirelink',
        description: 'Candidate Account',
        order_id: orderData.id,
        prefill: { email: user.email },
        theme: { color: '#2557a7' },
      })
        .then(async response => {
          const verify = await axios.post(`${BASE_URL}payment/verify`, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            email: user.email,
            role: 'candidate',
            for: user.for || 'Account Create',
          });

          if (verify.data?.status) {
            Toast.show({
              type: 'success',
              text1: 'Payment successful 🎉',
            });

            await AsyncStorage.setItem(
              'paymentDetails',
              JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: displayAmount,
                date: new Date().toLocaleString(),
              }),
            );

            navigation.replace('PaymentSuccess');
          } else {
            Toast.show({
              type: 'error',
              text1: 'Payment verification failed',
            });
          }
        })
        .catch(() => {
          Toast.show({ type: 'error', text1: 'Payment cancelled' });
        });
    } catch {
      Toast.show({ type: 'error', text1: 'Payment failed' });
    }
  };

  const disabled = loading || !orderData || !!errorMsg;

  /* ================= UI ================= */
  return (
    <View style={styles.page}>
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.brand}>Hirelink</Text>
          <Text style={styles.secure}>🔒 100% Secure Payment</Text>
        </View>

        {/* INFO */}
        <Text style={styles.title}>Complete your payment</Text>
        <Text style={styles.sub}>Candidate account activation</Text>

        {/* AMOUNT */}
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Total amount</Text>
          <Text style={styles.amount}>
            {loading ? 'Loading…' : displayAmount}
          </Text>
        </View>

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        {/* PAY */}
        <TouchableOpacity
          style={[styles.payBtn, disabled && { opacity: 0.6 }]}
          disabled={disabled}
          onPress={openRazorpay}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payText}>Pay securely</Text>
          )}
        </TouchableOpacity>

        {/* RETRY */}
        {errorMsg ? (
          <TouchableOpacity onPress={createOrder}>
            <Text style={styles.retry}>Retry order</Text>
          </TouchableOpacity>
        ) : null}

        {/* FOOT NOTE */}
        <Text style={styles.note}>
          Powered by Razorpay • UPI • Cards • Netbanking
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
    backgroundColor: '#f3f6fb',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  header: {
    alignItems: 'center',
    marginBottom: 12,
  },

  brand: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0c8f28',
  },

  secure: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '700',
    marginTop: 4,
  },

  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 10,
    color: '#111827',
  },

  sub: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 16,
  },

  amountBox: {
    backgroundColor: '#f2f5d1',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },

  amountLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '700',
  },

  amount: {
    fontSize: 30,
    fontWeight: '900',
    color: '#099131',
    marginTop: 4,
  },

  error: {
    textAlign: 'center',
    color: '#dc2626',
    fontWeight: '700',
    marginBottom: 10,
  },

  payBtn: {
    backgroundColor: '#107e06',
    height: 52,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  payText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },

  retry: {
    textAlign: 'center',
    marginTop: 12,
    color: '#2563eb',
    fontWeight: '800',
  },

  note: {
    textAlign: 'center',
    marginTop: 14,
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
});
