import React, { useEffect, useMemo, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
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
import { BASE_URL } from '../config/constants';

export default function Company({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [showList, setShowList] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [popularCompanies, setPopularCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);

      // ✅ API
      const url = `${BASE_URL}admin/getdata/tbl_employer`;
      const res = await axios.get(url);

      if (res?.data?.data) {
        setCompanies(res.data.data);
        setPopularCompanies(res.data.data.slice(0, 4));
      }
    } catch (err) {
      console.log('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    if (!searchText.trim()) return [];
    return companies.filter(c =>
      (c.emp_companyname || '')
        .toLowerCase()
        .includes(searchText.trim().toLowerCase()),
    );
  }, [searchText, companies]);

  const handleSelectCompany = companyName => {
    setSearchText(companyName);
    setShowList(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading companies...</Text>
      </View>
    );
  }

  return (
    <>
     <Header navigation={navigation} />
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.mainTitle}>Find great places to work</Text>
      <Text style={styles.subText}>Get access to companies profile</Text>

      {/* SEARCH */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Company name or job title"
            placeholderTextColor="#9ca3af"
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              setShowList(text.length > 0);
            }}
            onFocus={() => {
              if (searchText.length > 0) setShowList(true);
            }}
            onBlur={() => {
              // ✅ blur झाल्यावर hide
              setTimeout(() => setShowList(false), 200);
            }}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.findBtn}>
          <Text style={styles.findBtnText}>Find</Text>
        </TouchableOpacity>
      </View>

      {/* DROPDOWN LIST */}
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
                <Text style={styles.dropdownText}>{item.emp_companyname}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* POPULAR COMPANIES */}
      <Text style={styles.popularTitle}>Popular Companies</Text>

      <FlatList
        data={popularCompanies}
        keyExtractor={(item, index) => String(index)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          const logoUrl = item.emp_com_logo
            ? `${BASE_URL}Uploads/${item.emp_com_logo}`
            : 'https://via.placeholder.com/100';

          return (
            <TouchableOpacity style={styles.companyCard}>
              <Image source={{ uri: logoUrl }} style={styles.logoImg} />

              <Text style={styles.companyName} numberOfLines={1}>
                {item.emp_companyname}
              </Text>

              <Text style={styles.smallText}></Text>
            </TouchableOpacity>
          );
        }}
      />
      <Footer navigation={navigation} /> 
    </View>
    
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginTop: 10,
  },

  subText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 14,
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },

  searchBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#bcbcbc',
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },

  searchInput: {
    fontSize: 15,
    color: '#000',
  },

  findBtn: {
    backgroundColor: '#00b341',
    height: 48,
    borderRadius: 999,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  findBtnText: {
    color: '#fff',
    fontWeight: '800',
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 10,
    maxHeight: 250,
    overflow: 'hidden',
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  dropdownText: {
    color: '#111827',
    fontWeight: '600',
  },

  popularTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 12,
    color: '#111827',
  },

  companyCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: 12,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoImg: {
    width: 120,
    height: 80,
    borderRadius: 16,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  companyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  smallText: {
    marginTop: 6,
    fontSize: 12,
    color: '#777',
  },
});
