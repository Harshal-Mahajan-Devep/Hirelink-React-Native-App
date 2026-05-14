import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/constants';

export default function JobsSAIScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('saved');

  const [candidateId, setCandidateId] = useState(null);

  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [interviewJobs, setInterviewJobs] = useState([]);

  const [savedCount, setSavedCount] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);

  const [loading, setLoading] = useState(true);

  /* ✅ Load candidate id */
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

  /* ✅ Fetch counts */
  const fetchCounts = async canId => {
    try {
      const [savedRes, appliedRes, interviewRes] = await Promise.all([
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

      setSavedCount(savedRes.data?.data?.length || 0);
      setAppliedCount(appliedRes.data?.data?.length || 0);
      setInterviewCount(interviewRes.data?.data?.length || 0);
    } catch (err) {
      console.log('Count fetch error', err);
    }
  };

  const fetchSavedJobs = async canId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_save_job/save_candidate_id/${canId}`,
    );
    setSavedJobs(res.data?.data || []);
  };

  const fetchAppliedJobs = async canId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_applied/apl_candidate_id/${canId}`,
    );
    setAppliedJobs(res.data?.data || []);
  };

  const fetchInterviewJobs = async canId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_interview/itv_candidate_id/${canId}`,
    );
    setInterviewJobs(res.data?.data || []);
  };

  useEffect(() => {
    if (!candidateId) return;

    const run = async () => {
      try {
        setLoading(true);
        await fetchCounts(candidateId);

        if (activeTab === 'saved') await fetchSavedJobs(candidateId);
        if (activeTab === 'applied') await fetchAppliedJobs(candidateId);
        if (activeTab === 'interviews') await fetchInterviewJobs(candidateId);
      } catch (err) {
        console.log('Fetch tab error:', err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [candidateId, activeTab]);

  const toTitleCase = (text = '') =>
    text
      .toLowerCase()
      .split(' ')
      .map(w => (w ? w[0].toUpperCase() + w.slice(1) : ''))
      .join(' ');

  const TabBtn = ({ label, value, count }) => {
    const active = activeTab === value;
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(value)}
        style={[styles.tabBtn, active ? styles.tabActive : null]}
      >
        <Text style={[styles.tabText, active ? styles.tabTextActive : null]}>
          {label}{' '}
        </Text>
        <View style={[styles.badge, active ? styles.badgeActive : null]}>
          <Text
            style={[styles.badgeText, active ? styles.badgeTextActive : null]}
          >
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCard = item => (
    <View style={styles.jobCard}>
      <Text style={styles.jobTitle}>{toTitleCase(item.job_title || '')}</Text>
      <Text style={styles.jobCompany}>{item.job_company || '-'}</Text>
      <Text style={styles.jobLoc}>
        {item.city_name || ''} {item.city_name ? ',' : ''}{' '}
        {item.state_name || ''}
      </Text>

      {activeTab === 'saved' && (
        <TouchableOpacity
          style={styles.greenBtn}
          onPress={() =>
            navigation.navigate('ApplyJob', { jobId: item.job_id })
          }
        >
          <Text style={styles.greenBtnText}>Apply now</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const listData =
    activeTab === 'saved'
      ? savedJobs
      : activeTab === 'applied'
      ? appliedJobs
      : interviewJobs;

  return (
    <>
      <Header navigation={navigation} />
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TabBtn label="Saved" value="saved" count={savedCount} />
          <TabBtn label="Applied" value="applied" count={appliedCount} />
          <TabBtn
            label="Interviews"
            value="interviews"
            count={interviewCount}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : listData.length === 0 ? (
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <Text style={{ color: '#6b7280', fontWeight: '800' }}>
              No data found
            </Text>
          </View>
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item, index) => `${item.job_id}-${index}`}
            renderItem={({ item }) => renderCard(item)}
            contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <Footer navigation={navigation} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 8,
  },

  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
  },

  tabActive: {
    backgroundColor: '#22c55e',
  },

  tabText: {
    fontWeight: '400',
    color: '#0f172a',
  },

  tabTextActive: {
    color: '#fff',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
  },

  badgeActive: {
    backgroundColor: '#fff',
  },

  badgeText: { fontWeight: '900', color: '#0f172a', fontSize: 12 },

  badgeTextActive: { color: '#22c55e' },

  jobCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },

  jobTitle: { fontWeight: '900', color: '#111827', fontSize: 15 },

  jobCompany: { color: '#374151', marginTop: 4, fontWeight: '700' },

  jobLoc: { color: '#6b7280', marginTop: 2, fontSize: 12 },

  greenBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },

  greenBtnText: { color: '#fff', fontWeight: '900' },
});
