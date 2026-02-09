import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config/constants';

export default function JobDetail({ route, navigation }) {
  const { job } = route.params;

  const [candidate, setCandidate] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const loadCandidate = async () => {
      const cand = await AsyncStorage.getItem('candidate');
      if (cand) setCandidate(JSON.parse(cand));
    };
    loadCandidate();
  }, []);

  const fetchSavedJobs = async canId => {
    try {
      const res = await axios.get(`${BASE_URL}candidate/saved-jobs/${canId}`);

      if (res.data.status) {
        setSavedJobs(res.data.data.map(j => Number(j.save_job_id)));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (candidate?.can_id) fetchSavedJobs(candidate.can_id);
  }, [candidate?.can_id]);

  const toggleSaveJob = async () => {
    if (!candidate?.can_id) {
      Toast.show({ type: 'info', text1: 'Please login to save jobs' });
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
        setSavedJobs(prev => prev.filter(id => id !== jobId));
        Toast.show({ type: 'success', text1: 'Job removed' });
      } else {
        await axios.post(`${BASE_URL}candidate/save-job`, payload);
        setSavedJobs(prev => [...prev, jobId]);
        Toast.show({ type: 'success', text1: 'Job saved ❤️' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Server error' });
    }
  };

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
        contentContainerStyle={{ padding: 14 }}
      >
        {/* HEADER */}
        <View style={styles.topCard}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={toggleSaveJob}>
            <Text
              style={[styles.saveText, isSaved ? { color: '#2557a7' } : null]}
            >
              {isSaved ? 'Saved 🔖' : 'Save 📑'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>{job.job_title}</Text>
          <Text style={styles.subText}>
            {job.job_company} · {job.city_name}, {job.state_name}
          </Text>

          <Text style={styles.salary}>₹{job.job_salary} / month</Text>

          <TouchableOpacity style={styles.applyBtn} onPress={handleApplyClick}>
            <Text style={styles.applyText}>Apply Now</Text>
          </TouchableOpacity>
        </View>

        {/* DETAILS */}
        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.desc}>
            {job.job_description || 'No description'}
          </Text>

          <View style={styles.hr} />

          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.desc}>{job.job_skills || '-'}</Text>

          <View style={styles.hr} />

          <Text style={styles.sectionTitle}>Job Type</Text>
          <Text style={styles.desc}>{job.job_type || '-'}</Text>

          <View style={styles.hr} />

          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.desc}>
            {job.city_name}, {job.state_name}
          </Text>
        </View>
        <Footer navigation={navigation} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topCard: {
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  back: {
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },

  saveBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },

  saveText: {
    fontWeight: '800',
    color: '#444',
  },

  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
    marginBottom: 4,
  },

  subText: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 10,
  },

  salary: {
    fontSize: 15,
    fontWeight: '800',
    color: '#188a42',
    marginBottom: 12,
  },

  applyBtn: {
    backgroundColor: '#ffd60a',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },

  applyText: {
    fontWeight: '900',
    color: '#000',
  },

  detailCard: {
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 14,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111',
    marginBottom: 6,
  },

  desc: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },

  hr: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
});
