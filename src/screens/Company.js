import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';
import { BASE_URL } from '../config/constants';

export default function Company({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [showList, setShowList] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [popularCompanies, setPopularCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const companiesToShow =
    searchText.trim().length > 0 ? filteredCompanies : popularCompanies;

  /* ================= FETCH COMPANIES (SAME) ================= */
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}admin/getdata/tbl_employer`);

      if (res?.data?.data) {
        setCompanies(res.data.data);
        setPopularCompanies(res.data.data.slice(0, 6));
      }
    } catch (err) {
      console.log('Company API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  /* ================= FILTER (SAME) ================= */
  const filteredCompanies = useMemo(() => {
    if (!searchText.trim()) return [];
    return companies.filter(c =>
      (c.emp_companyname || '')
        .toLowerCase()
        .includes(searchText.trim().toLowerCase()),
    );
  }, [searchText, companies]);

  const handleSelectCompany = name => {
    setSearchText(name);
    setShowList(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading companies…</Text>
      </View>
    );
  }

  return (
    <>
      <Header navigation={navigation} />

      <View style={styles.container}>
        {/* ===== TITLE ===== */}
        <Text style={styles.mainTitle}>Find great places to work</Text>
        <Text style={styles.subText}>
          Discover companies and explore opportunities
        </Text>

        {/* ===== SEARCH BAR ===== */}
        <View style={styles.searchCard}>
          <TextInput
            placeholder="Search company name"
            placeholderTextColor="#9ca3af"
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              setShowList(text.length > 0);
            }}
            onFocus={() => searchText && setShowList(true)}
            onBlur={() => setTimeout(() => setShowList(false), 200)}
            style={styles.searchInput}
          />

          <TouchableOpacity style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* ===== AUTOSUGGEST ===== */}
        {showList && filteredCompanies.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={filteredCompanies.slice(0, 8)}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectCompany(item.emp_companyname)}
                >
                  <Text style={styles.dropdownText}>
                    {item.emp_companyname}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* ===== POPULAR ===== */}
        <Text style={styles.popularTitle}>Popular companies</Text>

        <FlatList
          data={companiesToShow}
          keyExtractor={(item, index) => String(index)}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            searchText ? (
              <Text style={styles.noResult}>No companies found</Text>
            ) : null
          }
          renderItem={({ item }) => {
            const logoUrl = item.emp_com_logo
              ? `${BASE_URL}Uploads/${item.emp_com_logo}`
              : 'https://via.placeholder.com/100';

            return (
              <TouchableOpacity
                style={styles.companyCard}
                onPress={() =>
                  navigation.navigate('Jobs', {
                    company: item.emp_companyname,
                  })
                }
              >
                <Image source={{ uri: logoUrl }} style={styles.logoImg} />

                <Text style={styles.companyName} numberOfLines={1}>
                  {item.emp_companyname}
                </Text>

                <Text style={styles.viewJobs}>View jobs</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <Footer navigation={navigation} />
    </>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#6b7280',
  },

  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },

  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    color: '#111827',
  },

  subText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 18,
  },

  /* SEARCH */
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 6,
  },

  searchInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    color: '#111827',
    fontSize: 14,
  },

  searchBtn: {
    backgroundColor: '#2557a7',
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: 'center',
  },

  searchBtnText: {
    color: '#fff',
    fontWeight: '800',
  },

  /* DROPDOWN */
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: 240,
    marginBottom: 14,
    overflow: 'hidden',
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  dropdownText: {
    fontWeight: '700',
    color: '#111827',
  },

  /* POPULAR */
  popularTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
    color: '#111827',
  },

  companyCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  viewJobs: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '800',
    color: '#00b341',
  },

  noResult: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
    fontWeight: '600',
  },  

  logo: {
    width: 110,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  companyName: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111827',
  },

  viewText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#2557a7',
  },
});
