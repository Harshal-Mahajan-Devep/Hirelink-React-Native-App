import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Header from './Header';
import FooterMenu from './Footer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config/constants';

export default function JobDetail({ route, navigation }) {
  const { job } = route.params;

  const [candidate, setCandidate] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    AsyncStorage.getItem('candidate').then(c => {
      if (c) setCandidate(JSON.parse(c));
    });
  }, []);

  /* ================= SAVED JOBS ================= */
  const fetchSavedJobs = async canId => {
    try {
      const res = await axios.get(`${BASE_URL}candidate/saved-jobs/${canId}`);
      if (res.data.status) {
        setSavedJobs(res.data.data.map(j => Number(j.save_job_id)));
      }
    } catch {}
  };

  useEffect(() => {
    if (candidate?.can_id) fetchSavedJobs(candidate.can_id);
  }, [candidate?.can_id]);

  /* ================= SAVE / UNSAVE ================= */
  const toggleSaveJob = async () => {
    if (!candidate?.can_id) {
      Toast.show({ type: 'info', text1: 'Please login first' });
      navigation.navigate('Signin');
      return;
    }

    const jobId = Number(job.job_id);
    const isSaved = savedJobs.includes(jobId);

    const payload = {
      save_candidate_id: candidate.can_id,
      save_job_id: jobId,
    };

    try {
      if (isSaved) {
        await axios.post(`${BASE_URL}candidate/unsave-job`, payload);
        setSavedJobs(p => p.filter(id => id !== jobId));
      } else {
        await axios.post(`${BASE_URL}candidate/save-job`, payload);
        setSavedJobs(p => [...p, jobId]);
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Server error' });
    }
  };

  /* ================= APPLY ================= */
  const handleApplyClick = async () => {
    const cand = await AsyncStorage.getItem('candidate');
    if (!cand) {
      navigation.navigate('Signin');
      return;
    }
    navigation.navigate('Apply', { job_id: job.job_id });
  };

  const isSaved = savedJobs.includes(Number(job.job_id));

  return (
    <>
      <Header navigation={navigation} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
      >
        {/* ===== TOP CARD (INDEED STYLE) ===== */}
        <View style={styles.topCard}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={toggleSaveJob}>
            <Text style={{ fontSize: 22 }}>{isSaved ? '🔖' : '📑'}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{job.job_title}</Text>
          <Text style={styles.subText}>
            {job.job_company} · {job.city_name}, {job.state_name}
          </Text>

          {!!job.job_salary && (
            <Text style={styles.salary}>₹{job.job_salary} / month</Text>
          )}

          <TouchableOpacity style={styles.applyBtn} onPress={handleApplyClick}>
            <Text style={styles.applyText}>Apply now</Text>
          </TouchableOpacity>
        </View>

        {/* ===== DETAILS ===== */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Job details</Text>

          <Text style={styles.desc}>
            {job.job_description || 'No description provided.'}
          </Text>

          <View style={styles.hr} />

          {/* JOB TYPE */}
          <View style={styles.infoRow}>
            {/* <Icon name="briefcase-outline" size={18} /> */}
            <Text style={{ fontSize: 22 }}>💼</Text>
            <Text style={styles.infoTitle}>Job type</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{job.job_type || 'Full-time'}</Text>
          </View>

          {/* PAY */}
          <View style={styles.infoRow}>
            {/* <Icon name="currency-rupee" size={18} /> */}
            <Text style={{ fontSize: 22 }}>💵</Text>
            <Text style={styles.infoTitle}>Pay</Text>
          </View>
          <Text style={styles.infoValue}>₹ {job.job_salary}</Text>

          {/* LOCATION */}
          <View style={styles.infoRow}>
            {/* <Icon name="map-marker-outline" size={18} /> */}
            <Text style={{ fontSize: 22 }}>📍</Text>
            <Text style={styles.infoTitle}>Location</Text>
          </View>
          <Text style={styles.infoValue}>
            {job.city_name}, {job.state_name}
          </Text>

          {/* SKILLS */}
          <View style={styles.infoRow}>
            {/* <Icon name="star-outline" size={18} /> */}
            <Text style={{ fontSize: 22 }}>👉</Text>
            <Text style={styles.infoTitle}>Skills</Text>
          </View>

          <View style={styles.skillWrap}>
            {job.job_skills?.split(',').map((s, i) => (
              <View key={i} style={styles.skillChip}>
                <Text style={styles.skillText}>{s.trim()}</Text>
              </View>
            ))}
          </View>
          <View style={styles.infoRow}>
            {/* <Icon name="star-outline" size={18} /> */}
            <Text style={{ fontSize: 22 }}>📃</Text>
            <Text style={styles.infoTitle}>Description</Text>
          </View>
           <Text style={styles.infoValue}>
            {job.job_description || 'No description provided.'}
          </Text>
        </View>
      </ScrollView>

      {/* ===== INDEED STYLE FIXED FOOTER ===== */}
      <FooterMenu navigation={navigation} active="Home" />
    </>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
  },

  topCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  back: {
    fontWeight: '800',
    marginBottom: 8,
    color: '#111',
  },

  saveBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
  },

  subText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },

  salary: {
    fontSize: 15,
    fontWeight: '800',
    color: '#188a42',
    marginVertical: 10,
  },

  applyBtn: {
    backgroundColor: '#029139',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  applyText: {
    color: '#fff',
    fontWeight: '800',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 8,
  },

  desc: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },

  hr: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 3,
  },

  infoTitle: {
    fontWeight: '800',
    fontSize: 14,
  },

  infoValue: {
    marginLeft: 36,
    color: '#374151',
    marginTop: 4,
  },

  chip: {
    alignSelf: 'flex-start',
    marginLeft: 24,
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },

  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3730a3',
  },

  skillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 36,
    marginTop: 6,
  },

  skillChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },

  skillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
});
