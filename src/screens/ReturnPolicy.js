import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Header from './Header';
import Footer from './Footer';

export default function ReturnPolicy({ navigation }) {
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
          <Text style={styles.title}>Return Policy</Text>

          <Text style={styles.heading}>Applicability</Text>
          <Text style={styles.text}>
            This Return & Refund Policy applies only to candidates (job seekers)
            who register and use Hirelinkinfo.com for job search, profile
            creation, job applications, and related career services.
          </Text>

          <Text style={styles.heading}>Candidate Signup Fee</Text>
          <Text style={styles.text}>
            Candidates are required to pay a one-time signup/registration fee of
            ₹300 to create an account and access candidate-related services on
            Hirelinkinfo.com.
          </Text>

          <Text style={styles.heading}>Nature of Services</Text>
          <Text style={styles.text}>
            All services provided to candidates are digital in nature, including
            online profile creation, job applications, and access to job-related
            features.
          </Text>

          <Text style={styles.heading}>No Return Policy</Text>
          <Text style={styles.text}>
            Since Hirelinkinfo.com provides only digital services and no
            physical products to candidates, returns are not applicable.
          </Text>

          <Text style={styles.heading}>Non-Refundable Signup Fee</Text>
          <Text style={styles.text}>
            The candidate signup fee of ₹300 is non-refundable once the account
            is created and access to the platform is provided.
          </Text>

          <Text style={styles.heading}>Service Activation</Text>
          <Text style={styles.text}>
            Candidate services are activated immediately or shortly after
            successful payment. Once activated, candidates are not eligible for
            any return or refund.
          </Text>

          <Text style={styles.heading}>
            Optional Paid Services (If Applicable)
          </Text>
          <Text style={styles.text}>
            If Hirelinkinfo.com offers additional paid services to candidates in
            the future (such as premium features, profile highlighting, resume
            services, or training programs), the payment terms will be clearly
            mentioned at the time of purchase.
          </Text>

          <Text style={styles.heading}>Non-Refundable Paid Services</Text>
          <Text style={styles.text}>
            Any payment made by a candidate for optional paid services is
            non-refundable once the service is activated or delivered.
          </Text>

          <Text style={styles.heading}>Exceptional Refund Cases</Text>
          <Text style={styles.text}>
            Refunds may be considered only in exceptional situations such as:
          </Text>

          <Text style={styles.bullet}>
            • Duplicate payment made due to a technical error
          </Text>
          <Text style={styles.bullet}>
            • Payment deducted but the candidate account or paid service was not
            activated due to system failure
          </Text>

          <Text style={styles.heading}>Refund Request Timeline</Text>
          <Text style={styles.text}>
            Any refund request under exceptional circumstances must be raised
            within 7 working days from the date of payment along with valid
            transaction proof.
          </Text>

          <Text style={styles.heading}>Refund Processing Time</Text>
          <Text style={styles.text}>
            Approved refunds, if any, will be processed to the original payment
            method within 7 to 10 working days.
          </Text>

          <Text style={styles.heading}>No Job Guarantee</Text>
          <Text style={styles.text}>
            Hirelinkinfo.com does not guarantee job placement, interview calls,
            or employment. The signup fee and any other payments are for
            platform access and services only.
          </Text>

          <Text style={styles.heading}>Violation & Misuse</Text>
          <Text style={styles.text}>
            No refund will be provided if a candidate account is suspended or
            terminated due to violation of platform rules, terms & conditions,
            or misuse of services.
          </Text>

          <Text style={styles.heading}>Policy Modification Rights</Text>
          <Text style={styles.text}>
            Hirelinkinfo.com reserves the right to modify, update, or change
            this Candidate Return & Refund Policy at any time without prior
            notice. Updates will be effective immediately upon posting on the
            website.
          </Text>

          <Text style={styles.heading}>Contact Support</Text>
          <Text style={styles.text}>
            For any questions or refund-related queries, candidates can contact
            Hirelinkinfo.com through the official support channels available on
            the website.
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

  // ✅ watermark logo background
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: 250,
    opacity: 0.5,
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
