import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import Header from './Header';
import FooterMenu from './Footer';
import RightSidebar from './RightSidebar';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config/constants';

export default function Profile({ navigation }) {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ===== SCORE LOGIC (UNCHANGED) ===== */
  const totalPoints = 1000;
  const points = Number(candidate?.can_score) || 0;
  const percentage = Math.min((points / totalPoints) * 100, 100);

  const scoreColor =
    percentage < 40 ? '#dc2626' : percentage < 70 ? '#f59e0b' : '#16a34a';

  /* ===== FETCH PROFILE ===== */
  const fetchCandidateProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem('candidate');
      if (!stored) {
        navigation.navigate('Signin');
        return;
      }

      const lsData = JSON.parse(stored);
      const res = await axios.get(
        `${BASE_URL}candidate/getdatawhere/tbl_candidate/can_id/${lsData.can_id}`,
      );

      if (res.data?.status && res.data?.data?.length > 0) {
        const fresh = res.data.data[0];
        setCandidate(fresh);
        await AsyncStorage.setItem('candidate', JSON.stringify(fresh));
      }
    } catch (err) {
      console.log('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateProfile();
    const interval = setInterval(fetchCandidateProfile, 8000);
    return () => clearInterval(interval);
  }, []);

  const toTitleCase = (text = '') =>
    text
      .toLowerCase()
      .split(' ')
      .map(w => (w ? w[0].toUpperCase() + w.slice(1) : ''))
      .join(' ');

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!candidate) {
    return (
      <View style={styles.center}>
        <Text style={{ fontWeight: '700' }}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f6fb' }}>
      {/* HEADER (menu icon only on profile via Header logic) */}
      <Header navigation={navigation} onMenuPress={() => setMenuOpen(true)} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== PROFILE CARD ===== */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.avatar}
          />

          <Text style={styles.name}>{toTitleCase(candidate.can_name)}</Text>

          <Text style={styles.subText}>{candidate.can_email}</Text>

          <Text style={styles.subText}>
            {candidate.can_mobile}
            {candidate.city_name ? ` · ${candidate.city_name}` : ''}
            {candidate.state_name ? `, ${candidate.state_name}` : ''}
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editText}>Edit profile 📝</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.passwordBtn}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <Text style={styles.passwordText}>Change password 🔑</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== SCORE ===== */}
        <View style={styles.scoreCard}>
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={styles.scorePoints}>{points}</Text>
            <Text style={styles.scoreTotal}>/ {totalPoints}</Text>
          </View>

          <Text style={[styles.scoreLabel, { color: scoreColor }]}>
            Profile score · {percentage.toFixed(0)}%
          </Text>

          <Text style={styles.scoreHint}>
            Complete your profile to get better job matches
          </Text>
        </View>

        {/* ===== MY JOBS ===== */}
        <TouchableOpacity
          style={styles.myJobsBtn}
          onPress={() => navigation.navigate('MyJobs')}
        >
          <Text style={styles.myJobsText}>
            My jobs (Saved · Applied · Interviews)
          </Text>
        </TouchableOpacity>

        {/* ===== DETAILS ===== */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About</Text>
          <Text style={styles.infoText}>{candidate.can_about || '-'}</Text>

          <Text style={styles.infoTitle}>Skills</Text>
          <Text style={styles.infoText}>{candidate.can_skill || '-'}</Text>

          <Text style={styles.infoTitle}>Experience</Text>
          <Text style={styles.infoText}>
            {candidate.can_experience
              ? `${candidate.can_experience} years`
              : '-'}
          </Text>
        </View>
      </ScrollView>

      {/* FIXED FOOTER */}
      <FooterMenu navigation={navigation} active="Profile" />

      {/* RIGHT SIDE SIDEBAR */}
      <RightSidebar
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        navigation={navigation}
      />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 999,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },

  subText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
    textAlign: 'center',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  editBtn: {
    borderWidth: 1,
    borderColor: '#00860b',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  editText: {
    color: '#00860b',
    fontWeight: '800',
  },

  passwordBtn: {
    borderWidth: 1,
    borderColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  passwordText: {
    color: '#dc2626',
    fontWeight: '800',
  },

  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  scoreCircle: {
    width: 96,
    height: 96,
    borderRadius: 999,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scorePoints: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
  },

  scoreTotal: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '700',
  },

  scoreLabel: {
    marginTop: 8,
    fontWeight: '900',
  },

  scoreHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },

  myJobsBtn: {
    marginTop: 14,
    backgroundColor: '#095c35',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  myJobsText: {
    color: '#fff',
    fontWeight: '900',
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  infoTitle: {
    fontWeight: '900',
    marginTop: 12,
    marginBottom: 6,
  },

  infoText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
});
