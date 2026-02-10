import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from './Header';
import FooterMenu from './Footer';
import JobSearchBar from './JobSearchBar';
import { BASE_URL } from '../config/constants';

export default function Home({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchPlace, setSearchPlace] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [appliedPlace, setAppliedPlace] = useState('');

  useEffect(() => {
    axios
      .get(`${BASE_URL}candidate/getdata/tbl_job`)
      .then(res => setJobs(res.data?.data || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('candidate').then(u => setIsLogin(!!u));
  }, []);

  const onSearch = () => {
    navigation.navigate('Jobs', {
      keyword: appliedKeyword || searchKeyword,
      place: appliedPlace || searchPlace,
    });
  };

  return (
    <>
      <Header navigation={navigation} />

      <ScrollView style={styles.page}>
        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.title}>Find your next opportunity</Text>
          <Text style={styles.subtitle}>
            Search jobs from top companies across India
          </Text>

          <View style={styles.searchCard}>
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
              onSearch={onSearch}
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 30 }} />
        ) : (
          <TouchableOpacity
            style={styles.cta}
            onPress={() =>
              isLogin
                ? navigation.navigate('Jobs')
                : navigation.navigate('Signin')
            }
          >
            <Text style={styles.ctaText}>Get started</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <FooterMenu navigation={navigation} active="Home" />
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#f5f7fb',
  },
  hero: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#f5f7fb',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
    textAlign: 'center',
  },
  searchCard: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    elevation: 4,
  },
  cta: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#2557a7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
