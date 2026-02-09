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

  /* ================= LOAD VERIFY USER ================= */
  useEffect(() => {
    const init = async () => {
      const verifyUser = JSON.parse(await AsyncStorage.getItem('verifyUser'));

      if (!verifyUser?.email || !verifyUser?.mobile) {
        Toast.show({
          type: 'error',
          text1: 'Verification session expired',
        });
        navigation.replace('Signin');
        return;
      }

      setEmail(verifyUser.email);
      setMobile(verifyUser.mobile);

      const emailTime = await AsyncStorage.getItem('emailOtpTime');
      const mobileTime = await AsyncStorage.getItem('mobileOtpTime');

      if (emailTime) {
        const diff = Math.floor((Date.now() - emailTime) / 1000);
        if (diff < RESEND_TIME) setEmailTimer(RESEND_TIME - diff);
      }

      if (mobileTime) {
        const diff = Math.floor((Date.now() - mobileTime) / 1000);
        if (diff < RESEND_TIME) setMobileTimer(RESEND_TIME - diff);
      }
    };

    init();
  }, [navigation]);

  /* ================= TIMERS ================= */
  useEffect(() => {
    if (emailTimer <= 0) return;
    const t = setInterval(() => setEmailTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [emailTimer]);

  useEffect(() => {
    if (mobileTimer <= 0) return;
    const t = setInterval(() => setMobileTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [mobileTimer]);

  /* ================= MASK ================= */
  const maskEmail = val => {
    if (!val) return '';
    const [n, d] = val.split('@');
    return `${n.slice(0, 3)}****@${d}`;
  };

  const maskMobile = val =>
    val ? val.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2') : '';

  /* ================= VERIFY MOBILE ================= */
  const verifyMobileOtp = async () => {
    if (mobileOtp.length !== 6) {
      Toast.show({ type: 'error', text1: 'Enter valid 6 digit Mobile OTP' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}candidate/verifyMobileOtp`, {
        can_mobile: mobile,
        otp: mobileOtp,
      });

      if (res.data?.status) {
        Toast.show({ type: 'success', text1: 'Mobile verified ✅' });
        setMobileVerified(true);
        await AsyncStorage.removeItem('mobileOtpTime');
        setMobileTimer(0);
      } else {
        Toast.show({ type: 'error', text1: res.data?.message });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Mobile OTP failed' });
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY EMAIL ================= */
  const verifyEmailOtp = async () => {
    if (emailOtp.length !== 6) {
      Toast.show({ type: 'error', text1: 'Enter valid 6 digit Email OTP' });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}candidate/verifyEmailOtp`, {
        can_email: email,
        otp: emailOtp,
      });

      if (res.data?.status) {
        Toast.show({ type: 'success', text1: 'Email verified ✅' });
        setEmailVerified(true);
        await AsyncStorage.removeItem('emailOtpTime');
        setEmailTimer(0);
      } else {
        Toast.show({ type: 'error', text1: res.data?.message });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Email OTP failed' });
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND ================= */
  const resendMobileOtp = async () => {
    const res = await axios.post(`${BASE_URL}candidate/resendMobileOtp`, {
      can_mobile: mobile,
    });

    if (res.data?.status) {
      Toast.show({ type: 'success', text1: 'OTP resent to mobile' });
      await AsyncStorage.setItem('mobileOtpTime', Date.now().toString());
      setMobileTimer(RESEND_TIME);
    }
  };

  const resendEmailOtp = async () => {
    const res = await axios.post(`${BASE_URL}candidate/resendOtp`, {
      can_email: email,
    });

    if (res.data?.status) {
      Toast.show({ type: 'success', text1: 'OTP resent to email' });
      await AsyncStorage.setItem('emailOtpTime', Date.now().toString());
      setEmailTimer(RESEND_TIME);
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
        returnTo: 'Home',
      }),
    );

    await AsyncStorage.removeItem('verifyUser');
    navigation.replace('Payment');
  };

  /* ================= UI ================= */
  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={styles.title}>Account Verification</Text>

        {/* MOBILE */}
        <Text style={styles.info}>
          Mobile OTP sent to{' '}
          <Text style={styles.bold}>{maskMobile(mobile)}</Text>
        </Text>

        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Mobile OTP"
             placeholderTextColor="#000"
            keyboardType="number-pad"
            maxLength={6}
            editable={!mobileVerified}
            value={mobileOtp}
            onChangeText={v => setMobileOtp(v.replace(/\D/g, '').slice(0, 6))}
          />

          <TouchableOpacity
            style={[styles.verifyBtn, mobileVerified && styles.verifiedBtn]}
            disabled={mobileVerified || loading}
            onPress={verifyMobileOtp}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>
                {mobileVerified ? 'Verified' : 'Verify'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {!mobileVerified && (
          <View style={styles.resendWrap}>
            {mobileTimer > 0 ? (
              <Text style={styles.timer}>Resend OTP in {mobileTimer}s</Text>
            ) : (
              <TouchableOpacity onPress={resendMobileOtp}>
                <Text style={styles.link}>Send new code</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* EMAIL */}
        <Text style={styles.info}>
          Email OTP sent to <Text style={styles.bold}>{maskEmail(email)}</Text>
        </Text>

        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Email OTP"
             placeholderTextColor="#000"
            keyboardType="number-pad"
            maxLength={6}
            editable={!emailVerified}
            value={emailOtp}
            onChangeText={v => setEmailOtp(v.replace(/\D/g, '').slice(0, 6))}
          />

          <TouchableOpacity
            style={[styles.verifyBtn, emailVerified && styles.verifiedBtn]}
            disabled={emailVerified || loading}
            onPress={verifyEmailOtp}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>
                {emailVerified ? 'Verified' : 'Verify'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {!emailVerified && (
          <View style={styles.resendWrap}>
            {emailTimer > 0 ? (
              <Text style={styles.timer}>Resend OTP in {emailTimer}s</Text>
            ) : (
              <TouchableOpacity onPress={resendEmailOtp}>
                <Text style={styles.link}>Send new code</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {emailVerified && mobileVerified && (
          <TouchableOpacity style={styles.payBtn} onPress={proceedToPayment}>
            <Text style={styles.payText}>Proceed to Payment</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.footer}>
          © {new Date().getFullYear()} Pharma Jobs
        </Text>
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
    padding: 20,
    elevation: 6,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
  },
  info: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },
  bold: {
    fontWeight: '800',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
  },
  verifyBtn: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  verifiedBtn: {
    backgroundColor: '#16a34a',
  },
  btnText: {
    color: '#fff',
    fontWeight: '800',
  },
  resendWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  link: {
    color: '#2563eb',
    fontWeight: '700',
  },
  timer: {
    color: '#6b7280',
    fontSize: 12,
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
  },
  footer: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 12,
    color: '#f59e0b',
  },
});
