import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import JobSearchBar from './JobSearchBar';
import { BASE_URL } from '../config/constants';

export default function Jobs({ navigation, route }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [candidate, setCandidate] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  // ✅ search states
  const [searchKeyword, setSearchKeyword] = useState(
    route?.params?.keyword || '',
  );
  const [searchPlace, setSearchPlace] = useState(route?.params?.place || '');
  const [appliedKeyword, setAppliedKeyword] = useState(
    route?.params?.keyword || '',
  );
  const [appliedPlace, setAppliedPlace] = useState(route?.params?.place || '');
  const [hasSearched, setHasSearched] = useState(
    !!(route?.params?.keyword || route?.params?.place),
  );

  /* ================= LOAD CANDIDATE ================= */
  useEffect(() => {
    const loadCandidate = async () => {
      const cand = await AsyncStorage.getItem('candidate');
      if (cand) setCandidate(JSON.parse(cand));
    };
    loadCandidate();
  }, []);

  let one = 1;
  /* ================= FETCH JOBS ================= */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}candidate/getdatawhere/tbl_job/job_status/${one}`,
        );

        if (res.data.status === 'success') {
          setJobs(res.data.data || []);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.log('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* ================= FETCH SAVED JOBS ================= */
  const fetchSavedJobs = async canId => {
    try {
      const res = await axios.get(`${BASE_URL}candidate/saved-jobs/${canId}`);

      if (res.data.status) {
        setSavedJobs(res.data.data.map(j => Number(j.save_job_id)));
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load saved jobs' });
    }
  };

  useEffect(() => {
    if (candidate?.can_id) {
      fetchSavedJobs(candidate.can_id);
    }
  }, [candidate?.can_id]);

  /* ================= SAVE/UNSAVE ================= */
  const toggleSaveJob = async jobId => {
    if (!candidate?.can_id) {
      Toast.show({ type: 'info', text1: 'Please login to save jobs' });
      navigation.navigate('Signin');
      return;
    }

    const isSaved = savedJobs.includes(Number(jobId));

    const payload = {
      save_candidate_id: candidate.can_id,
      save_job_id: Number(jobId),
    };

    try {
      if (isSaved) {
        await axios.post(`${BASE_URL}candidate/unsave-job`, payload);
        setSavedJobs(prev => prev.filter(id => id !== Number(jobId)));
        Toast.show({ type: 'success', text1: 'Job removed' });
      } else {
        await axios.post(`${BASE_URL}candidate/save-job`, payload);
        setSavedJobs(prev => [...prev, Number(jobId)]);
        Toast.show({ type: 'success', text1: 'Job saved ❤️' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Server error' });
    }
  };

  /* ================= FILTER ================= */
  const filteredJobs = jobs.filter(job => {
    if (Number(job.job_status) !== one) return false;

    const keyword = (appliedKeyword || '').toLowerCase();
    const place = (appliedPlace || '').toLowerCase();

    const keywordMatch =
      !keyword ||
      job.job_title?.toLowerCase().includes(keyword) ||
      job.job_company?.toLowerCase().includes(keyword) ||
      job.job_skills?.toLowerCase().includes(keyword) ||
      job.main_category?.toLowerCase().includes(keyword) ||
      job.sub_category?.toLowerCase().includes(keyword) ||
      job.sub_category1?.toLowerCase().includes(keyword) ||
      job.sub_category2?.toLowerCase().includes(keyword) ||
      job.sub_category3?.toLowerCase().includes(keyword);

    const placeMatch =
      !place ||
      job.city_name?.toLowerCase().includes(place) ||
      job.state_name?.toLowerCase().includes(place) ||
      `${job.city_name}, ${job.state_name}`.toLowerCase().includes(place);

    return keywordMatch && placeMatch;
  });

  /* ================= RENDER CARD ================= */
  const renderJobCard = ({ item }) => {
    const isSaved = savedJobs.includes(Number(item.job_id));

    return (
      <>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('JobDetails', { job: item })}
          activeOpacity={0.8}
        >
          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={e => {
              e.stopPropagation?.();
              toggleSaveJob(item.job_id);
            }}
          >
            <Text
              style={[styles.saveIcon, isSaved ? { color: '#2557a7' } : null]}
            >
              {isSaved ? '🔖' : '📑'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>{item.job_title}</Text>
          <Text style={styles.subText}>
            {item.job_company} · {item.city_name}, {item.state_name}
          </Text>

          <View style={styles.badges}>
            <Text style={styles.badgeChip}>₹{item.job_salary}/month</Text>
            <Text style={styles.badgeChip}>{item.job_type}</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <>
      <Header navigation={navigation} />
      <View style={styles.container}>
        {/* Search Section */}
        <View style={{ padding: 14 }}>
          <JobSearchBar
            jobs={jobs}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            searchPlace={searchPlace}
            setSearchPlace={setSearchPlace}
            appliedKeyword={appliedKeyword}
            setAppliedKeyword={setAppliedKeyword}
            appliedPlace={appliedPlace}
            setAppliedPlace={setAppliedPlace}
            onSearch={() => {
              setAppliedKeyword(searchKeyword.trim());
              setAppliedPlace(searchPlace.trim());
              setHasSearched(true);
            }}
          />
        </View>

        <Text style={styles.heading}>Jobs for you</Text>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 18 }} />
        ) : (
          <>
            {hasSearched && filteredJobs.length === 0 ? (
              <View style={styles.noJobs}>
                <Text style={{ fontSize: 18 }}>💼</Text>
                <Text style={styles.noJobsTitle}>No jobs found</Text>
                <Text style={styles.noJobsText}>
                  Try different keywords or location
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredJobs}
                keyExtractor={item => item.job_id.toString()}
                renderItem={renderJobCard}
                contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    paddingHorizontal: 14,
    marginTop: 6,
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },

  saveBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: '#fff',
    borderRadius: 999,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  saveIcon: {
    fontSize: 16,
    color: '#444',
  },

  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },

  subText: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 10,
  },

  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  badgeChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#eef7ed',
    color: '#188a42',
    fontSize: 12,
    fontWeight: '700',
  },

  noJobs: {
    marginTop: 40,
    alignItems: 'center',
  },

  noJobsTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
  },

  noJobsText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});
