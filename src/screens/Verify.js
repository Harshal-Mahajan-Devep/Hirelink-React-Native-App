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
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL } from '../config/constants';

export default function Verify({ navigation }) {
  const [step, setStep] = useState('email'); // email | mobile
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  /* ================= LOAD VERIFY USER ================= */
  useEffect(() => {
    const loadData = async () => {
      const verifyUser = JSON.parse(
        await AsyncStorage.getItem('verifyUser')
      );

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
    };

    loadData();
  }, [navigation]);

  /* ================= HELPERS ================= */
  const maskEmail = (val) => {
    if (!val) return '';
    const [name, domain] = val.split('@');
    return `${name.slice(0, 3)}****@${domain}`;
  };

  const maskMobile = (val) =>
    val ? val.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2') : '';

  /* ================= EMAIL OTP VERIFY ================= */
  const verifyEmailOtp = async () => {
    if (emailOtp.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Enter valid 6 digit Email OTP',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}candidate/verifyEmailOtp`,
        {
          can_email: email,
          otp: emailOtp,
        }
      );

      if (res.data?.status) {
        Toast.show({
          type: 'success',
          text1: 'Email verified successfully ✅',
        });
        setStep('mobile');
      } else {
        Toast.show({
          type: 'error',
          text1: res.data?.message || 'Email OTP verification failed',
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Email OTP verification failed',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= MOBILE OTP VERIFY ================= */
  const verifyMobileOtp = async () => {
    if (mobileOtp.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Enter valid 6 digit Mobile OTP',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}candidate/verifyMobileOtp`,
        {
          can_mobile: mobile,
          otp: mobileOtp,
        }
      );

      if (res.data?.status) {
        Toast.show({
          type: 'success',
          text1: 'Mobile number verified ✅',
        });

        // Prepare payment flow (same logic as web)
        await AsyncStorage.setItem(
          'paymentUser',
          JSON.stringify({
            email,
            role: 'candidate',
            for: 'Account Create',
            returnTo: 'Home',
          })
        );

        await AsyncStorage.removeItem('verifyUser');

        setTimeout(() => {
          navigation.replace('Payment');
        }, 800);
      } else {
        Toast.show({
          type: 'error',
          text1: res.data?.message || 'Mobile OTP verification failed',
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Mobile OTP verification failed',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND ================= */
  const resendEmailOtp = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}candidate/resendOtp`,
        { can_email: email }
      );

      if (res.data?.status) {
        Toast.show({
          type: 'success',
          text1: 'OTP resent to email',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: res.data?.message || 'Failed to resend OTP',
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Failed to resend OTP',
      });
    }
  };

  const resendMobileOtp = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}candidate/resendMobileOtp`,
        { can_mobile: mobile }
      );

      if (res.data?.status) {
        Toast.show({
          type: 'success',
          text1: 'OTP resent to mobile',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: res.data?.message || 'Failed to resend OTP',
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Failed to resend OTP',
      });
    }
  };

  /* ================= UI ================= */
  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {step === 'email' ? 'Email Verification' : 'Mobile Verification'}
        </Text>

        {step === 'email' && (
          <>
            <Text style={styles.info}>
              OTP sent to <Text style={styles.bold}>{maskEmail(email)}</Text>
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Email OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={emailOtp}
              onChangeText={(v) =>
                setEmailOtp(v.replace(/\D/g, '').slice(0, 6))
              }
            />

            <TouchableOpacity
              style={styles.btn}
              onPress={verifyEmailOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Verify Email</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={resendEmailOtp}>
              <Text style={styles.link}>Send new code</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'mobile' && (
          <>
            <Text style={styles.info}>
              OTP sent to <Text style={styles.bold}>{maskMobile(mobile)}</Text>
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Mobile OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={mobileOtp}
              onChangeText={(v) =>
                setMobileOtp(v.replace(/\D/g, '').slice(0, 6))
              }
            />

            <TouchableOpacity
              style={styles.btn}
              onPress={verifyMobileOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Verify Mobile</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={resendMobileOtp}>
              <Text style={styles.link}>Send new code</Text>
            </TouchableOpacity>
          </>
        )}
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
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    color: '#111827',
  },
  info: {
    textAlign: 'center',
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 14,
  },
  bold: {
    fontWeight: '800',
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#0f172a',
    height: 48,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '800',
  },
  link: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#2563eb',
    marginTop: 6,
  },
});
