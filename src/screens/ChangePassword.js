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

  // ✅ SAME LOGIC AS WEB
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'All fields are required',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
      });
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

      const res = await axios.post(
        `${BASE_URL}candidate/change-password`,
        {
          candidate_id: candidate.can_id,
          current_password: currentPassword,
          new_password: newPassword,
        }
      );

      if (res.data?.status) {
        Toast.show({
          type: 'success',
          text1: 'Password updated successfully ✅',
        });

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          navigation.goBack(); // profile screen
        }, 800);
      } else {
        Toast.show({
          type: 'error',
          text1: res.data?.message || 'Current password is incorrect',
        });
      }
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      {/* Current Password */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Current Password"
          secureTextEntry={!showCurrent}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
          <Text style={styles.eye}>{showCurrent ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      {/* New Password */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="New Password"
          secureTextEntry={!showNew}
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
          <Text style={styles.eye}>{showNew ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showConfirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Text style={styles.eye}>{showConfirm ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={handleChangePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Update Password</Text>
        )}
      </TouchableOpacity>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
  },

  eye: {
    fontSize: 18,
  },

  btn: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: '900',
  },
});
