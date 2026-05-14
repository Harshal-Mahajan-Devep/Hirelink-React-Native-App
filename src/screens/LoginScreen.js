import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Toast from 'react-native-toast-message';

import { BASE_URL } from '../config/constants';

export default function LoginScreen({ navigation }) {
  const formik = useFormik({
    initialValues: {
      user_email: '',
      user_password: '',
    },

    validationSchema: Yup.object({
      user_email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      user_password: Yup.string()
        .min(6, 'Minimum 6 characters')
        .required('Password is required'),
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.post(`${BASE_URL}admin/login`, {
          user_email: values.user_email.trim(),
          user_password: values.user_password.trim(),
        });

        const data = response.data;

        if (data?.status === true) {
          Toast.show({
            type: 'success',
            text1: 'Login successful ✅',
            text2: 'Redirecting...',
          });

          resetForm();

          setTimeout(() => {
            navigation.replace('Home');
          }, 800);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login failed ❌',
            text2: data?.message || data?.msg || 'Invalid credentials',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error?.response?.data?.message || 'Server not responding',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <Image
        source={require('../assets/hirelink.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome Back 👋</Text>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputBox}>
        <Text style={styles.icon}>👤</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formik.values.user_email}
          onChangeText={formik.handleChange('user_email')}
          onBlur={formik.handleBlur('user_email')}
        />
      </View>

      {formik.touched.user_email && formik.errors.user_email ? (
        <Text style={styles.errorText}>{formik.errors.user_email}</Text>
      ) : null}

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputBox}>
        <Text style={styles.icon}>🔒</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={formik.values.user_password}
          onChangeText={formik.handleChange('user_password')}
          onBlur={formik.handleBlur('user_password')}
        />
      </View>

      {formik.touched.user_password && formik.errors.user_password ? (
        <Text style={styles.errorText}>{formik.errors.user_password}</Text>
      ) : null}

      {/* Button */}
      <TouchableOpacity
        style={styles.btn}
        onPress={formik.handleSubmit}
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>LOGIN</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    padding: 20,
    justifyContent: 'center',
  },

  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
    color: '#111',
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 8,
    marginBottom: 10,
  },

  icon: {
    fontSize: 18,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  btn: {
    backgroundColor: '#4a6cf7',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 13,
  },
});
