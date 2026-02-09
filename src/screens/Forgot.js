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

// ✅ Validation Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Enter registered email address'),
  user_type: Yup.string().required('Please select Candidate or Employer'),
});

function Forgot() {
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

  // ✅ Submit
  const onSubmit = async data => {
    try {
      const res = await fetch(`${BASE_URL}forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          user_type: data.user_type,
        }),
      });

      const result = await res.json();

      if (result.status) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Reset link sent to your email',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          {/* Back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Logo */}
          <Image source={logo} style={styles.logo} />

          <Text style={styles.title}>Forgot your password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you a link to reset your password.
          </Text>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email address</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="you@gmail.com"
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

          {/* User Type */}
          <View style={styles.field}>
            <View style={styles.radioContainer}>
              <Controller
                control={control}
                name="user_type"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TouchableOpacity
                      style={styles.radioItem}
                      onPress={() => onChange('candidate')}
                    >
                      <View
                        style={[
                          styles.radio,
                          value === 'candidate' && styles.radioSelected,
                        ]}
                      />
                      <Text>Candidate</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                      style={styles.radioItem}
                      onPress={() => onChange('employer')}
                    >
                      <View
                        style={[
                          styles.radio,
                          value === 'employer' && styles.radioSelected,
                        ]}
                      />
                      <Text>Employer</Text>
                    </TouchableOpacity> */}
                  </>
                )}
              />
            </View>

            {errors.user_type && (
              <Text style={styles.error}>{errors.user_type.message}</Text>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Send reset link</Text>
          </TouchableOpacity>

          {/* Login */}
          <Text style={styles.loginText}>
            Already have an account?{' '}
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

export default Forgot;

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  card: {
    backgroundColor: 'rgb(253, 253, 253)',
    borderRadius: 10,
    padding: 20,
    elevation: 4,
  },
  backText: {
    marginBottom: 10,
    fontSize: 16,
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#464545',
  },
  radioSelected: {
    backgroundColor: '#dfdfdf',
  },
  button: {
    backgroundColor: '#42b85d',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#666',
  },
  loginLink: {
    color: '#28a745',
    fontWeight: '600',
  },
});
