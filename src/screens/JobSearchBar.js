import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function JobSearchBar({
  jobs = [],
  searchKeyword,
  setSearchKeyword,
  searchPlace,
  setSearchPlace,
  appliedKeyword,
  setAppliedKeyword,
  appliedPlace,
  setAppliedPlace,
  onSearch,
}) {
  const [keywordSug, setKeywordSug] = useState([]);
  const [placeSug, setPlaceSug] = useState([]);
  const [showKeywordSug, setShowKeywordSug] = useState(false);
  const [showPlaceSug, setShowPlaceSug] = useState(false);

  /* ================= KEYWORD SUGGESTIONS ================= */
  useEffect(() => {
    if (!searchKeyword?.trim()) {
      setKeywordSug([]);
      setShowKeywordSug(false);
      return;
    }

    if (searchKeyword === appliedKeyword) {
      setShowKeywordSug(false);
      return;
    }

    const keyword = searchKeyword.toLowerCase();
    let suggestions = [];

    jobs.forEach(job => {
      // ✅ Skills
      if (job?.job_skills) {
        job.job_skills
          .split(',')
          .map(s => s.trim())
          .forEach(skill => {
            if (skill.toLowerCase().startsWith(keyword)) {
              suggestions.push({ text: skill, type: 'Skill' });
            }
          });
      }

      // ✅ Titles / Company / Categories
      [
        { value: job?.job_title, type: 'Job Title' },
        { value: job?.job_company, type: 'Company' },

        { value: job?.main_category, type: 'Category' },
        { value: job?.sub_category, type: 'Sub Category' },
        { value: job?.sub_category1, type: 'Category' },
        { value: job?.sub_category2, type: 'Category' },
        { value: job?.sub_category3, type: 'Category' },
      ].forEach(item => {
        if (item.value?.toLowerCase().startsWith(keyword)) {
          suggestions.push({ text: item.value, type: item.type });
        }
      });
    });

    // ✅ Remove duplicates
    const unique = suggestions.filter(
      (v, i, a) => a.findIndex(t => t.text === v.text) === i,
    );

    setKeywordSug(unique.slice(0, 8));
    setShowKeywordSug(true);
  }, [searchKeyword, appliedKeyword, jobs]);

  /* ================= PLACE SUGGESTIONS ================= */
  useEffect(() => {
    if (!searchPlace?.trim()) {
      setPlaceSug([]);
      setShowPlaceSug(false);
      return;
    }

    const place = searchPlace.toLowerCase();

    const suggestions = jobs
      .filter(
        j =>
          j?.city_name?.toLowerCase().includes(place) ||
          j?.state_name?.toLowerCase().includes(place),
      )
      .map(j => `${j.city_name}, ${j.state_name}`)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 6);

    setPlaceSug(suggestions);
    setShowPlaceSug(true);
  }, [searchPlace, jobs]);

  return (
    <View style={styles.wrapper}>
      {/* KEYWORD */}
      <View style={styles.block}>
        <Text style={styles.label}>Job Title / Skill</Text>

        <View style={styles.inputBox}>
          <Text style={styles.icon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Job Title, Company"
            placeholderTextColor="#000"
            value={searchKeyword}
            onChangeText={text => {
              setSearchKeyword(text);
              setAppliedKeyword('');
            }}
            onFocus={() => searchKeyword && setShowKeywordSug(true)}
          />
        </View>

        {showKeywordSug && keywordSug.length > 0 && (
          <View style={styles.suggestBox}>
            <FlatList
              data={keywordSug}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestItem}
                  onPress={() => {
                    setSearchKeyword(item.text);
                    setAppliedKeyword(item.text);
                    setShowKeywordSug(false);
                  }}
                >
                  <Text style={styles.suggestText}>{item.text}</Text>
                  <Text style={styles.suggestType}>({item.type})</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* LOCATION */}
      <View style={styles.block}>
        <Text style={styles.label}>Location</Text>

        <View style={styles.inputBox}>
          <Text style={styles.icon}>📍</Text>
          <TextInput
            style={styles.input}
            placeholder="City, State"
            placeholderTextColor="#000"
            value={searchPlace}
            onChangeText={text => {
              setSearchPlace(text);
              setAppliedPlace('');
            }}
            onFocus={() => searchPlace && setShowPlaceSug(true)}
          />
        </View>

        {showPlaceSug && placeSug.length > 0 && (
          <View style={styles.suggestBox}>
            <FlatList
              data={placeSug}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestItem}
                  onPress={() => {
                    setSearchPlace(item);
                    setAppliedPlace(item);
                    setShowPlaceSug(false);
                  }}
                >
                  <Text style={styles.suggestText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.findBtn} onPress={onSearch}>
        <Text style={styles.findBtnText}>Find Jobs</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    elevation: 0,
    marginBottom: 18,
  },

  block: {
    marginBottom: 10,
    position: 'relative',
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bcbcbc',
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: '#fff',
  },

  icon: {
    marginRight: 8,
    fontSize: 16,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#111',
  },

  suggestBox: {
    backgroundColor: '#dfdcdc',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 220,
    overflow: 'hidden',
  },

  suggestItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  suggestText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    flex: 1,
  },

  suggestType: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 10,
  },

  findBtn: {
    backgroundColor: '#00b341',
    height: 48,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  findBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
