import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Header from './Header';
import Footer from './Footer';

export default function PrivacyPolicies({ navigation }) {
  return (
    <>
      <Header navigation={navigation} />
      <View style={styles.wrapper}>
        {/* ✅ Watermark Logo */}
        <Image
          source={require('../assets/hirelink.png')}
          style={styles.watermark}
          resizeMode="contain"
        />

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Privacy Policy</Text>

          <Text style={styles.heading}>Introduction</Text>
          <Text style={styles.text}>
            This Privacy Policy describes how Hirelinkinfo.com collects, uses,
            stores, and protects personal information provided by candidates
            while using the platform.
          </Text>

          <Text style={styles.heading}>Applicability</Text>
          <Text style={styles.text}>
            This policy applies only to candidates who register, create
            profiles, search for jobs, or apply for jobs on Hirelinkinfo.com.
          </Text>

          <Text style={styles.heading}>
            Information Collected from Candidates
          </Text>
          <Text style={styles.text}>
            Hirelinkinfo.com may collect the following information from
            candidates:
          </Text>

          <Text style={styles.bullet}>
            • Full name, email address, phone number
          </Text>
          <Text style={styles.bullet}>
            • Educational details, work experience, skills, and resume/CV
          </Text>
          <Text style={styles.bullet}>• Location and job preferences</Text>
          <Text style={styles.bullet}>
            • Login credentials and account information
          </Text>
          <Text style={styles.bullet}>
            • Payment details (if any paid candidate services are used)
          </Text>

          <Text style={styles.heading}>Purpose of Data Collection</Text>
          <Text style={styles.text}>
            Candidate information is collected for purposes including:
          </Text>

          <Text style={styles.bullet}>
            • Creating and managing candidate accounts
          </Text>
          <Text style={styles.bullet}>
            • Enabling job search and job applications
          </Text>
          <Text style={styles.bullet}>
            • Sharing candidate profiles with employers for recruitment
          </Text>
          <Text style={styles.bullet}>
            • Providing platform support and communication
          </Text>
          <Text style={styles.bullet}>
            • Improving platform features and user experience
          </Text>

          <Text style={styles.heading}>Profile Visibility to Employers</Text>
          <Text style={styles.text}>
            Candidate profiles and resumes may be viewed by registered employers
            for recruitment purposes. By using the platform, candidates consent
            to such visibility.
          </Text>

          <Text style={styles.heading}>Use of Candidate Information</Text>
          <Text style={styles.text}>
            Candidate data is used only for job-related and platform-related
            purposes. Hirelinkinfo.com does not sell or rent candidate personal
            information to unauthorized third parties.
          </Text>

          <Text style={styles.heading}>Data Sharing</Text>
          <Text style={styles.text}>
            Candidate information may be shared only in the following cases:
          </Text>

          <Text style={styles.bullet}>
            • With employers for recruitment and hiring purposes
          </Text>
          <Text style={styles.bullet}>
            • With payment gateways for processing transactions (if applicable)
          </Text>
          <Text style={styles.bullet}>
            • With legal authorities when required by law
          </Text>
          <Text style={styles.bullet}>
            • With trusted service providers under confidentiality obligations
          </Text>

          <Text style={styles.heading}>Data Security</Text>
          <Text style={styles.text}>
            Hirelinkinfo.com takes reasonable measures to protect candidate data
            from unauthorized access, misuse, loss, or alteration. However,
            absolute security cannot be guaranteed over the internet.
          </Text>

          <Text style={styles.heading}>Data Retention</Text>
          <Text style={styles.text}>
            Candidate information will be retained as long as the candidate
            account remains active or as required by applicable laws.
          </Text>

          <Text style={styles.heading}>Candidate Account Responsibility</Text>
          <Text style={styles.text}>
            Candidates are responsible for maintaining the confidentiality of
            their login credentials. Any activity performed through the
            candidate account will be the responsibility of the candidate.
          </Text>

          <Text style={styles.heading}>Third-Party Links</Text>
          <Text style={styles.text}>
            Hirelinkinfo.com may contain links to third-party websites. The
            platform is not responsible for the privacy practices or content of
            such external sites.
          </Text>

          <Text style={styles.heading}>Account Suspension or Termination</Text>
          <Text style={styles.text}>
            Candidate accounts may be suspended or terminated if false
            information, misuse of the platform, or violation of Terms &
            Conditions is detected. No refund will be provided in such cases.
          </Text>

          <Text style={styles.heading}>No Job Guarantee</Text>
          <Text style={styles.text}>
            Hirelinkinfo.com does not guarantee job placement, interview calls,
            or employment.
          </Text>

          <Text style={styles.heading}>Policy Updates</Text>
          <Text style={styles.text}>
            Hirelinkinfo.com reserves the right to update or modify this
            Candidate Privacy Policy at any time. Changes will be effective
            immediately upon publication.
          </Text>

          <Text style={styles.heading}>Consent</Text>
          <Text style={styles.text}>
            By registering and using Hirelinkinfo.com, candidates consent to the
            collection, use, and sharing of their information as described in
            this policy.
          </Text>

          <Text style={styles.heading}>Contact Information</Text>
          <Text style={styles.text}>
            For any privacy-related questions or concerns, candidates can
            contact Hirelinkinfo.com through the official support channels
            available on the website.
          </Text>

          <Text style={styles.footer}>
            © {new Date().getFullYear()} All Rights Reserved
          </Text>
          
          <Footer navigation={navigation} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },

  // ✅ Watermark logo background
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: 250,
    opacity: 0.5, // ✅ watermark effect
    zIndex: 0,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
    zIndex: 1,
  },

  title: {
    textAlign: 'center',
    color: '#111827',
    marginBottom: 18,
    fontSize: 24,
    fontWeight: '900',
  },

  heading: {
    marginTop: 18,
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },

  text: {
    color: '#000',
    lineHeight: 22,
    fontSize: 14,
    marginTop: 8,
  },

  bullet: {
    color: '#000',
    fontSize: 14,
    marginTop: 6,
    marginLeft: 8,
    lineHeight: 20,
  },

  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 13,
    color: '#111827',
    fontWeight: '700',
  },
});
