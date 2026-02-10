import React, { useEffect, useState } from 'react';
import { pick, types } from '@react-native-documents/picker';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import Header from './Header';
import FooterMenu from './Footer';
import RNDropdownModal from './RNDropdownModal';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config/constants';

export default function EditProfile({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [candidate, setCandidate] = useState(null);

  const [isAadharLocked, setIsAadharLocked] = useState(false);
  const [isPanLocked, setIsPanLocked] = useState(false);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCat1, setSubCat1] = useState([]);
  const [subCat2, setSubCat2] = useState([]);
  const [subCat3, setSubCat3] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSubCat1, setSelectedSubCat1] = useState('');
  const [selectedSubCat2, setSelectedSubCat2] = useState('');
  const [selectedSubCat3, setSelectedSubCat3] = useState('');

  const [educationType, setEducationType] = useState('');
  const [educationDetail, setEducationDetail] = useState('');

  const educationOptions = {
    Diploma: ['D.Pharm'],
    Graduation: ['B.Sc', 'B.Pharm'],
    'Post Graduation': ['M.Sc', 'M.Pharm'],
  };

  /* ================= LOAD CANDIDATE ================= */
  const loadCandidate = async () => {
    const stored = await AsyncStorage.getItem('candidate');
    if (!stored) {
      navigation.navigate('Signin');
      return;
    }
    const cand = JSON.parse(stored);
    setCandidate(cand);

    setIsAadharLocked((cand.can_aadhar || '').length === 12);
    setIsPanLocked((cand.can_pan || '').length === 10);

    setSelectedCategory(cand.can_mc || '');
    setSelectedSubCategory(cand.can_sc || '');
    setSelectedSubCat1(cand.can_sc1 || '');
    setSelectedSubCat2(cand.can_sc2 || '');
    setSelectedSubCat3(cand.can_sc3 || '');

    setEducationType(cand.can_education_type || '');
    setEducationDetail(cand.can_education_detail || '');
  };

  /* ================= API LOAD ================= */
  const fetchStates = async () => {
    const res = await axios.get(`${BASE_URL}candidate/getdata/tbl_state`);
    if (res.data?.status) setStates(res.data.data || []);
  };

  const fetchCities = async stateId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_city/city_state_id/${stateId}`,
    );
    setCities(res.data?.data || []);
  };

  const fetchCategories = async () => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdata/tbl_main_category`,
    );
    setCategories(res.data?.data || []);
  };

  /* ================= INIT ================= */
  useEffect(() => {
    (async () => {
      await loadCandidate();
      await Promise.all([fetchStates(), fetchCategories()]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (candidate?.can_state) fetchCities(candidate.can_state);
  }, [candidate?.can_state]);

  /* ================= SAVE ================= */
  const handleUpdate = async () => {
    if (!candidate?.can_id) return;

    if (!candidate.can_aadhar || candidate.can_aadhar.length !== 12) {
      Alert.alert('Error', 'Aadhar must be 12 digits');
      return;
    }
    if (!candidate.can_pan || candidate.can_pan.length !== 10) {
      Alert.alert('Error', 'PAN must be 10 characters');
      return;
    }

    setBtnLoading(true);

    try {
      const payload = {
        can_state: candidate.can_state,
        can_city: candidate.can_city,
        can_experience: candidate.can_experience,
        can_skill: candidate.can_skill,
        can_about: candidate.can_about,
        can_education_type: educationType,
        can_education_detail: educationDetail,
        can_mc: selectedCategory,
        can_sc: selectedSubCategory,
        can_sc1: selectedSubCat1,
        can_sc2: selectedSubCat2,
        can_sc3: selectedSubCat3,
      };

      if (!isAadharLocked) payload.can_aadhar = candidate.can_aadhar;
      if (!isPanLocked) payload.can_pan = candidate.can_pan;

      const res = await axios.post(
        `${BASE_URL}candidate/updatedata/tbl_candidate/can_id/${candidate.can_id}`,
        payload,
      );

      if (res.data?.status) {
        await AsyncStorage.setItem(
          'candidate',
          JSON.stringify({ ...candidate, ...payload }),
        );
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Update failed');
      }
    } catch (e) {
      Alert.alert('Error', 'Server error');
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading || !candidate) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const educationDetailOptions =
    educationType === 'Other'
      ? []
      : (educationOptions[educationType] || []).map(x => ({
          label: x,
          value: x,
        }));

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f6fb' }}>
      <Header navigation={navigation} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <Text style={styles.pageTitle}>Edit profile</Text>

        {/* BASIC INFO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Professional information</Text>

          <RNDropdownModal
            label="State"
            value={candidate.can_state}
            options={states}
            labelKey="state_name"
            valueKey="state_id"
            placeholder="Select state"
            onChange={v =>
              setCandidate(p => ({ ...p, can_state: v, can_city: '' }))
            }
          />

          <RNDropdownModal
            label="City"
            value={candidate.can_city}
            options={cities}
            labelKey="city_name"
            valueKey="city_id"
            placeholder="Select city"
            disabled={!candidate.can_state}
            onChange={v => setCandidate(p => ({ ...p, can_city: v }))}
          />

          <Text style={styles.label}>Aadhar number</Text>
          <TextInput
            value={candidate.can_aadhar || ''}
            editable={!isAadharLocked}
            keyboardType="numeric"
            placeholder="Enter Aadhar Number"
            placeholderTextColor={'#000000'}
            maxLength={12}
            style={[styles.input, isAadharLocked && styles.locked]}
            onChangeText={t =>
              setCandidate(p => ({ ...p, can_aadhar: t.replace(/\D/g, '') }))
            }
          />

          <Text style={styles.label}>PAN number</Text>
          <TextInput
            value={candidate.can_pan || ''}
            editable={!isPanLocked}
            maxLength={10}
            placeholder="Enter Pan Card Number"
            placeholderTextColor={'#000000'}
            style={[styles.input, isPanLocked && styles.locked]}
            onChangeText={t =>
              setCandidate(p => ({
                ...p,
                can_pan: t.toUpperCase().replace(/[^A-Z0-9]/g, ''),
              }))
            }
          />
        </View>

        {/* EDUCATION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Education</Text>

          <RNDropdownModal
            label="Education type"
            value={educationType}
            options={[
              { label: 'Diploma', value: 'Diploma' },
              { label: 'Graduation', value: 'Graduation' },
              { label: 'Post Graduation', value: 'Post Graduation' },
              { label: 'Other', value: 'Other' },
            ]}
            onChange={v => {
              setEducationType(v);
              setEducationDetail('');
            }}
          />

          {educationType === 'Other' ? (
            <TextInput
              value={educationDetail}
              placeholder="Enter education detail"
              placeholderTextColor={'#000000'}
              style={styles.input}
              onChangeText={setEducationDetail}
            />
          ) : (
            <RNDropdownModal
              label="Education detail"
              value={educationDetail}
              options={educationDetailOptions}
              disabled={!educationType}
              onChange={setEducationDetail}
            />
          )}
        </View>

        {/* ABOUT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About you</Text>

          <TextInput
            value={candidate.can_experience || ''}
            placeholder="Experience (years)"
            placeholderTextColor={'#000000'}
            keyboardType="numeric"
            style={styles.input}
            onChangeText={t => setCandidate(p => ({ ...p, can_experience: t }))}
          />

          <TextInput
            value={candidate.can_skill || ''}
            placeholder="Skills"
            placeholderTextColor={'#000000'}
            style={styles.input}
            onChangeText={t => setCandidate(p => ({ ...p, can_skill: t }))}
          />

          <TextInput
            value={candidate.can_about || ''}
            placeholder="Brief summary"
            placeholderTextColor={'#000000'}
            multiline
            style={[styles.input, { height: 100 }]}
            onChangeText={t => setCandidate(p => ({ ...p, can_about: t }))}
          />
        </View>

        {/* SAVE */}
        <TouchableOpacity
          style={styles.saveBtn}
          disabled={btnLoading}
          onPress={handleUpdate}
        >
          <Text style={styles.saveText}>
            {btnLoading ? 'Saving...' : 'Save changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FIXED FOOTER */}
      <FooterMenu navigation={navigation} active="Profile" />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  pageTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  cardTitle: {
    fontWeight: '900',
    marginBottom: 10,
    fontSize: 14,
  },

  label: {
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
  },

  locked: {
    backgroundColor: '#f3f4f6',
  },

  saveBtn: {
    backgroundColor: '#2557a7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },

  saveText: {
    color: '#fff',
    fontWeight: '900',
  },
});
