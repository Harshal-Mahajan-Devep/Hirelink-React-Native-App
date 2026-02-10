import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL } from '../config/constants';
import { saveFcmToken } from '../screens/saveFcmToken';

export default function Signin({ navigation }) {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .min(6, 'Minimum 6 characters')
        .required('Password is required'),
    }),

    onSubmit: async values => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${BASE_URL}candidate/signin/tbl_candidate`,
          {
            can_email: values.email.trim(),
            can_password: values.password.trim(),
          },
        );

        const data = res.data;

        if (data?.status === true) {
          await AsyncStorage.setItem('candidate', JSON.stringify(data.data));

          await AsyncStorage.setItem('isLoggedIn', 'true');

          if (data.data?.can_id) {
            saveFcmToken(data.data.can_id);
          }

          Toast.show({
            type: 'success',
            text1: 'Login successful',
          });

          navigation.replace('Jobs');
          return;
        }

        Toast.show({
          type: 'error',
          text1: data?.message || 'Invalid email or password',
        });
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Server error',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f3f6fb' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.card}>
          {/* LOGO */}
          <Text style={styles.logo}>Hirelink</Text>

          {/* HEADER */}
          <Text style={styles.heading}>Sign in</Text>
          <Text style={styles.subText}>Continue to your account</Text>

          {/* EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={'#000000'}
            autoCapitalize="none"
            keyboardType="email-address"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <Text style={styles.error}>{formik.errors.email}</Text>
          )}

          {/* PASSWORD */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={'#000000'}
            secureTextEntry
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
          />
          {formik.touched.password && formik.errors.password && (
            <Text style={styles.error}>{formik.errors.password}</Text>
          )}

          {/* FORGOT */}
          <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>

          {/* LOGIN */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={formik.handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Sign in</Text>
            )}
          </TouchableOpacity>

          {/* SIGNUP */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New to Hirelink?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.link}> Create account</Text>
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
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#25a736',
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    color: '#111',
  },
  subText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#111',
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
    marginBottom: 6,
  },
  forgot: {
    fontSize: 13,
    fontWeight: '700',
    color: '#a76f25',
    marginBottom: 14,
    alignSelf: 'flex-end',
  },
  loginBtn: {
    backgroundColor: '#007a0b',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: {
    fontSize: 13,
    color: '#374151',
  },
  link: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2557a7',
  },
});
