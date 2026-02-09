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
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        const response = await axios.post(
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

        const data = response.data;

        if (data?.status === true || data?.status === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Signup successful!',
            text2: 'OTP sent to your email',
          });

          // ✅ FCM token
          if (data.data?.can_id) {
            saveFcmToken(data.data.can_id);
          }

          // ✅ TEMP signup data (same as web)
          await AsyncStorage.setItem(
            'signupTempData',
            JSON.stringify({
              role: 'candidate',
              data: data.data,
              createdAt: Date.now(),
            }),
          );

          // ✅ verify user (OTP flow)
          await AsyncStorage.setItem(
            'verifyUser',
            JSON.stringify({
              email: values.email,
              role: 'candidate',
              mobile: values.mobile,
            }),
          );

          // ✅ payment user
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

          resetForm();

          setTimeout(() => {
            navigation.navigate('Verify');
          }, 800);
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message || 'Signup failed',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: error?.response?.data?.message || 'Server error. Try again.',
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
          <View style={styles.logoWrap}>
            <Image
              source={require('../assets/hirelink.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* HEADER */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.heading}>Create Your Hirelink Account</Text>
              <Text style={styles.subText}>
                It takes less than a minute to get started.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Signin')}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* FULL NAME */}
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
             placeholderTextColor="#000"
            value={formik.values.fullname}
            onChangeText={formik.handleChange('fullname')}
            onBlur={formik.handleBlur('fullname')}
          />
          {formik.touched.fullname && formik.errors.fullname && (
            <Text style={styles.error}>{formik.errors.fullname}</Text>
          )}

          {/* EMAIL */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
             placeholderTextColor="#000"
            autoCapitalize="none"
            keyboardType="email-address"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <Text style={styles.error}>{formik.errors.email}</Text>
          )}

          {/* MOBILE */}
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile number"
            placeholderTextColor="#000"
            keyboardType="number-pad"
            maxLength={10}
            value={formik.values.mobile}
            onChangeText={v =>
              formik.setFieldValue('mobile', v.replace(/\D/g, '').slice(0, 10))
            }
            onBlur={formik.handleBlur('mobile')}
          />
          {formik.touched.mobile && formik.errors.mobile && (
            <Text style={styles.error}>{formik.errors.mobile}</Text>
          )}

          {/* PASSWORD */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#000"
            textcolor="#0000"
            secureTextEntry
            color="#000"
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
          />
          {formik.touched.password && formik.errors.password && (
            <Text style={styles.error}>{formik.errors.password}</Text>
          )}

          {/* TERMS & CONDITIONS */}
          <TouchableOpacity
            style={styles.termsRow}
            activeOpacity={0.8}
            onPress={() => setAgree(!agree)}
          >
            <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
              {agree && <Text style={styles.checkMark}>✓</Text>}
            </View>

            <Text style={styles.termsText}>
              I agree to Hirelink’s <Text style={styles.link}>Terms</Text> &{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* SUBMIT */}
          <TouchableOpacity
            style={[styles.submitBtn, (!agree || loading) && { opacity: 0.5 }]}
            onPress={formik.handleSubmit}
            disabled={loading || !agree}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Create Account</Text>
            )}
          </TouchableOpacity>
          {/* <Text style={styles.bottomText}>
            By continuing, you agree to Hirelink’s{' '}
            <Text style={styles.link}>Terms</Text> &{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text> */}
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
    padding: 18,
    elevation: 6,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 150,
    height: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  subText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  loginBtn: {
    borderWidth: 1,
    borderColor: '#d4d4d8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  loginText: {
    fontWeight: '700',
    color: '#111827',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 8,
    color:'#0000',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 6,
  },
  submitBtn: {
    backgroundColor: '#0f172a',
    height: 48,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 14,
  },
  link: {
    fontWeight: '800',
    color: '#111827',
  },
  submitText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#0f172a',
  },

  checkMark: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },

  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
  },
});
