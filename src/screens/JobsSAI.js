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
import FooterMenu from './Footer';
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

  /* ================= LOAD USER ================= */
  useEffect(() => {
    AsyncStorage.getItem('candidate').then(stored => {
      if (!stored) {
        navigation.navigate('Signin');
        return;
      }
      setCandidateId(JSON.parse(stored).can_id);
    });
  }, []);

  /* ================= COUNTS ================= */
  const fetchCounts = async canId => {
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
  };

  /* ================= DATA ================= */
  const fetchAppliedJobs = async canId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_applied/apl_candidate_id/${canId}`,
    );
    const data = res.data?.data || [];
    setAppliedJobs(data);
    setAppliedJobIds(data.map(i => Number(i.job_id)));
  };

  const fetchSavedJobs = async canId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_save_job/save_candidate_id/${canId}`,
    );
    const list = res.data?.data || [];
    setSavedJobs(list.filter(j => !appliedJobIds.includes(Number(j.job_id))));
  };

  const fetchInterviewJobs = async canId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_interview/itv_candidate_id/${canId}`,
    );
    setInterviewJobs(res.data?.data || []);
  };

  /* ================= EFFECT ================= */
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
  const getBadge = status => {
    if (status === 'Pending') return { text: 'Waiting', color: '#f59e0b' };
    if (status === 'Confirmed') return { text: 'Confirmed', color: '#16a34a' };
    return { text: status || 'Unknown', color: '#6b7280' };
  };

  const listData =
    activeTab === 'saved'
      ? savedJobs
      : activeTab === 'applied'
      ? appliedJobs
      : interviewJobs;

  /* ================= CARD ================= */
  const renderItem = ({ item }) => {
    const badge = getBadge(item.itv_status);

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.job_title}</Text>
        <Text style={styles.company}>{item.job_company}</Text>
        <Text style={styles.loc}>
          {item.city_name}, {item.state_name}
        </Text>

        {activeTab === 'saved' && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate('Apply', { job_id: item.job_id })
            }
          >
            <Text style={styles.primaryText}>Apply now</Text>
          </TouchableOpacity>
        )}

        {activeTab === 'interviews' && (
          <>
            <View style={[styles.badge, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeText}>{badge.text}</Text>
            </View>

            {item.itv_type === 'Virtual Interview' && (
              <TouchableOpacity
                onPress={() => Linking.openURL(item.itv_meeting_link)}
              >
                <Text style={styles.link}>Open meeting link</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  };

  return (
     <View style={{ flex: 1, backgroundColor: '#f3f6fb', paddingBottom: 70 }}>
      <Header navigation={navigation} />

      {/* TABS */}
      <View style={styles.tabs}>
        {[
          { key: 'saved', label: 'Saved', count: savedCount },
          { key: 'applied', label: 'Applied', count: appliedCount },
          { key: 'interviews', label: 'Interviews', count: interviewCount },
        ].map(t => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setActiveTab(t.key)}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
          >
            <Text
              style={
                activeTab === t.key ? styles.tabTextActive : styles.tabText
              }
            >
              {t.label} · {t.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(i, idx) => `${i.job_id}-${idx}`}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100, // footer space
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FIXED FOOTER */}
      <FooterMenu navigation={navigation} active="My jobs" />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    padding: 10,
    gap: 1,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  tabActive: {
    backgroundColor: '#0f7e05',
  },
  tabText: {
    fontWeight: '700',
    color: '#111827',
  },
  tabTextActive: {
    fontWeight: '800',
    color: '#fff',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 15, fontWeight: '900' },
  company: { marginTop: 4, fontWeight: '700' },
  loc: { fontSize: 12, color: '#6b7280' },

  primaryBtn: {
    marginTop: 12,
    backgroundColor: '#2557a7',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '900' },

  badge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  link: {
    marginTop: 8,
    fontWeight: '800',
    color: '#2557a7',
  },
});
