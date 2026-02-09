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
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
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

          if (data.data?.can_id) {
            saveFcmToken(data.data.can_id);
          }

          Toast.show({
            type: 'success',
            text1: 'Login successful ✅',
          });

          navigation.replace('Home');
          return;
        }

        Toast.show({
          type: 'error',
          text1: data?.message || 'Invalid email or password',
        });
      } catch (error) {
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
      style={{ flex: 1, backgroundColor: '#f4f7fb' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.center}>
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
              <Text style={styles.heading}>Welcome back</Text>
              <Text style={styles.subText}>Login to Hirelink</Text>
            </View>

            <TouchableOpacity
              style={styles.signupBtn}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* EMAIL */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
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

          {/* PASSWORD */}
          <View style={styles.passRow}>
            <Text style={styles.label}>Password</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
              <Text style={styles.forgot}>Forgot?</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#000"
            secureTextEntry
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
          />
          {formik.touched.password && formik.errors.password && (
            <Text style={styles.error}>{formik.errors.password}</Text>
          )}

          {/* LOGIN */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={formik.handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
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
    marginBottom: 18,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  subText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  signupBtn: {
    borderWidth: 1,
    borderColor: '#d4d4d8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  signupText: {
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
    color: '#000',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 6,
  },
  passRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgot: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  loginBtn: {
    backgroundColor: '#0f172a',
    height: 48,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
