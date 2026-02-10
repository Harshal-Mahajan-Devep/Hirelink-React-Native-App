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
    con_name: Yup.string().min(3).required(),
    con_email: Yup.string().email().required(),
    con_mobile: Yup.string()
      .matches(/^[0-9]{10}$/)
      .required(),
    con_subject: Yup.string().required(),
    con_message: Yup.string().min(10).required(),
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
        const res = await axios.post(
          `${BASE_URL}candidate/insert/tbl_contact`,
          values,
        );

        if (res.data?.status) {
          Toast.show({
            type: 'success',
            text1: 'Message sent successfully',
          });
          resetForm();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Failed to send message',
          });
        }
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
    <>
      <Header navigation={navigation} />

      <ScrollView
        style={styles.page}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ===== HERO ===== */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Contact Hirelink</Text>
          <Text style={styles.heroSub}>
            We’re here to help job seekers & employers
          </Text>
        </View>

        {/* ===== CONTACT INFO ===== */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>📧</Text>
            <Text style={styles.infoText}>support@hirelink.com</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>📞</Text>
            <Text style={styles.infoText}>+91 9876543210</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>Pune, Maharashtra</Text>
          </View>
        </View>

        {/* ===== FORM ===== */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Send us a message</Text>

          <Input
            label="Full name"
            placeholder="Your full name"
            value={formik.values.con_name}
            onChangeText={formik.handleChange('con_name')}
          />
          <Error text={formik.touched.con_name && formik.errors.con_name} />

          <Input
            label="Email"
            placeholder="you@email.com"
            keyboardType="email-address"
            value={formik.values.con_email}
            onChangeText={formik.handleChange('con_email')}
          />
          <Error text={formik.touched.con_email && formik.errors.con_email} />

          <Input
            label="Mobile"
            placeholder="10 digit number"
            keyboardType="number-pad"
            maxLength={10}
            value={formik.values.con_mobile}
            onChangeText={t =>
              formik.setFieldValue('con_mobile', t.replace(/\D/g, ''))
            }
          />
          <Error text={formik.touched.con_mobile && formik.errors.con_mobile} />

          <Input
            label="Subject"
            placeholder="Subject"
            value={formik.values.con_subject}
            onChangeText={formik.handleChange('con_subject')}
          />
          <Error
            text={formik.touched.con_subject && formik.errors.con_subject}
          />

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Write your message here..."
            value={formik.values.con_message}
            onChangeText={formik.handleChange('con_message')}
          />
          <Error
            text={formik.touched.con_message && formik.errors.con_message}
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={formik.handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Send message</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer navigation={navigation} />
    </>
  );
}

/* ===== SMALL COMPONENTS ===== */
const Input = ({ label, ...props }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput {...props} style={styles.input} placeholderTextColor="#9ca3af" />
  </>
);

const Error = ({ text }) =>
  text ? <Text style={styles.error}>{text}</Text> : null;

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    padding: 16,
  },

  hero: {
    alignItems: 'center',
    marginBottom: 18,
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
  },

  heroSub: {
    color: '#6b7280',
    marginTop: 4,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  infoBox: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
  },

  infoIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  infoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
  },

  formTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
    color: '#111827',
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },

  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 14,
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  error: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },

  btn: {
    marginTop: 16,
    backgroundColor: '#22c55e',
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
});
