import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

import logo from '../assets/hirelink.png';
import { BASE_URL } from '../config/constants';
import { useNavigation } from '@react-navigation/native';

/* ================= VALIDATION ================= */
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter valid email address')
    .required('Email is required'),
  user_type: Yup.string().required('Please select user type'),
});

export default function Forgot() {
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      user_type: '',
    },
  });

  /* ================= SUBMIT ================= */
  const onSubmit = async data => {
    try {
      const res = await fetch(`${BASE_URL}forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.status) {
        Toast.show({
          type: 'success',
          text1: 'Reset link sent',
          text2: 'Check your email inbox',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: result.message,
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Server error',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.page}>
        {/* CARD */}
        <View style={styles.card}>
          {/* BACK */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>

          {/* LOGO */}
          <Image source={logo} style={styles.logo} />

          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>
            Enter your registered email address. We’ll send you a reset link.
          </Text>

          {/* EMAIL */}
          <View style={styles.field}>
            <Text style={styles.label}>Email address</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}
          </View>

          {/* USER TYPE */}
          <View style={[styles.field, { textAlign: 'left' }]}>
            <Text style={styles.label}>Account type</Text>

            <Controller
              control={control}
              name="user_type"
              render={({ field: { onChange, value } }) => (
                <View style={styles.radioRow}>
                  <TouchableOpacity
                    style={[
                      styles.radioBox,
                      value === 'candidate' && styles.radioActive,
                    ]}
                    onPress={() => onChange('candidate')}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        value === 'candidate' && styles.radioTextActive,
                      ]}
                    >
                      Candidate
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            {errors.user_type && (
              <Text style={styles.error}>{errors.user_type.message}</Text>
            )}
          </View>

          {/* SUBMIT */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.submitText}>Send reset link</Text>
          </TouchableOpacity>

          {/* LOGIN */}
          <Text style={styles.loginText}>
            Remember password?{' '}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('Signin')}
            >
              Login
            </Text>
          </Text>
        </View>
      </ScrollView>

      <Toast />
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
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

  back: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 10,
  },

  logo: {
    width: 150,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    color: '#111827',
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 13,
    color: '#6b7280',
    marginTop: 6,
    marginBottom: 20,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontWeight: '800',
    marginBottom: 6,
    color: '#111827',
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    color: '#111827',
    backgroundColor: '#fff',
  },

  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700',
  },

  radioRow: {
    flexDirection: 'row',
    gap: 10,
  },

  radioBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },

  radioActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#22c55e',
  },

  radioText: {
    fontWeight: '700',
    color: '#374151',
  },

  radioTextActive: {
    color: '#16a34a',
  },

  submitBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 10,
  },

  submitText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },

  loginText: {
    textAlign: 'center',
    marginTop: 18,
    fontSize: 13,
    color: '#6b7280',
  },

  loginLink: {
    color: '#2563eb',
    fontWeight: '800',
  },
});
