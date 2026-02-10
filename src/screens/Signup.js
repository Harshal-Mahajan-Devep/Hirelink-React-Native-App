import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL } from '../config/constants';
import { saveFcmToken } from '../screens/saveFcmToken';

export default function Signup({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  /* ================= VALIDATION ================= */
  const validationSchema = Yup.object({
    fullname: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, 'Enter valid 10 digit mobile')
      .required('Mobile number is required'),
    password: Yup.string()
      .min(6, 'Minimum 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      mobile: '',
      password: '',
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${BASE_URL}candidate/signup/tbl_candidate`,
          {
            can_name: values.fullname,
            can_email: values.email,
            can_password: values.password,
            can_mobile: values.mobile,
            can_status: 'Active',
            can_pay_status: 'Pending',
            from: 'app',
          },
        );

        if (res.data?.status) {
          Toast.show({
            type: 'success',
            text1: 'Account created',
            text2: 'OTP sent to your email',
          });

          if (res.data.data?.can_id) {
            saveFcmToken(res.data.data.can_id);
          }

          await AsyncStorage.setItem(
            'signupTempData',
            JSON.stringify({
              role: 'candidate',
              data: res.data.data,
              createdAt: Date.now(),
            }),
          );

          await AsyncStorage.setItem(
            'verifyUser',
            JSON.stringify({
              email: values.email,
              role: 'candidate',
              mobile: values.mobile,
            }),
          );

          await AsyncStorage.setItem(
            'paymentUser',
            JSON.stringify({
              name: values.fullname,
              email: values.email,
              role: 'candidate',
              mobile: values.mobile,
              returnTo: 'Home',
            }),
          );

          navigation.navigate('Verify');
        } else {
          Toast.show({
            type: 'error',
            text1: res.data?.message || 'Signup failed',
          });
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: err?.response?.data?.message || 'Server error',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  /* ================= UI ================= */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f4f7fb' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.card}>
          {/* LOGO */}
          <Image
            source={require('../assets/hirelink.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.heading}>Create an account</Text>
          <Text style={styles.subText}>
            Find jobs, apply faster, get hired.
          </Text>

          {/* FULL NAME */}
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#6b7280"
            value={formik.values.fullname}
            onChangeText={formik.handleChange('fullname')}
          />
          {formik.errors.fullname && (
            <Text style={styles.error}>{formik.errors.fullname}</Text>
          )}

          {/* EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
            keyboardType="email-address"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
          />
          {formik.errors.email && (
            <Text style={styles.error}>{formik.errors.email}</Text>
          )}

          {/* MOBILE */}
          <TextInput
            style={styles.input}
            placeholder="Mobile number"
            placeholderTextColor="#6b7280"
            keyboardType="number-pad"
            maxLength={10}
            value={formik.values.mobile}
            onChangeText={v =>
              formik.setFieldValue('mobile', v.replace(/\D/g, '').slice(0, 10))
            }
          />
          {formik.errors.mobile && (
            <Text style={styles.error}>{formik.errors.mobile}</Text>
          )}

          {/* PASSWORD */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6b7280"
            secureTextEntry
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
          />
          {formik.errors.password && (
            <Text style={styles.error}>{formik.errors.password}</Text>
          )}

          {/* TERMS */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgree(!agree)}
          >
            <View style={[styles.checkbox, agree && styles.checked]}>
              {agree && <Text style={styles.tick}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to Hirelink’s{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('Terms')}
              >
                Terms
              </Text>{' '}
              &{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('PrivacyPolicies')}
              >
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>

          {/* SUBMIT */}
          <TouchableOpacity
            style={[styles.submitBtn, (!agree || loading) && { opacity: 0.6 }]}
            disabled={!agree || loading}
            onPress={formik.handleSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Create account</Text>
            )}
          </TouchableOpacity>

          {/* LOGIN */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
              <Text style={styles.loginLink}> Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    color: '#111827',
  },
  subText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#111',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
    marginBottom: 6,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#111827',
  },
  tick: {
    color: '#fff',
    fontWeight: '900',
  },
  termsText: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  link: {
    fontWeight: '800',
    color: '#2557a7',
  },
  submitBtn: {
    backgroundColor: '#008311',
    height: 48,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  submitText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 13,
    color: '#374151',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2557a7',
  },
});
