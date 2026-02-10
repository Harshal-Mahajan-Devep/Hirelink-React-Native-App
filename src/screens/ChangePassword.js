import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config/constants';

export default function ChangePassword({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ===== SAME LOGIC AS BEFORE ===== */
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'All fields are required' });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem('candidate');
      if (!stored) {
        navigation.navigate('Signin');
        return;
      }

      const candidate = JSON.parse(stored);

      const res = await axios.post(`${BASE_URL}candidate/change-password`, {
        candidate_id: candidate.can_id,
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (res.data?.status) {
        Toast.show({
          type: 'success',
          text1: 'Password updated successfully ✅',
        });

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setTimeout(() => navigation.goBack(), 800);
      } else {
        Toast.show({
          type: 'error',
          text1: res.data?.message || 'Current password is incorrect',
        });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>Change your password</Text>
        <Text style={styles.sub}>
          Use a strong password to keep your account secure
        </Text>

        {/* CURRENT */}
        <View style={styles.field}>
          <Text style={styles.label}>Current password</Text>
          <View style={styles.inputBox}>
            <TextInput
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={styles.input}
              placeholder="Enter current password"
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
              <Text style={styles.eye}>{showCurrent ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NEW */}
        <View style={styles.field}>
          <Text style={styles.label}>New password</Text>
          <View style={styles.inputBox}>
            <TextInput
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <Text style={styles.eye}>{showNew ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CONFIRM */}
        <View style={styles.field}>
          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.inputBox}>
            <TextInput
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              placeholder="Re-enter new password"
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Text style={styles.eye}>{showConfirm ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Update password</Text>
          )}
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f4f7fb',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },

  sub: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },

  field: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111827',
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#111',
  },

  eye: {
    fontSize: 18,
  },

  btn: {
    marginTop: 6,
    backgroundColor: '#16a34a',
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },
});
