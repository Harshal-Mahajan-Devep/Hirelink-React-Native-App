import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {
  View,
  Text,
  StyleSheet,
//   Image,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function AboutScreen({ navigation }) {
  const cards = [
    {
      title: '🚀 Our Mission',
      text: 'To make recruitment simple, transparent, and accessible for everyone.',
    },
    {
      title: '🎯 Our Vision',
      text: 'To become a trusted platform for job seekers and employers across industries.',
    },
    {
      title: '🤝 Our Values',
      text: 'Trust, transparency, and genuine opportunities for growth.',
    },
    {
      title: '⚡ Fast Hiring',
      text: 'We help employers reduce hiring time with smart tools and instant candidate access.',
    },
    {
      title: '🔒 Secure Platform',
      text: 'User data and job information are protected with strong security and privacy practices.',
    },
    {
      title: '🌍 Career Growth',
      text: 'We support candidates in finding meaningful jobs that help them grow professionally.',
    },
  ];

  return (
    <>
      <Header navigation={navigation} />
      <ScrollView
        style={styles.page}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* ✅ HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>About Hirelink</Text>
          <Text style={styles.heroText}>
            A smart recruitment platform connecting employers with the right
            candidates, faster and simpler.
          </Text>
        </View>

        {/* ✅ MAIN CONTAINER */}
        <View style={styles.container}>
          {/* ✅ IMAGE */}
          {/* <Image
          source={require("../assets/aboutus.png")}
          style={styles.image}
          resizeMode="cover"
        /> */}

          {/* ✅ CONTENT */}
          <View style={styles.contentBox}>
            <Text style={styles.heading}>Who We Are</Text>

            <Text style={styles.paragraph}>
              Hirelinkinfo.com is a modern job portal designed to simplify the
              hiring process. We provide a trusted digital space where employers
              can discover talent and candidates can explore genuine career
              opportunities.
            </Text>

            {/* ✅ CARDS */}
            <View style={styles.cardsWrap}>
              {cards.map((item, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ✅ EMPLOYER + CANDIDATE */}
          <View style={styles.roleGrid}>
            <View style={styles.roleCard}>
              <Text style={styles.roleTitle}>👔 For Employers</Text>
              <Text style={styles.roleText}>
                Employers can register, post job openings, manage applications,
                and connect with relevant candidates efficiently through our
                platform.
              </Text>
            </View>

            <View style={styles.roleCard}>
              <Text style={styles.roleTitle}>🧑‍💼 For Candidates</Text>
              <Text style={styles.roleText}>
                Candidates can create profiles, search jobs, and apply easily
                while exploring career opportunities across multiple industries.
              </Text>
            </View>
          </View>

          {/* ✅ WHY CHOOSE */}
          <View style={styles.whyChoose}>
            <Text style={styles.whyTitle}>Why Choose Hirelinkinfo.com?</Text>

            <Text style={styles.whyText}>
              ✔ Simple & user-friendly platform{'\n'}✔ Genuine job opportunities
              {'\n'}✔ Secure data handling{'\n'}✔ Dedicated support for
              employers and candidates
            </Text>
          </View>
        </View>
        <Footer navigation={navigation} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },

  /* ✅ HERO */
  hero: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#59bb3b',
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },

  heroText: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.95,
    textAlign: 'center',
    maxWidth: 800,
    lineHeight: 22,
  },

  /* ✅ MAIN CONTAINER */
  container: {
    paddingHorizontal: 16,
    paddingTop: 22,
  },

  //   image: {
  //     width: "100%",
  //     height: width > 900 ? 260 : 220,
  //     borderRadius: 14,
  //     marginBottom: 22,
  //   },

  contentBox: {
    flex: 1,
  },

  heading: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    color: '#111827',
  },

  paragraph: {
    color: '#555',
    fontSize: 14,
    lineHeight: 22,
  },

  /* ✅ CARDS GRID */
  cardsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 18,
    marginBottom: 24,
  },

  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2c2c2c',
    marginBottom: 6,
  },

  cardText: {
    color: '#555',
    fontSize: 13,
    lineHeight: 19,
  },

  /* ✅ ROLES */
  roleGrid: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 22,
  },

  roleCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  roleTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6,
    color: '#111827',
  },

  roleText: {
    color: '#555',
    fontSize: 13,
    lineHeight: 20,
  },

  /* ✅ WHY CHOOSE */
  whyChoose: {
    backgroundColor: '#036908',
    padding: 18,
    borderRadius: 16,
  },

  whyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },

  whyText: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.95,
  },
});
