import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config/constants';

export default function Profile({ navigation }) {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Score ring values
  const totalPoints = 1000;
  const points = Number(candidate?.can_score) || 0;
  const percentage = Math.min((points / totalPoints) * 100, 100);

  const scoreTextColor =
    percentage < 40 ? '#fa4f00' : percentage < 70 ? '#ffc107' : '#0d7904';

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

        // ✅ keep sync
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

    // ✅ score refresh only (optional)
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
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 14 }}
      >
        {/* ✅ PROFILE CARD */}
        <View style={styles.card}>
          <View style={styles.rowTop}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
              }}
              style={styles.avatar}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{toTitleCase(candidate.can_name)}</Text>

              <Text style={styles.email}>
                {candidate.can_email} | {candidate.can_mobile}
              </Text>

              <Text style={styles.location}>
                {candidate.city_name || ''} {candidate.city_name ? ',' : ''}{' '}
                {candidate.state_name || ''}
              </Text>
            </View>
          </View>

          {/* ✅ Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.outlineBtnGreen}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.outlineBtnGreenText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineBtnRed}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <Text style={styles.outlineBtnRedText}>Change Password</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ Score */}
          <View style={styles.scoreBox}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scorePoints}>{points}</Text>
              <Text style={styles.scoreTotal}>/ {totalPoints}</Text>
            </View>

            <Text style={[styles.scoreLabel, { color: scoreTextColor }]}>
              Score ({percentage.toFixed(0)}%)
            </Text>
          </View>
        </View>

        {/* ✅ My Jobs Button (Saved/Applied/Interviews page) */}
        <TouchableOpacity
          style={styles.myJobsBtn}
          onPress={() => navigation.navigate('MyJobs')}
        >
          <Text style={styles.myJobsText}>
            My Jobs (Saved / Applied / Interviews)
          </Text>
        </TouchableOpacity>

        {/* ✅ Extra content (Optional) */}
        <View style={styles.smallCard}>
          <Text style={styles.smallTitle}>About</Text>
          <Text style={styles.smallText}>{candidate.can_about || '-'}</Text>

          <Text style={styles.smallTitle}>Skills</Text>
          <Text style={styles.smallText}>{candidate.can_skill || '-'}</Text>

          <Text style={styles.smallTitle}>Experience</Text>
          <Text style={styles.smallText}>
            {candidate.can_experience
              ? `${candidate.can_experience} years`
              : '-'}
          </Text>
        </View>
        <Footer navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fff',
  },

  rowTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  avatar: { width: 80, height: 80, borderRadius: 999 },

  name: { fontSize: 18, fontWeight: '900', color: '#111827' },

  email: { color: '#6b7280', fontSize: 13, marginTop: 3 },

  location: { color: '#6b7280', fontSize: 13, marginTop: 2 },

  btnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },

  outlineBtnGreen: {
    borderWidth: 1,
    borderColor: '#16a34a',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  outlineBtnGreenText: { color: '#16a34a', fontWeight: '800' },

  outlineBtnRed: {
    borderWidth: 1,
    borderColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  outlineBtnRedText: { color: '#dc2626', fontWeight: '800' },

  scoreBox: { alignItems: 'center', marginTop: 16 },

  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 999,
    borderWidth: 8,
    borderColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  scorePoints: { fontSize: 20, fontWeight: '900', color: '#111' },

  scoreTotal: { fontSize: 11, color: '#6b7280', fontWeight: '700' },

  scoreLabel: { marginTop: 6, fontWeight: '800' },

  myJobsBtn: {
    marginTop: 14,
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  myJobsText: { color: '#fff', fontWeight: '900' },

  smallCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
  },

  smallTitle: { fontWeight: '900', marginTop: 10, marginBottom: 6 },

  smallText: { color: '#374151', fontSize: 13, lineHeight: 18 },
});
