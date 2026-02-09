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
        Toast.show({
          type: 'error',
          text1: 'Payment session expired',
        });
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
        Toast.show({
          type: 'error',
          text1: data.message || 'Order creation failed',
        });
        setLoading(false);
        return;
      }

      setOrderData(data);
      setDisplayAmount(`₹${data.amount / 100}`);
      setLoading(false);
    } catch (error) {
      setErrorMsg('Failed to create order');
      Toast.show({
        type: 'error',
        text1: 'Failed to create order',
      });
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

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Hirelink',
        description: 'Candidate Account Create',
        order_id: orderData.id,
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#0f172a',
        },
      };

      RazorpayCheckout.open(options)
        .then(async response => {
          // ✅ VERIFY PAYMENT
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
                email: user.email,
                role: 'candidate',
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
          Toast.show({
            type: 'error',
            text1: 'Payment cancelled',
          });
        });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Payment failed',
      });
    }
  };

  const isPayDisabled = loading || !orderData || !!errorMsg;

  /* ================= UI ================= */
  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={styles.title}>Complete Your Payment</Text>
        <Text style={styles.sub}>Candidate Account</Text>

        <Text style={styles.amount}>
          {loading ? 'Loading...' : displayAmount}
        </Text>

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <TouchableOpacity
          style={[styles.payBtn, isPayDisabled && { opacity: 0.6 }]}
          onPress={openRazorpay}
          disabled={isPayDisabled}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payText}>Pay Now</Text>
          )}
        </TouchableOpacity>

        {errorMsg ? (
          <TouchableOpacity style={styles.retryBtn} onPress={createOrder}>
            <Text style={styles.retryText}>Retry Order</Text>
          </TouchableOpacity>
        ) : null}
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
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111827',
  },
  sub: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 12,
  },
  amount: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 10,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    marginBottom: 10,
  },
  payBtn: {
    backgroundColor: '#0f172a',
    height: 48,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  retryBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
  retryText: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
