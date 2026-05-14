import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

import { BASE_URL } from '../config/constants';

export default function Contact({ navigation }) {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    con_name: Yup.string()
      .required('Full Name is required')
      .min(3, 'Minimum 3 characters'),
    con_email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    con_mobile: Yup.string()
      .matches(/^[0-9]{10}$/, 'Enter 10 digit number')
      .required('Phone number is required'),
    con_subject: Yup.string().required('Subject is required'),
    con_message: Yup.string()
      .required('Message is required')
      .min(10, 'Minimum 10 characters'),
  });

  const formik = useFormik({
    initialValues: {
      con_name: '',
      con_email: '',
      con_mobile: '',
      con_subject: '',
      con_message: '',
    },
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const url = `${BASE_URL}candidate/insert/tbl_contact`;

        const res = await axios.post(url, values);

        if (res.data?.status) {
          Toast.show({
            type: 'success',
            text1: 'Message Sent ✅',
            text2: 'We will contact you soon',
          });
          resetForm();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed ❌',
            text2: res.data?.message || 'Something went wrong',
          });
        }
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Server Error ❌',
          text2: 'Try again later',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Header navigation={navigation} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.title}>
          Get in <Text style={styles.titleGreen}>Touch</Text>
        </Text>

        {/* ✅ INFO CARD */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Hirelink</Text>

          <Text style={styles.infoText}>
            Hirelink is a modern job portal designed to connect job seekers and
            employers efficiently. Whether you are searching for your next
            career opportunity or hiring skilled talent, Hirelink makes the
            process fast and simple.
          </Text>

          <Text style={styles.subHeading}>Why Job Seekers Love Hirelink</Text>
          <Text style={styles.bullet}>🔍 Explore job openings</Text>
          <Text style={styles.bullet}>⚡ Smart profile visibility</Text>
          <Text style={styles.bullet}>📩 One-Click Apply</Text>
          <Text style={styles.bullet}>🧠 AI job recommendations</Text>

          <Text style={styles.subHeading}>Contact Details</Text>
          <Text style={styles.bullet}>📧 support@hirelink.com</Text>
          <Text style={styles.bullet}>📞 +91 9876543210</Text>
          <Text style={styles.bullet}>📍 Pune, Maharashtra</Text>
        </View>

        {/* ✅ FORM CARD */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Send Message</Text>

          {/* Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            placeholderTextColor="#9ca3af"
            value={formik.values.con_name}
            onChangeText={formik.handleChange('con_name')}
            onBlur={formik.handleBlur('con_name')}
          />
          {formik.touched.con_name && formik.errors.con_name ? (
            <Text style={styles.error}>{formik.errors.con_name}</Text>
          ) : null}

          {/* Email */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email Address"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formik.values.con_email}
            onChangeText={formik.handleChange('con_email')}
            onBlur={formik.handleBlur('con_email')}
          />
          {formik.touched.con_email && formik.errors.con_email ? (
            <Text style={styles.error}>{formik.errors.con_email}</Text>
          ) : null}

          {/* Mobile */}
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            maxLength={10}
            value={formik.values.con_mobile}
            onChangeText={text => {
              const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
              formik.setFieldValue('con_mobile', cleaned);
            }}
            onBlur={formik.handleBlur('con_mobile')}
          />
          {formik.touched.con_mobile && formik.errors.con_mobile ? (
            <Text style={styles.error}>{formik.errors.con_mobile}</Text>
          ) : null}

          {/* Subject */}
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Subject"
            placeholderTextColor="#9ca3af"
            value={formik.values.con_subject}
            onChangeText={formik.handleChange('con_subject')}
            onBlur={formik.handleBlur('con_subject')}
          />
          {formik.touched.con_subject && formik.errors.con_subject ? (
            <Text style={styles.error}>{formik.errors.con_subject}</Text>
          ) : null}

          {/* Message */}
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter Your Message"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            value={formik.values.con_message}
            onChangeText={formik.handleChange('con_message')}
            onBlur={formik.handleBlur('con_message')}
          />
          {formik.touched.con_message && formik.errors.con_message ? (
            <Text style={styles.error}>{formik.errors.con_message}</Text>
          ) : null}

          {/* Button */}
          <TouchableOpacity
            style={[styles.btn, loading ? { opacity: 0.8 } : null]}
            onPress={formik.handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Send Message ✉️</Text>
            )}
          </TouchableOpacity>
        </View>
        <Footer navigation={navigation} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 18,
    color: '#111827',
  },

  titleGreen: {
    color: '#22c55e',
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    elevation: 4,
    marginBottom: 14,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#16a34a',
    marginBottom: 10,
  },

  infoText: {
    color: '#374151',
    lineHeight: 20,
    fontSize: 13,
  },

  subHeading: {
    marginTop: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },

  bullet: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },

  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    elevation: 5,
  },

  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    color: '#111827',
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
    color: '#111827',
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#000',
  },

  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },

  error: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },

  btn: {
    marginTop: 14,
    backgroundColor: '#22c55e',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
