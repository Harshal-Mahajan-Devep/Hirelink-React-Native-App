import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // ✅ Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}candidate/getdata/tbl_job`);

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

  // ✅ Check Candidate Login
  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('candidate');
      setIsLogin(!!user);
    };

    checkLogin();
  }, []);

  // ✅ Search Action
  const onSearch = () => {
    navigation.navigate('Jobs', {
      keyword: appliedKeyword || searchKeyword,
      place: appliedPlace || searchPlace,
    });
  };

  return (
    <>
      <Header navigation={navigation} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* SEARCH BAR */}
        <View style={styles.searchWrapper}>
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

        {/* MAIN TITLE */}
        <Text style={styles.mainTitle}>Your next job starts here</Text>

        <Text style={styles.subTitle}>
          Create an account or sign in to see your personalised job
          recommendations.
        </Text>

        {/* LOADING */}
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 18 }} />
        ) : (
          <>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => {
                if (isLogin) navigation.navigate('Jobs');
                else navigation.navigate('Signin');
              }}
            >
              <Text style={styles.startBtnText}>Get Started →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 30 }}
              onPress={() => {
                if (isLogin) navigation.navigate('Profile');
                else navigation.navigate('Signin');
              }}
            >
              <Text style={styles.resumeText}>
                <Text style={styles.resumeLink}>Post your resume</Text> - It
                only takes a few seconds
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Footer navigation={navigation} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  content: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  searchWrapper: {
    width: '100%',
    maxWidth: 720,
    marginTop: 12,
    marginBottom: 22,
  },

  mainTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#2d2d2d',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  subTitle: {
    color: '#555',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },

  startBtn: {
    backgroundColor: '#ffd60a',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    marginTop: 18,
  },

  startBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },

  resumeText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#333',
  },

  resumeLink: {
    color: '#00b341',
    fontWeight: '800',
  },
});
