import React, { useEffect, useState } from 'react';
import { pick, types } from '@react-native-documents/picker';
import Header from './Header';
import Footer from './Footer';
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config/constants';

import RNDropdownModal from './RNDropdownModal';

export default function EditProfile({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [candidate, setCandidate] = useState(null);

  // ✅ Locks like web
  const [isAadharLocked, setIsAadharLocked] = useState(false);
  const [isPanLocked, setIsPanLocked] = useState(false);

  // ✅ State/City
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // ✅ Categories
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCat1, setSubCat1] = useState([]);
  const [subCat2, setSubCat2] = useState([]);
  const [subCat3, setSubCat3] = useState([]);

  // ✅ Selected category ids
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSubCat1, setSelectedSubCat1] = useState('');
  const [selectedSubCat2, setSelectedSubCat2] = useState('');
  const [selectedSubCat3, setSelectedSubCat3] = useState('');

  // ✅ Education
  const [educationType, setEducationType] = useState('');
  const [educationDetail, setEducationDetail] = useState('');

  const educationOptions = {
    Diploma: ['D.Pharm'],
    Graduation: ['B.Sc', 'B.Pharm'],
    'Post Graduation': ['M.Sc', 'M.Pharm'],
  };

  /* =================== LOAD Candidate =================== */
  const loadCandidate = async () => {
    const stored = await AsyncStorage.getItem('candidate');
    if (!stored) {
      navigation.navigate('Signin');
      return;
    }
    const cand = JSON.parse(stored);
    setCandidate(cand);

    // ✅ lock check
    setIsAadharLocked((cand.can_aadhar || '').length === 12);
    setIsPanLocked((cand.can_pan || '').length === 10);

    // ✅ selected dropdown values sync
    setSelectedCategory(cand.can_mc || '');
    setSelectedSubCategory(cand.can_sc || '');
    setSelectedSubCat1(cand.can_sc1 || '');
    setSelectedSubCat2(cand.can_sc2 || '');
    setSelectedSubCat3(cand.can_sc3 || '');

    setEducationType(cand.can_education_type || '');
    setEducationDetail(cand.can_education_detail || '');
  };

  /* =================== APIs =================== */
  const fetchStates = async () => {
    const res = await axios.get(`${BASE_URL}candidate/getdata/tbl_state`);
    if (res.data?.status) setStates(res.data.data || []);
  };

  const fetchCities = async stateId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_city/city_state_id/${stateId}`,
    );
    if (res.data?.status) setCities(res.data.data || []);
    else setCities([]);
  };

  const fetchCategories = async () => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdata/tbl_main_category`,
    );
    setCategories(res.data.data || []);
  };

  const fetchSubCategories = async mc_id => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_subcategory/sc_mc_id/${mc_id}`,
    );
    setSubCategories(res.data.data || []);
  };

  const fetchSubCat1 = async sc_id => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_subcategory_1/sc1_sc_id/${sc_id}`,
    );
    setSubCat1(res.data.data || []);
  };

  const fetchSubCat2 = async sc1_id => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_subcategory_2/sc2_sc1_id/${sc1_id}`,
    );
    setSubCat2(res.data.data || []);
  };

  const fetchSubCat3 = async sc2_id => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_subcategory_3/sc3_sc2_id/${sc2_id}`,
    );
    setSubCat3(res.data.data || []);
  };

  /* =================== INIT =================== */
  useEffect(() => {
    const init = async () => {
      try {
        await loadCandidate();
        await Promise.all([fetchStates(), fetchCategories()]);
      } catch (e) {
        console.log('Init error', e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /* ✅ Cities load when candidate state exists */
  useEffect(() => {
    if (candidate?.can_state) fetchCities(candidate.can_state);
  }, [candidate?.can_state]);

  /* ✅ Category dependent fetch */
  useEffect(() => {
    if (selectedCategory) fetchSubCategories(selectedCategory);
    else {
      setSubCategories([]);
      setSelectedSubCategory('');
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubCategory) fetchSubCat1(selectedSubCategory);
    else {
      setSubCat1([]);
      setSelectedSubCat1('');
    }
  }, [selectedSubCategory]);

  useEffect(() => {
    if (selectedSubCat1) fetchSubCat2(selectedSubCat1);
    else {
      setSubCat2([]);
      setSelectedSubCat2('');
    }
  }, [selectedSubCat1]);

  useEffect(() => {
    if (selectedSubCat2) fetchSubCat3(selectedSubCat2);
    else {
      setSubCat3([]);
      setSelectedSubCat3('');
    }
  }, [selectedSubCat2]);

  const handleUpdate = async () => {
    if (!candidate?.can_id) return;

    // ✅ Web validations
    if (!candidate.can_aadhar || candidate.can_aadhar.length !== 12) {
      Alert.alert('Error', 'Aadhar must be exactly 12 digits');
      return;
    }
    if (!candidate.can_pan || candidate.can_pan.length !== 10) {
      Alert.alert('Error', 'PAN must be exactly 10 characters');
      return;
    }
    // if (!candidate.can_resume) {
    //   Alert.alert('Error', 'Please upload Resume (PDF) - feature pending');
    //   return;
    // }
    // if (!candidate.can_cv) {
    //   Alert.alert('Error', 'Please upload CV (PDF) - feature pending');
    //   return;
    // }

    setBtnLoading(true);

    try {
      const payload = {
        can_experience: candidate.can_experience,
        can_skill: candidate.can_skill,
        can_about: candidate.can_about,
        can_state: candidate.can_state,
        can_city: candidate.can_city,

        can_education_type: educationType,
        can_education_detail: educationDetail,

        // can_resume: candidate.can_resume,
        // can_cv: candidate.can_cv,

        can_mc: selectedCategory,
        can_sc: selectedSubCategory,
        can_sc1: selectedSubCat1,
        can_sc2: selectedSubCat2,
        can_sc3: selectedSubCat3,
      };

      // ✅ Only send if not locked (web logic)
      if (!isAadharLocked) payload.can_aadhar = candidate.can_aadhar;
      if (!isPanLocked) payload.can_pan = candidate.can_pan;

      const res = await axios.post(
        `${BASE_URL}candidate/updatedata/tbl_candidate/can_id/${candidate.can_id}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } },
      );

      if (res.data?.status === true) {
        // ✅ set lock after success
        setIsAadharLocked((candidate.can_aadhar || '').length === 12);
        setIsPanLocked((candidate.can_pan || '').length === 10);

        // ✅ update localStorage/AsyncStorage
        const updatedCandidate = {
          ...candidate,
          can_mc: selectedCategory,
          can_sc: selectedSubCategory,
          can_sc1: selectedSubCat1,
          can_sc2: selectedSubCat2,
          can_sc3: selectedSubCat3,

          can_education_type: educationType,
          can_education_detail: educationDetail,

          can_score: res.data?.can_score || candidate.can_score,
        };

        await AsyncStorage.setItem(
          'candidate',
          JSON.stringify(updatedCandidate),
        );

        Alert.alert('Success', 'Profile updated successfully ✅');
        navigation.goBack();
      } else {
        Alert.alert('Error', res.data?.message || 'Update failed');
      }
    } catch (e) {
      console.log('Update error:', e);
      Alert.alert('Error', 'Server error. Try again.');
    } finally {
      setBtnLoading(false);
    }
  };

  const uploadFile = async fieldName => {
    try {
      const res = await pick({
        type: [types.pdf],
        allowMultiSelection: false,
      });

      const file = res[0];

      const formData = new FormData();

      formData.append(fieldName, {
        uri: file.uri,
        name: file.name || `${fieldName}.pdf`,
        type: 'application/pdf',
      });

      const uploadRes = await axios.post(
        `${BASE_URL}candidate/fileuploadapp`,
        formData,
        {
          headers: {
            Accept: 'application/json',
            // ❌ Content-Type manually set नको करू
          },
          timeout: 30000,
        },
      );

      if (uploadRes.data?.status) {
        const filename = uploadRes.data?.files?.[fieldName];

        setCandidate(prev => ({
          ...prev,
          [fieldName]: filename,
        }));

        Alert.alert('Success ✅', `${fieldName} uploaded successfully`);
      } else {
        Alert.alert('Error ❌', uploadRes.data?.message || 'File not uploaded');
      }
    } catch (err) {
      console.log('UPLOAD ERROR:', err);

      if (err?.code === 'DOCUMENT_PICKER_CANCELED') return;

      Alert.alert(
  "Upload Debug",
  JSON.stringify({
    status: err?.response?.status,
    data: err?.response?.data,
    message: err?.message,
  }, null, 2)
);


    }
  };

  if (loading || !candidate) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ✅ Convert arrays for dropdown
  const educationDetailOptions =
    educationType === 'Other'
      ? []
      : (educationOptions[educationType] || []).map(x => ({
          label: x,
          value: x,
        }));

  return (
    <>
      <Header navigation={navigation} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 14 }}
      >
        <Text style={styles.heading}>Edit Profile</Text>

        {/* ✅ PROFESSIONAL INFO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Professional Information</Text>

          {/* State */}
          <RNDropdownModal
            label="State"
            value={candidate.can_state}
            options={states}
            labelKey="state_name"
            valueKey="state_id"
            placeholder="Select State"
            onChange={val => {
              setCandidate(prev => ({
                ...prev,
                can_state: val,
                can_city: '',
              }));
            }}
          />

          {/* City */}
          <RNDropdownModal
            label="City"
            value={candidate.can_city}
            options={cities}
            labelKey="city_name"
            valueKey="city_id"
            placeholder={
              candidate.can_state ? 'Select City' : 'Select state first'
            }
            disabled={!candidate.can_state}
            onChange={val => {
              setCandidate(prev => ({ ...prev, can_city: val }));
            }}
          />

          {/* Aadhar */}
          <Text style={styles.label}>Aadhar Card Number</Text>
          <TextInput
            value={candidate.can_aadhar || ''}
            onChangeText={t => {
              const onlyNum = t.replace(/\D/g, '');
              setCandidate(prev => ({ ...prev, can_aadhar: onlyNum }));
            }}
            keyboardType="numeric"
            maxLength={12}
            editable={!isAadharLocked}
            placeholder="Enter 12-digit Aadhar number"
            style={[styles.input, isAadharLocked ? styles.locked : null]}
          />
          {isAadharLocked ? (
            <Text style={styles.lockText}>
              Aadhar number once saved cannot be changed.
            </Text>
          ) : null}

          {/* PAN */}
          <Text style={styles.label}>PAN Card Number</Text>
          <TextInput
            value={candidate.can_pan || ''}
            onChangeText={t => {
              const up = t.toUpperCase().replace(/[^A-Z0-9]/g, '');
              setCandidate(prev => ({ ...prev, can_pan: up }));
            }}
            maxLength={10}
            editable={!isPanLocked}
            placeholder="ABCDE1234F"
            style={[styles.input, isPanLocked ? styles.locked : null]}
          />
          {isPanLocked ? (
            <Text style={styles.lockText}>
              PAN number once saved cannot be changed.
            </Text>
          ) : null}

          {/* Resume / CV (for now text based - upload part next step) */}
          {/* <Text style={styles.label}>Resume (PDF)</Text>

          <TouchableOpacity
            style={[
              styles.uploadBtn,
              candidate.can_resume ? styles.uploadDone : styles.uploadPending,
            ]}
            onPress={() => uploadFile('can_resume')}
          >
            <Text style={styles.uploadText}>
              {candidate.can_resume
                ? '✅ Resume Uploaded'
                : '⬆ Upload Resume (PDF)'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Cover Letter (PDF)</Text>

          <TouchableOpacity
            style={[
              styles.uploadBtn,
              candidate.can_cv ? styles.uploadDone : styles.uploadPending,
            ]}
            onPress={() => uploadFile('can_cv')}
          >
            <Text style={styles.uploadText}>
              {candidate.can_cv
                ? '✅ CV Uploaded'
                : '⬆ Upload Cover Letter (PDF)'}
            </Text>
          </TouchableOpacity> */}

          {/* Education Type */}
          <RNDropdownModal
            label="Education Type"
            value={educationType}
            options={[
              { label: 'Diploma', value: 'Diploma' },
              { label: 'Graduation', value: 'Graduation' },
              { label: 'Post Graduation', value: 'Post Graduation' },
              { label: 'Other', value: 'Other' },
            ]}
            onChange={val => {
              setEducationType(val);
              setEducationDetail('');
            }}
          />

          {/* Education Detail */}
          {educationType === 'Other' ? (
            <>
              <Text style={styles.label}>Education Detail</Text>
              <TextInput
                value={educationDetail}
                placeholder="Enter Education Detail"
                style={styles.input}
                onChangeText={setEducationDetail}
              />
            </>
          ) : (
            <RNDropdownModal
              label="Education Detail"
              value={educationDetail}
              options={educationDetailOptions}
              placeholder={educationType ? 'Select' : 'Select education first'}
              disabled={!educationType}
              onChange={val => setEducationDetail(val)}
            />
          )}

          {/* Experience */}
          <Text style={styles.label}>Experience</Text>
          <TextInput
            value={
              candidate.can_experience ? String(candidate.can_experience) : ''
            }
            placeholder="Experience"
            keyboardType="numeric"
            style={styles.input}
            onChangeText={t => setCandidate(p => ({ ...p, can_experience: t }))}
          />

          {/* Skills */}
          <Text style={styles.label}>Skills</Text>
          <TextInput
            value={candidate.can_skill || ''}
            placeholder="Skills"
            style={styles.input}
            onChangeText={t => setCandidate(p => ({ ...p, can_skill: t }))}
          />

          {/* About */}
          <Text style={styles.label}>Describe Self</Text>
          <TextInput
            value={candidate.can_about || ''}
            placeholder="Briefly describe yourself"
            multiline
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            onChangeText={t => setCandidate(p => ({ ...p, can_about: t }))}
          />
        </View>

        {/* ✅ CATEGORY SECTION */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Category</Text>

          <RNDropdownModal
            label="Main Category"
            value={selectedCategory}
            options={categories}
            labelKey="mc_name"
            valueKey="mc_id"
            placeholder="Select Category"
            onChange={val => {
              setSelectedCategory(val);
              setSelectedSubCategory('');
              setSelectedSubCat1('');
              setSelectedSubCat2('');
              setSelectedSubCat3('');
            }}
          />

          <RNDropdownModal
            label="Sub Category"
            value={selectedSubCategory}
            options={subCategories}
            labelKey="sc_name"
            valueKey="sc_id"
            placeholder="Select Sub Category"
            disabled={!selectedCategory}
            onChange={val => {
              setSelectedSubCategory(val);
              setSelectedSubCat1('');
              setSelectedSubCat2('');
              setSelectedSubCat3('');
            }}
          />

          <RNDropdownModal
            label="Sub Category 1"
            value={selectedSubCat1}
            options={subCat1}
            labelKey="sc1_name"
            valueKey="sc1_id"
            placeholder="Select"
            disabled={!selectedSubCategory}
            onChange={val => {
              setSelectedSubCat1(val);
              setSelectedSubCat2('');
              setSelectedSubCat3('');
            }}
          />

          <RNDropdownModal
            label="Sub Category 2"
            value={selectedSubCat2}
            options={subCat2}
            labelKey="sc2_name"
            valueKey="sc2_id"
            placeholder="Select"
            disabled={!selectedSubCat1}
            onChange={val => {
              setSelectedSubCat2(val);
              setSelectedSubCat3('');
            }}
          />

          <RNDropdownModal
            label="Sub Category 3"
            value={selectedSubCat3}
            options={subCat3}
            labelKey="sc3_name"
            valueKey="sc3_id"
            placeholder="Select"
            disabled={!selectedSubCat2}
            onChange={val => setSelectedSubCat3(val)}
          />
        </View>

        {/* ✅ SAVE */}
        <TouchableOpacity
          style={styles.saveBtn}
          disabled={btnLoading}
          onPress={handleUpdate}
        >
          <Text style={styles.saveText}>
            {btnLoading ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
        <Footer navigation={navigation} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  heading: { fontSize: 18, fontWeight: '900', marginBottom: 12 },

  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 14,
  },

  sectionTitle: {
    fontWeight: '900',
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
  },

  label: {
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 6,
    color: '#111827',
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#111827',
    backgroundColor: '#fff',
  },

  locked: {
    backgroundColor: '#f3f4f6',
  },

  lockText: {
    marginTop: 4,
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
  },

  saveBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  uploadBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  uploadPending: {
    borderColor: '#16a34a',
    backgroundColor: '#fff',
  },

  uploadDone: {
    borderColor: '#16a34a',
    backgroundColor: '#ecfdf5',
  },

  uploadText: {
    fontWeight: '900',
    color: '#16a34a',
  },

  saveText: { color: '#fff', fontWeight: '900' },
});
