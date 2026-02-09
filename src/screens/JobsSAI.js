import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';
import { BASE_URL } from '../config/constants';

export default function JobsSAIScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('saved');
  const [candidateId, setCandidateId] = useState(null);

  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [interviewJobs, setInterviewJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const [savedCount, setSavedCount] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);

  const [loading, setLoading] = useState(true);

  /* ================= LOAD CANDIDATE ================= */
  useEffect(() => {
    const loadCandidate = async () => {
      const stored = await AsyncStorage.getItem('candidate');
      if (!stored) {
        navigation.navigate('Signin');
        return;
      }
      const cand = JSON.parse(stored);
      setCandidateId(cand?.can_id);
    };
    loadCandidate();
  }, []);

  /* ================= COUNTS ================= */
  const fetchCounts = async canId => {
    try {
      const [saved, applied, interview] = await Promise.all([
        axios.get(
          `${BASE_URL}candidate/getdatawhere/tbl_save_job/save_candidate_id/${canId}`,
        ),
        axios.get(
          `${BASE_URL}candidate/getdatawhere/tbl_applied/apl_candidate_id/${canId}`,
        ),
        axios.get(
          `${BASE_URL}candidate/getdatawhere/tbl_interview/itv_candidate_id/${canId}`,
        ),
      ]);

      setSavedCount(saved.data?.data?.length || 0);
      setAppliedCount(applied.data?.data?.length || 0);
      setInterviewCount(interview.data?.data?.length || 0);
    } catch (err) {
      console.log('Count error', err);
    }
  };

  /* ================= APPLIED JOBS ================= */
  const fetchAppliedJobs = async canId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_applied/apl_candidate_id/${canId}`,
    );

    const data = res.data?.data || [];
    setAppliedJobs(data);

    const ids = data.map(i => Number(i.job_id));
    setAppliedJobIds(ids);
  };

  /* ================= SAVED JOBS ================= */
  const fetchSavedJobs = async canId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_save_job/save_candidate_id/${canId}`,
    );

    const list = res.data?.data || [];

    // ❌ remove already applied jobs (same as web)
    const filtered = list.filter(
      job => !appliedJobIds.includes(Number(job.job_id)),
    );

    setSavedJobs(filtered);
  };

  /* ================= INTERVIEWS ================= */
  const fetchInterviewJobs = async canId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_interview/itv_candidate_id/${canId}`,
    );
    setInterviewJobs(res.data?.data || []);
  };

  /* ================= STATUS UPDATE ================= */
  const updateInterviewStatus = async (id, status) => {
    await axios.post(`${BASE_URL}admin/updatedata/tbl_interview/itv_id/${id}`, {
      itv_status: status,
    });
    fetchInterviewJobs(candidateId);
    fetchCounts(candidateId);
  };

  /* ================= MAIN EFFECT ================= */
  useEffect(() => {
    if (!candidateId) return;

    const run = async () => {
      setLoading(true);
      await fetchCounts(candidateId);
      await fetchAppliedJobs(candidateId);

      if (activeTab === 'saved') await fetchSavedJobs(candidateId);
      if (activeTab === 'applied') await fetchAppliedJobs(candidateId);
      if (activeTab === 'interviews') await fetchInterviewJobs(candidateId);

      setLoading(false);
    };

    run();
  }, [candidateId, activeTab]);

  /* ================= HELPERS ================= */
  const toTitleCase = (text = '') =>
    text
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const getBadge = (status = '') => {
    switch (status.trim()) {
      case 'Pending':
        return { text: 'Waiting for confirmation', color: '#facc15' };
      case 'Confirmed':
        return { text: 'Confirmed', color: '#22c55e' };
      case 'Cancelled':
      case 'Candidate Cancelled':
        return { text: 'Cancelled', color: '#ef4444' };
      case 'Reschedule Request':
        return { text: 'Reschedule Requested', color: '#3b82f6' };
      default:
        return { text: status || 'Unknown', color: '#6b7280' };
    }
  };

  const listData =
    activeTab === 'saved'
      ? savedJobs
      : activeTab === 'applied'
      ? appliedJobs
      : interviewJobs;

  /* ================= RENDER CARD ================= */
  const renderCard = ({ item }) => {
    const badge = getBadge(item.itv_status);

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{toTitleCase(item.job_title)}</Text>
        <Text style={styles.company}>{item.job_company}</Text>
        <Text style={styles.loc}>
          {item.city_name}, {item.state_name}
        </Text>

        {/* SAVED */}
        {activeTab === 'saved' && (
          <TouchableOpacity
            style={styles.greenBtn}
            onPress={() =>
              navigation.navigate('Apply', { job_id: item.job_id })
            }
          >
            <Text style={styles.greenText}>Apply Now</Text>
          </TouchableOpacity>
        )}

        {/* INTERVIEWS */}
        {activeTab === 'interviews' && (
          <>
            <View style={[styles.badge, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeText}>{badge.text}</Text>
            </View>

            {item.itv_type === 'Virtual Interview' && (
              <TouchableOpacity
                onPress={() => Linking.openURL(item.itv_meeting_link)}
              >
                <Text style={styles.link}>Open Meeting Link</Text>
              </TouchableOpacity>
            )}

            {item.itv_status === 'Pending' && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.confirm}
                  onPress={() =>
                    updateInterviewStatus(item.itv_id, 'Confirmed')
                  }
                >
                  <Text style={styles.actionText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancel}
                  onPress={() =>
                    updateInterviewStatus(item.itv_id, 'Candidate Cancelled')
                  }
                >
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Header navigation={navigation} />

        {/* TABS */}
        <View style={styles.tabs}>
          {['saved', 'applied', 'interviews'].map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setActiveTab(t)}
              style={[styles.tab, activeTab === t && styles.tabActive]}
            >
              <Text
                style={activeTab === t ? styles.tabTextActive : styles.tabText}
              >
                {t.toUpperCase()}{' '}
                {t === 'saved'
                  ? savedCount
                  : t === 'applied'
                  ? appliedCount
                  : interviewCount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(i, idx) => `${i.job_id}-${idx}`}
            renderItem={renderCard}
            contentContainerStyle={{ padding: 14, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <Footer navigation={navigation} />
    </>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  tabs: { flexDirection: 'row', gap: 8, padding: 14 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
  },
  tabActive: { backgroundColor: '#22c55e' },
  tabText: { color: '#0f172a', fontWeight: '600' },
  tabTextActive: { color: '#fff', fontWeight: '700' },

  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  title: { fontWeight: '900', fontSize: 15 },
  company: { fontWeight: '700', marginTop: 4 },
  loc: { color: '#6b7280', fontSize: 12 },

  greenBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  greenText: { color: '#fff', fontWeight: '900' },

  badge: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  link: { color: '#2563eb', marginTop: 8, fontWeight: '700' },

  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  confirm: {
    backgroundColor: '#22c55e',
    padding: 8,
    borderRadius: 8,
  },
  cancel: {
    backgroundColor: '#ef4444',
    padding: 8,
    borderRadius: 8,
  },
  actionText: { color: '#fff', fontWeight: '700' },
});
