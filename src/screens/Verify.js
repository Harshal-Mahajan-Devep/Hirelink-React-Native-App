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

  const [mobileLoading, setMobileLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

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

      const mTime = await AsyncStorage.getItem('mobileOtpTime');
      const eTime = await AsyncStorage.getItem('emailOtpTime');

      if (mTime) {
        const diff = Math.floor((Date.now() - Number(mTime)) / 1000);
        if (diff < RESEND_TIME) setMobileTimer(RESEND_TIME - diff);
      }

      if (eTime) {
        const diff = Math.floor((Date.now() - Number(eTime)) / 1000);
        if (diff < RESEND_TIME) setEmailTimer(RESEND_TIME - diff);
      }
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
    if (mobileOtp.length !== 6) {
      Toast.show({ type: 'error', text1: 'Enter valid 6 digit OTP' });
      return;
    }

    setMobileLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}candidate/verifyMobileOtp`, {
        can_mobile: mobile,
        otp: Number(mobileOtp), // ✅ FIX
      });

      if (res.data?.status === true) {
        Toast.show({ type: 'success', text1: 'Mobile verified' });
        setMobileVerified(true);
        await AsyncStorage.removeItem('mobileOtpTime');
        setMobileTimer(0);
      } else {
        Toast.show({
          type: 'error',
          text1: res.data?.message || 'Invalid OTP',
        });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Server error' });
    } finally {
      setMobileLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (emailOtp.length !== 6) {
      Toast.show({ type: 'error', text1: 'Enter valid 6 digit OTP' });
      return;
    }

    setEmailLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}candidate/verifyEmailOtp`, {
        can_email: email,
        otp: Number(emailOtp), // ✅ FIX
      });

      if (res.data?.status === true) {
        Toast.show({ type: 'success', text1: 'Email verified' });
        setEmailVerified(true);
        await AsyncStorage.removeItem('emailOtpTime');
        setEmailTimer(0);
      } else {
        Toast.show({
          type: 'error',
          text1: res.data?.message || 'Invalid OTP',
        });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Server error' });
    } finally {
      setEmailLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const resendMobileOtp = async () => {
    try {
      const res = await axios.post(`${BASE_URL}candidate/resendMobileOtp`, {
        can_mobile: mobile,
      });

      if (res.data?.status) {
        Toast.show({ type: 'success', text1: 'OTP resent to mobile' });
        await AsyncStorage.setItem('mobileOtpTime', Date.now().toString());
        setMobileTimer(RESEND_TIME);
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Server error' });
    }
  };

  const resendEmailOtp = async () => {
    try {
      const res = await axios.post(`${BASE_URL}candidate/resendOtp`, {
        can_email: email,
      });

      if (res.data?.status) {
        Toast.show({ type: 'success', text1: 'OTP resent to email' });
        await AsyncStorage.setItem('emailOtpTime', Date.now().toString());
        setEmailTimer(RESEND_TIME);
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Server error' });
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
              disabled={mobileVerified || mobileLoading}
            >
              {mobileLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.verifyText}>
                  {mobileVerified ? '✓ Done' : 'Verify'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {!mobileVerified && (
            <View style={styles.resendWrap}>
              {mobileTimer > 0 ? (
                <Text style={styles.timerText}>
                  Resend OTP in {mobileTimer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={resendMobileOtp}>
                  <Text style={styles.resendText}>Send new code</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
              disabled={emailVerified || emailLoading}
            >
              {emailLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.verifyText}>
                  {emailVerified ? '✓ Done' : 'Verify'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {!emailVerified && (
            <View style={styles.resendWrap}>
              {emailTimer > 0 ? (
                <Text style={styles.timerText}>
                  Resend OTP in {emailTimer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={resendEmailOtp}>
                  <Text style={styles.resendText}>Send new code</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  resendWrap: {
    marginTop: 6,
    alignItems: 'center',
  },

  resendText: {
    color: '#2563eb',
    fontWeight: '800',
    fontSize: 13,
  },

  timerText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
});
