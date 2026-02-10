import React, { useEffect, useState } from 'react';
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

import Header from './Header';
import FooterMenu from './Footer';
import JobSearchBar from './JobSearchBar';
import { BASE_URL } from '../config/constants';
import { COLORS } from '../config/colors';

const ACTIVE = 1;

export default function Jobs({ navigation, route }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState(
    route?.params?.keyword || route?.params?.company || '',
  );
  const [searchPlace, setSearchPlace] = useState(route?.params?.place || '');

  const [appliedKeyword, setAppliedKeyword] = useState(
    route?.params?.company || '',
  );
  const [appliedPlace, setAppliedPlace] = useState('');

  /* ================= LOAD USER ================= */
  useEffect(() => {
    AsyncStorage.getItem('candidate').then(res => {
      if (res) setCandidate(JSON.parse(res));
    });
  }, []);

  /* ================= FETCH JOBS ================= */
  useEffect(() => {
    axios
      .get(`${BASE_URL}candidate/getdatawhere/tbl_job/job_status/${ACTIVE}`)
      .then(res => {
        if (res.data.status === 'success') {
          setJobs(res.data.data || []);
        }
      })
      .catch(() => Toast.show({ type: 'error', text1: 'Failed to load jobs' }))
      .finally(() => setLoading(false));
  }, []);

  /* ================= FILTER (WEB LOGIC 1:1) ================= */
  const filteredJobs = jobs.filter(job => {
    if (Number(job.job_status) !== ACTIVE) return false;

    const keyword = appliedKeyword.toLowerCase();
    const place = appliedPlace.toLowerCase();

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

  /* ================= CARD ================= */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      <Text style={styles.title}>{item.job_title}</Text>
      <Text style={styles.company}>
        {item.job_company} · {item.city_name}, {item.state_name}
      </Text>

      <View style={styles.chips}>
        <Text style={styles.chip}>{item.job_type}</Text>
        <Text style={styles.chip}>₹{item.job_salary}/month</Text>
      </View>
    </TouchableOpacity>
  );

  const JobCardSkeleton = () => (
    <View style={[styles.card, { opacity: 0.6 }]}>
      <View style={styles.skelTitle} />
      <View style={styles.skelCompany} />

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <View style={styles.skelChip} />
        <View style={styles.skelChip} />
      </View>
    </View>
  );

  return (
    <>
      <Header navigation={navigation} />

      <View style={styles.container}>
        <JobSearchBar
          jobs={jobs} // ✅ VERY IMPORTANT
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
          }}
        />

        <Text style={styles.heading}>
          {appliedKeyword ? `Jobs at ${appliedKeyword}` : 'Jobs for you'}
        </Text>

        <FlatList
          data={loading ? Array.from({ length: 6 }) : filteredJobs}
          keyExtractor={(item, index) =>
            loading ? `skeleton-${index}` : String(item.job_id)
          }
          renderItem={loading ? () => <JobCardSkeleton /> : renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FooterMenu navigation={navigation} active="Home" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 14,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 12,
    color: COLORS.textDark,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  company: {
    fontSize: 13,
    color: COLORS.textLight,
    marginVertical: 6,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  chip: {
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  skelTitle: {
    height: 18,
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
  },
  skelChip: {
    height: 22,
    width: 90,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
  },
});
