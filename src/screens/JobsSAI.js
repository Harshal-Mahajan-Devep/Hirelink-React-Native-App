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

  const getEmptyMessage = () => {
    if (activeTab === 'saved') return 'You have not saved any jobs yet';
    if (activeTab === 'applied') return 'You have not applied to any jobs yet';
    if (activeTab === 'interviews') return 'No interviews scheduled yet';
    return '';
  };

  const getInterviewBadge = status => {
    if (status === 'Pending')
      return { text: 'Waiting for confirmation', color: '#f59e0b' };
    if (status === 'Confirmed') return { text: 'Confirmed', color: '#16a34a' };
    if (status === 'Completed') return { text: 'Completed', color: '#16a34a' };
    if (status === 'Rejected') return { text: 'Rejected', color: '#dc2626' };
    if (status === 'Hold') return { text: 'Hold', color: '#f59e0b' };
    if (status === 'Candidate Cancelled')
      return { text: 'You Declined', color: '#dc2626' };
    if (status === 'Reschedule Request')
      return { text: 'Reschedule Requested', color: '#2563eb' };

    return { text: status || 'Unknown', color: '#6b7280' };
  };

  const updateInterviewStatus = async (interviewId, newStatus) => {
    try {
      await axios.post(
        `${BASE_URL}admin/updatedata/tbl_interview/itv_id/${interviewId}`,
        { itv_status: newStatus },
      );

      // refresh list + counts
      fetchInterviewJobs(candidateId);
      fetchCounts(candidateId);
    } catch (e) {
      console.log('Interview status update error:', e);
    }
  };

  /* ================= CARD ================= */
  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.job_title}</Text>
        <Text style={styles.company}>{item.job_company}</Text>
        <Text style={styles.loc}>
          {item.city_name}, {item.state_name}
        </Text>

        {/* SAVED TAB */}
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

        {/* INTERVIEWS TAB */}
        {activeTab === 'interviews' && (
          <>
            {/* STATUS BADGE */}
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: getInterviewBadge(item.itv_status).color,
                },
              ]}
            >
              <Text style={styles.badgeText}>
                {getInterviewBadge(item.itv_status).text}
              </Text>
            </View>

            {/* DATE + TIME */}
            <Text style={styles.time}>
              📅 {item.itv_date} ⏰{' '}
              {new Date(`1970-01-01T${item.itv_time}`).toLocaleTimeString(
                'en-IN',
                {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                },
              )}
            </Text>

            {/* VIRTUAL INTERVIEW LINK */}
            {item.itv_type === 'Virtual Interview' && (
              <TouchableOpacity
                onPress={() => Linking.openURL(item.itv_meeting_link)}
              >
                <Text style={styles.link}>🔗 Open meeting link</Text>
              </TouchableOpacity>
            )}

            {/* ACTION BUTTONS (WEB LIKE) */}
            {item.itv_status === 'Pending' && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() =>
                    updateInterviewStatus(item.itv_id, 'Confirmed')
                  }
                >
                  <Text style={styles.btnText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rescheduleBtn}
                  onPress={() =>
                    updateInterviewStatus(item.itv_id, 'Reschedule Request')
                  }
                >
                  <Text style={styles.rescheduleText}>Reschedule</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() =>
                    updateInterviewStatus(item.itv_id, 'Candidate Cancelled')
                  }
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  const JobSkeletonCard = () => (
    <View style={[styles.card, { opacity: 0.6 }]}>
      <View style={styles.skelTitle} />
      <View style={styles.skelCompany} />
      <View style={styles.skelLoc} />
      <View style={styles.skelBtn} />
    </View>
  );

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
        <FlatList
          data={Array.from({ length: 4 })}
          keyExtractor={(_, i) => `skel-${i}`}
          renderItem={() => <JobSkeletonCard />}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : listData.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(i, idx) => `${i.job_id}-${idx}`}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
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
  time: {
    marginTop: 6,
    fontWeight: '700',
    color: '#374151',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },

  confirmBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  rescheduleBtn: {
    borderWidth: 1,
    borderColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  cancelBtn: {
    borderWidth: 1,
    borderColor: '#dc2626',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  btnText: {
    color: '#fff',
    fontWeight: '900',
  },

  rescheduleText: {
    color: '#f59e0b',
    fontWeight: '900',
  },

  cancelText: {
    color: '#dc2626',
    fontWeight: '900',
  },

  skelTitle: {
    height: 16,
    width: '70%',
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 8,
  },
  skelCompany: {
    height: 14,
    width: '50%',
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 6,
  },
  skelLoc: {
    height: 12,
    width: '40%',
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 10,
  },
  skelBtn: {
    height: 36,
    width: '40%',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
});
