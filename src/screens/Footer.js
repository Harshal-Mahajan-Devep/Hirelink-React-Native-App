import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

export default function Footer({ navigation }) {
  return (
    <View style={styles.footer}>
      {/* LINKS */}
      <View style={styles.linksWrap}>
        <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
          <Text style={styles.link}>Jobs</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Company')}>
          <Text style={styles.link}>Companies</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Text style={styles.link}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Help')}>
          <Text style={styles.link}>Help</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
          <Text style={styles.link}>Terms & Condition</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ReturnPolicy')}>
          <Text style={styles.link}>Return Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('PrivacyPolicies')}
        >
          <Text style={styles.link}>Privacy & Policies</Text>
        </TouchableOpacity>
      </View>

      {/* COPYRIGHT */}
      <Text style={styles.copy}>
        All rights reserved © 2026 Hirelink Infotech Pvt Ltd {""} Design By {' '}
        <Text
          style={styles.brandLink}
          onPress={() => Linking.openURL('https://www.esenceweb.com/')}
        >
          Ensenceweb IT
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#000',
    padding: 20,
    marginTop: 50,
    marginBottom: -20,
    marginEnd: -15,
    marginStart: -15,
  },

  linksWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },

  link: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 6,
    marginVertical: 6,
  },

  copy: {
    marginTop: 18,
    color: '#7c7c7c',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  brandLink: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
