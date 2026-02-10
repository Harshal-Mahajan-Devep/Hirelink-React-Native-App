import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config/constants';

const RESEND_TIME = 30;

export default function Verify({ navigation }) {
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);

  const [emailTimer, setEmailTimer] = useState(0);
  const [mobileTimer, setMobileTimer] = useState(0);

  const [loading, setLoading] = useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    (async () => {
      const verifyUser = JSON.parse(await AsyncStorage.getItem('verifyUser'));
      if (!verifyUser?.email || !verifyUser?.mobile) {
        Toast.show({ type: 'error', text1: 'Session expired' });
        navigation.replace('Signin');
        return;
      }

      setEmail(verifyUser.email);
      setMobile(verifyUser.mobile);
    })();
  }, []);

  /* ================= TIMERS ================= */
  useEffect(() => {
    if (emailTimer > 0) {
      const t = setInterval(() => setEmailTimer(p => p - 1), 1000);
      return () => clearInterval(t);
    }
  }, [emailTimer]);

  useEffect(() => {
    if (mobileTimer > 0) {
      const t = setInterval(() => setMobileTimer(p => p - 1), 1000);
      return () => clearInterval(t);
    }
  }, [mobileTimer]);

  const maskEmail = e => e.replace(/(.{2}).+(@.+)/, '$1****$2');
  const maskMobile = m => m.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2');

  /* ================= VERIFY ================= */
  const verifyMobileOtp = async () => {
    if (mobileOtp.length !== 6) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}candidate/verifyMobileOtp`, {
        can_mobile: mobile,
        otp: mobileOtp,
      });
      if (res.data?.status) {
        setMobileVerified(true);
        Toast.show({ type: 'success', text1: 'Mobile verified' });
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (emailOtp.length !== 6) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}candidate/verifyEmailOtp`, {
        can_email: email,
        otp: emailOtp,
      });
      if (res.data?.status) {
        setEmailVerified(true);
        Toast.show({ type: 'success', text1: 'Email verified' });
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAYMENT ================= */
  const proceedToPayment = async () => {
    await AsyncStorage.setItem(
      'paymentUser',
      JSON.stringify({
        email,
        role: 'candidate',
        for: 'Account Create',
      }),
    );
    await AsyncStorage.removeItem('verifyUser');
    navigation.replace('Payment');
  };

  /* ================= UI ================= */
  return (
    <View style={styles.page}>
      <View style={styles.card}>
        {/* HEADER */}
        <Text style={styles.title}>Verify your account</Text>
        <Text style={styles.sub}>
          Complete verification to activate your account
        </Text>

        {/* MOBILE CARD */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Mobile verification</Text>
          <Text style={styles.info}>OTP sent to {maskMobile(mobile)}</Text>

          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
              editable={!mobileVerified}
              value={mobileOtp}
              onChangeText={v => setMobileOtp(v.replace(/\D/g, ''))}
            />

            <TouchableOpacity
              style={[styles.verifyBtn, mobileVerified && styles.doneBtn]}
              onPress={verifyMobileOtp}
              disabled={mobileVerified || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.verifyText}>
                  {mobileVerified ? '✓ Done' : 'Verify'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* EMAIL CARD */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Email verification</Text>
          <Text style={styles.info}>OTP sent to {maskEmail(email)}</Text>

          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
              editable={!emailVerified}
              value={emailOtp}
              onChangeText={v => setEmailOtp(v.replace(/\D/g, ''))}
            />

            <TouchableOpacity
              style={[styles.verifyBtn, emailVerified && styles.doneBtn]}
              onPress={verifyEmailOtp}
              disabled={emailVerified || loading}
            >
              <Text style={styles.verifyText}>
                {emailVerified ? '✓ Done' : 'Verify'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FINAL CTA */}
        {emailVerified && mobileVerified && (
          <TouchableOpacity style={styles.payBtn} onPress={proceedToPayment}>
            <Text style={styles.payText}>Continue to payment</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.footer}>Secure • Fast • Verified</Text>
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

  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    color: '#111827',
  },

  sub: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 20,
  },

  block: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#fafafa',
  },

  blockTitle: {
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },

  info: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    gap: 8,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    backgroundColor: '#fff',
  },

  verifyBtn: {
    backgroundColor: '#0daa07',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },

  doneBtn: {
    backgroundColor: '#16a34a',
  },

  verifyText: {
    color: '#fff',
    fontWeight: '800',
  },

  payBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 10,
  },

  payText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
  },

  footer: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
});
