import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Help({ navigation }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'What is Hirelinkinfo.com?',
      a: 'Hirelinkinfo.com is an online job portal platform that helps candidates search for jobs, create profiles, and apply for job opportunities posted by employers.',
    },
    {
      q: 'Who can register as a candidate?',
      a: 'Any individual who is looking for a job, internship, or career opportunity can register as a candidate on Hirelinkinfo.com.',
    },
    {
      q: 'Is there a signup fee for candidates?',
      a: 'Yes, candidates are required to pay a one-time signup/registration fee of ₹300 to create an account and access candidate services.',
    },
    {
      q: 'Is the ₹300 signup fee refundable?',
      a: 'No. The candidate signup fee of ₹300 is non-refundable once the account is created and access to the platform is provided.',
    },
    {
      q: 'What services do candidates get after signup?',
      a: 'After signup, candidates can create a profile, search jobs, apply for available job openings, and access other candidate-related features provided on the platform.',
    },
    {
      q: 'Does Hirelinkinfo.com guarantee a job or interview?',
      a: 'No. Hirelinkinfo.com does not guarantee job placement, interview calls, or employment. The platform only connects candidates with employers.',
    },
    {
      q: 'Can I cancel my candidate account and get a refund?',
      a: 'No. Once the account is activated, cancellation of the account does not result in any refund.',
    },
    {
      q: 'Are there any additional charges for candidates?',
      a: 'Currently, only the signup fee applies. If any optional paid services are introduced in the future, the details and charges will be clearly communicated before purchase.',
    },
    {
      q: 'What happens if my payment is deducted but my account is not activated?',
      a: 'In case of payment deduction without account activation due to a technical issue, candidates can contact support within 7 working days with payment proof.',
    },
    {
      q: 'How long does it take to process a refund in exceptional cases?',
      a: 'If a refund is approved due to a technical or duplicate payment issue, it will be processed within 7 to 10 working days to the original payment method.',
    },
    {
      q: 'Is my personal information safe on the platform?',
      a: 'Yes. Hirelinkinfo.com follows reasonable security practices to protect user data and privacy.',
    },
    {
      q: 'Can employers directly contact candidates?',
      a: 'Employers may contact candidates based on job applications or profile visibility, as per the platform’s rules and privacy settings.',
    },
    {
      q: 'What if I face issues while using the platform?',
      a: 'Candidates can contact the support team through the official support options available on Hirelinkinfo.com.',
    },
    {
      q: 'Can my account be suspended?',
      a: 'Yes. Candidate accounts may be suspended or terminated if there is misuse of the platform, false information, or violation of Terms & Conditions.',
    },
    {
      q: 'Can Hirelinkinfo.com change rules or fees in the future?',
      a: 'Yes. Hirelinkinfo.com reserves the right to modify policies, features, or fees at any time. Updated information will be published on the platform.',
    },
  ];

  const toggle = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header navigation={navigation} />
      <ScrollView
        style={styles.page}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* TITLE */}
        <Text style={styles.title}>Help</Text>

        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <View key={index} style={styles.box}>
              <TouchableOpacity
                style={styles.questionRow}
                onPress={() => toggle(index)}
                activeOpacity={0.8}
              >
                <Text style={styles.icon}>❓</Text>

                <Text style={styles.question} numberOfLines={2}>
                  {item.q}
                </Text>

                <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.answerBox}>
                  <Text style={styles.answer}>{item.a}</Text>
                </View>
              )}
            </View>
          );
        })}
        <Footer navigation={navigation} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 18,
    marginTop: 10,
  },

  box: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  icon: {
    fontSize: 18,
  },

  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#333331',
  },

  arrow: {
    fontSize: 14,
    fontWeight: '900',
    color: '#16a34a',
  },

  answerBox: {
    marginTop: 10,
    paddingLeft: 28,
  },

  answer: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 20,
  },
});
