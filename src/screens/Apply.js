import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import Header from './Header';
import Footer from './Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config/constants';

/* ===== EDUCATION OPTIONS (WEB SAME) ===== */
const educationOptions = {
  Diploma: ['D.Pharm'],
  Graduation: ['B.Sc', 'B.Pharmacy'],
  'Post Graduation': ['M.Sc', 'M.Pharm'],
};

export default function ApplyJobScreen({ route, navigation }) {
  const { job_id } = route.params;

  const [job, setJob] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showEduType, setShowEduType] = useState(false);
  const [showEduDetail, setShowEduDetail] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    education_type: '',
    education_detail: '',
    education_other: '',
    experience: '',
    skills: '',
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadJobDetail();
    loadCandidate();
    checkAlreadyApplied();
  }, []);

  /* ===== JOB DETAIL (WEB SARKHE) ===== */
  const loadJobDetail = async () => {
    try {
      if (!job_id) {
        console.log('JOB ID MISSING');
        return;
      }

      const res = await axios.get(
        `${BASE_URL}candidate/getdatawhere/tbl_job/job_id/${job_id}`,
      );

      console.log('JOB DETAIL RESPONSE =>', res.data);

      if (res.data?.status === true || res.data?.status === 'success') {
        const jobData = Array.isArray(res.data.data)
          ? res.data.data[0]
          : res.data.data;

        setJob(jobData);
      } else {
        Toast.show({ type: 'error', text1: 'Job not found' });
      }
    } catch (err) {
      console.log('JOB FETCH ERROR =>', err.response?.data || err.message);
      Toast.show({ type: 'error', text1: 'Failed to load job details' });
    }
  };

  /* ===== CANDIDATE ===== */
  const loadCandidate = async () => {
    const cand = JSON.parse(await AsyncStorage.getItem('candidate'));

    if (!cand?.can_id) {
      Toast.show({ type: 'error', text1: 'Please login again' });
      navigation.replace('Signin');
      return;
    }

    setForm(p => ({
      ...p,
      name: cand.can_name || '',
      email: cand.can_email || '',
      phone: cand.can_mobile || '',
      education_type: cand.can_education_type || '',
      education_detail: cand.can_education_detail || '',
      experience: cand.can_experience || '',
      skills: cand.can_skill || '',
    }));
  };

  /* ===== ALREADY APPLIED ===== */
  const checkAlreadyApplied = async () => {
    const cand = JSON.parse(await AsyncStorage.getItem('candidate'));
    if (!cand?.can_id) return;

    const res = await axios.get(
      `${BASE_URL}admin/getdatawhere/tbl_applied/apl_job_id/${job_id}`,
    );

    const found = res.data.data.some(
      i => Number(i.apl_candidate_id) === Number(cand.can_id),
    );

    setAlreadyApplied(found);
  };

  /* ================= EDUCATION ================= */
  const selectEducationType = value => {
    setForm(p => ({
      ...p,
      education_type: value,
      education_detail: '',
      education_other: '',
    }));
    setShowEduType(false);
  };

  const selectEducationDetail = value => {
    setForm(p => ({ ...p, education_detail: value }));
    setShowEduDetail(false);
  };

  /* ================= APPLY ================= */
  const applyJob = async () => {
    const cand = JSON.parse(await AsyncStorage.getItem('candidate'));

    if (!cand?.can_id) {
      Toast.show({ type: 'error', text1: 'Please login again' });
      navigation.replace('Signin');
      return;
    }

    const finalEducation =
      form.education_type === 'Other'
        ? form.education_other
        : form.education_detail;

    if (!form.education_type || !finalEducation) {
      Toast.show({ type: 'error', text1: 'Select education properly' });
      return;
    }

    if (!form.experience || !form.skills) {
      Toast.show({ type: 'error', text1: 'Enter skills & experience' });
      return;
    }

    setLoading(true);

    try {
      /* 🔥 PROFILE UPDATE (RESUME SAFE) */
      await axios.post(
        `${BASE_URL}candidate/updatedata/tbl_candidate/can_id/${cand.can_id}`,
        {
          can_education_type: form.education_type,
          can_education_detail: finalEducation,
          can_experience: form.experience,
          can_skill: form.skills,
          can_resume: cand.can_resume || '',
        },
      );

      /* 🔥 APPLY JOB */
      await axios.post(`${BASE_URL}admin/insert/tbl_applied`, {
        apl_candidate_id: cand.can_id,
        apl_job_id: job_id,
        apl_employer_id: job.job_employer_id,
      });

      Toast.show({ type: 'success', text1: 'Job Applied Successfully ✅' });
      navigation.navigate('MyJobs');
    } catch (err) {
      console.log('APPLY ERROR =>', err.response?.data || err.message);
      Toast.show({
        type: 'error',
        text1: err.response?.data?.message || 'Apply failed',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <Header navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* ===== JOB DETAIL CARD (WEB LIKE) ===== */}
        {job && (
          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{job.job_title}</Text>
            <Text style={styles.jobCompany}>
              {job.job_company} · {job.city_name}, {job.state_name}
            </Text>

            {job.job_salary && (
              <Text style={styles.salary}>₹{job.job_salary} / month</Text>
            )}
          </View>
        )}

        {/* ===== APPLY FORM ===== */}
        <Text style={styles.sectionTitle}>Apply Job</Text>

        <TextInput style={styles.input} value={form.name} editable={false} />
        <TextInput style={styles.input} value={form.email} editable={false} />
        <TextInput style={styles.input} value={form.phone} editable={false} />

        {/* EDUCATION TYPE */}
        <Text style={styles.label}>Education Type</Text>
        <Pressable style={styles.dropdown} onPress={() => setShowEduType(true)}>
          <Text>{form.education_type || 'Select Education Type'}</Text>
        </Pressable>

        {/* EDUCATION DETAIL */}
        {form.education_type && form.education_type !== 'Other' && (
          <>
            <Text style={styles.label}>Education Detail</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setShowEduDetail(true)}
            >
              <Text>{form.education_detail || 'Select Education Detail'}</Text>
            </Pressable>
          </>
        )}

        {/* OTHER */}
        {form.education_type === 'Other' && (
          <TextInput
            style={styles.input}
            placeholder="Enter Education (BCA, MCA, ITI)"
            value={form.education_other}
            onChangeText={v => setForm({ ...form, education_other: v })}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Experience"
          placeholderTextColor="#000"
          value={form.experience}
          onChangeText={v => setForm({ ...form, experience: v })}
        />

        <TextInput
          style={styles.input}
          placeholder="Skills"
          placeholderTextColor="#000"
          value={form.skills}
          onChangeText={v => setForm({ ...form, skills: v })}
        />

        <Pressable
          style={[
            styles.applyBtn,
            alreadyApplied && { backgroundColor: '#94a3b8' },
          ]}
          disabled={alreadyApplied || loading}
          onPress={applyJob}
        >
          <Text style={styles.applyText}>
            {alreadyApplied
              ? 'Already Applied'
              : loading
              ? 'Applying...'
              : 'Apply'}
          </Text>
        </Pressable>
      </ScrollView>
      <Footer navigation={navigation} />

      {/* ===== EDUCATION TYPE MODAL ===== */}
      <Modal transparent visible={showEduType}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowEduType(false)}
        >
          <View style={styles.modalBox}>
            {['Diploma', 'Graduation', 'Post Graduation', 'Other'].map(item => (
              <Pressable
                key={item}
                style={styles.modalItem}
                onPress={() => selectEducationType(item)}
              >
                <Text>{item}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* ===== EDUCATION DETAIL MODAL ===== */}
      <Modal transparent visible={showEduDetail}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowEduDetail(false)}
        >
          <View style={styles.modalBox}>
            {educationOptions[form.education_type]?.map(item => (
              <Pressable
                key={item}
                style={styles.modalItem}
                onPress={() => selectEducationDetail(item)}
              >
                <Text>{item}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { padding: 16 },

  /* JOB CARD */
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    elevation: 4,
  },
  jobTitle: { fontSize: 18, fontWeight: '800' },
  jobCompany: { color: '#64748b', marginTop: 4 },
  salary: {
    color: '#16a34a',
    fontWeight: '700',
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },

  label: { fontWeight: '700', marginTop: 12 },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    marginTop: 8,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    backgroundColor: '#fff',
  },

  applyBtn: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 999,
    marginTop: 22,
  },
  applyText: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
});
