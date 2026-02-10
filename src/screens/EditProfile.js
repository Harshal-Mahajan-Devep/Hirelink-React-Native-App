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
import { launchImageLibrary } from 'react-native-image-picker';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

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
  const [isCategorySynced, setIsCategorySynced] = useState(false);

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

    // ✅ SET VALUES
    setSelectedCategory(cand.can_mc || '');
    setSelectedSubCategory(cand.can_sc || '');
    setSelectedSubCat1(cand.can_sc1 || '');
    setSelectedSubCat2(cand.can_sc2 || '');
    setSelectedSubCat3(cand.can_sc3 || '');

    setEducationType(cand.can_education_type || '');
    setEducationDetail(cand.can_education_detail || '');

    // ✅ FETCH DROPDOWN DATA IN ORDER (IMPORTANT)
    if (cand.can_mc) {
      await fetchSubCategories(cand.can_mc);
    }
    if (cand.can_sc) {
      await fetchSubCat1(cand.can_sc);
    }
    if (cand.can_sc1) {
      await fetchSubCat2(cand.can_sc1);
    }
    if (cand.can_sc2) {
      await fetchSubCat3(cand.can_sc2);
    }

    setIsCategorySynced(true); // AFTER EVERYTHING
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

  const fetchSubCategories = async mcId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_subcategory/sc_mc_id/${mcId}`,
    );
    setSubCategories(res.data?.data || []);
  };

  const fetchSubCat1 = async scId => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_subcategory_1/sc1_sc_id/${scId}`,
    );
    setSubCat1(res.data?.data || []);
  };

  const fetchSubCat2 = async sc1Id => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_subcategory_2/sc2_sc1_id/${sc1Id}`,
    );
    setSubCat2(res.data?.data || []);
  };

  const fetchSubCat3 = async sc2Id => {
    const res = await axios.get(
      `${BASE_URL}candidate/getdatawhere/tbl_subcategory_3/sc3_sc2_id/${sc2Id}`,
    );
    setSubCat3(res.data?.data || []);
  };

  /* ================= CATEGORY CASCADE ================= */

  // Main Category → Sub Category
  useEffect(() => {
    if (!isCategorySynced) return; // ✅ BLOCK FIRST LOAD

    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    } else {
      setSubCategories([]);
    }

    setSelectedSubCategory('');
    setSelectedSubCat1('');
    setSelectedSubCat2('');
    setSelectedSubCat3('');
  }, [selectedCategory]);

  // Sub Category → SubCat1
  useEffect(() => {
    if (!isCategorySynced) return;

    if (selectedSubCategory) {
      fetchSubCat1(selectedSubCategory);
    } else {
      setSubCat1([]);
    }

    setSelectedSubCat1('');
    setSelectedSubCat2('');
    setSelectedSubCat3('');
  }, [selectedSubCategory]);

  // SubCat1 → SubCat2
  useEffect(() => {
    if (!isCategorySynced) return;

    if (selectedSubCat1) {
      fetchSubCat2(selectedSubCat1);
    } else {
      setSubCat2([]);
    }

    setSelectedSubCat2('');
    setSelectedSubCat3('');
  }, [selectedSubCat1]);

  // SubCat2 → SubCat3
  useEffect(() => {
    if (!isCategorySynced) return;

    if (selectedSubCat2) {
      fetchSubCat3(selectedSubCat2);
    } else {
      setSubCat3([]);
    }

    setSelectedSubCat3('');
  }, [selectedSubCat2]);

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
      Toast.show({
        type: 'error',
        text1: 'Invalid Aadhar',
        text2: 'Aadhar must be exactly 12 digits',
      });
      return;
    }

    if (!candidate.can_pan || candidate.can_pan.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Invalid PAN',
        text2: 'PAN must be exactly 10 characters',
      });
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
        Toast.show({
          type: 'success',
          text1: 'Profile updated',
          text2: 'Your profile was updated successfully',
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update failed',
          text2: 'Please try again',
        });
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Server error',
        text2: 'Something went wrong. Try again later',
      });
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

  const uploadProfileImage = async () => {
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (!res || res.didCancel || !res.assets?.length) return;

      const file = res.assets[0];

      const formData = new FormData();
      formData.append('can_image', {
        uri:
          Platform.OS === 'android'
            ? file.uri
            : file.uri.replace('file://', ''),
        name: 'profile.jpg',
        type: file.type || 'image/jpeg',
      });

      const uploadRes = await axios.post(
        `${BASE_URL}candidate/fileupload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );

      if (uploadRes.data?.status) {
        setCandidate(p => ({
          ...p,
          can_image: uploadRes.data.files.can_image,
        }));
        Toast.show({
          type: 'success',
          text1: 'Profile image uploaded',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Image upload failed',
        });
      }
    } catch (e) {
      console.log('IMAGE UPLOAD ERROR:', e);
      Alert.alert('Error', 'Profile image upload failed');
    }
  };

  const uploadPDF = async fieldName => {
    try {
      const file = await pick({
        type: [types.pdf],
      });

      const formData = new FormData();
      formData.append(fieldName, {
        uri: file[0].uri,
        name: file[0].name || `${fieldName}.pdf`,
        type: file[0].type || 'application/pdf',
      });

      const uploadRes = await axios.post(
        `${BASE_URL}candidate/fileupload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );

      if (uploadRes.data?.status) {
        setCandidate(p => ({
          ...p,
          [fieldName]: uploadRes.data.files[fieldName],
        }));

        Toast.show({
          type: 'success',
          text1: fieldName === 'can_resume' ? 'Resume uploaded' : 'CV uploaded',
        });
      }
    } catch (e) {
      if (e?.code !== 'DOCUMENT_PICKER_CANCELED') {
        Toast.show({
          type: 'error',
          text1: 'PDF upload failed',
        });
      }
    }
  };

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

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={uploadProfileImage}
          >
            <Text style={styles.uploadText}>
              {candidate.can_image
                ? 'Profile Image Uploaded ✅'
                : 'Upload Profile Image'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => uploadPDF('can_resume')}
          >
            <Text style={styles.uploadText}>
              {candidate.can_resume
                ? 'Resume Uploaded ✅'
                : 'Upload Resume (PDF)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => uploadPDF('can_cv')}
          >
            <Text style={styles.uploadText}>
              {candidate.can_cv ? 'CV Uploaded ✅' : 'Upload CV (PDF)'}
            </Text>
          </TouchableOpacity>
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
        <View style={styles.card}>
          <RNDropdownModal
            label="Category"
            value={selectedCategory}
            options={categories}
            labelKey="mc_name"
            valueKey="mc_id"
            placeholder="Select Category"
            onChange={setSelectedCategory}
          />

          <RNDropdownModal
            label="Sub Category"
            value={selectedSubCategory}
            options={subCategories}
            labelKey="sc_name"
            valueKey="sc_id"
            placeholder={
              !selectedCategory
                ? 'Select category first'
                : subCategories.length === 0
                ? 'No sub categories'
                : 'Select Sub Category'
            }
            disabled={!selectedCategory || subCategories.length === 0}
            onChange={setSelectedSubCategory}
          />

          <RNDropdownModal
            label="Sub Category 1"
            value={selectedSubCat1}
            options={subCat1}
            labelKey="sc1_name"
            valueKey="sc1_id"
            placeholder={
              !selectedSubCategory
                ? 'Select Sub Category first'
                : subCat1.length === 0
                ? 'No sub category available'
                : 'Select Sub Category 1'
            }
            disabled={!selectedSubCategory || subCat1.length === 0}
            onChange={setSelectedSubCat1}
          />

          <RNDropdownModal
            label="Sub Category 2"
            value={selectedSubCat2}
            options={subCat2}
            labelKey="sc2_name"
            valueKey="sc2_id"
            placeholder={
              !selectedSubCat1
                ? 'Select previous category first'
                : subCat2.length === 0
                ? 'No sub category available'
                : 'Select Sub Category 2'
            }
            disabled={!selectedSubCat1 || subCat2.length === 0}
            onChange={setSelectedSubCat2}
          />

          <RNDropdownModal
            label="Sub Category 3"
            value={selectedSubCat3}
            options={subCat3}
            labelKey="sc3_name"
            valueKey="sc3_id"
            placeholder={
              !selectedSubCat2
                ? 'Select previous category first'
                : subCat3.length === 0
                ? 'No sub category available'
                : 'Select Sub Category 3'
            }
            disabled={!selectedSubCat2 || subCat3.length === 0}
            onChange={setSelectedSubCat3}
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
    backgroundColor: '#08831c',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },

  saveText: {
    color: '#fff',
    fontWeight: '900',
  },
  uploadBtn: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    marginBottom: 10,
  },

  uploadText: {
    color: '#000000',
    fontWeight: '900',
  },
});
