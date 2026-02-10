import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../config/colors';

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

  /* ================= KEYWORD SUGGEST ================= */
  useEffect(() => {
    if (!searchKeyword.trim() || searchKeyword === appliedKeyword) {
      setKeywordSug([]);
      return;
    }

    const keyword = searchKeyword.toLowerCase();
    let suggestions = [];

    jobs.forEach(job => {
      if (job.job_skills) {
        job.job_skills.split(',').forEach(skill => {
          if (skill.trim().toLowerCase().startsWith(keyword)) {
            suggestions.push({ text: skill.trim(), type: 'Skill' });
          }
        });
      }

      [
        job.job_title,
        job.job_company,
        job.main_category,
        job.sub_category,
        job.sub_category1,
        job.sub_category2,
        job.sub_category3,
      ].forEach(val => {
        if (val?.toLowerCase().startsWith(keyword)) {
          suggestions.push({ text: val, type: 'Match' });
        }
      });
    });

    const unique = suggestions.filter(
      (v, i, a) => a.findIndex(t => t.text === v.text) === i,
    );

    setKeywordSug(unique.slice(0, 8));
  }, [searchKeyword, appliedKeyword, jobs]);

  /* ================= PLACE SUGGEST ================= */
  useEffect(() => {
    if (!searchPlace.trim()) {
      setPlaceSug([]);
      return;
    }

    const place = searchPlace.toLowerCase();

    const suggestions = jobs
      .filter(
        j =>
          j.city_name?.toLowerCase().includes(place) ||
          j.state_name?.toLowerCase().includes(place),
      )
      .map(j => `${j.city_name}, ${j.state_name}`)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 6);

    setPlaceSug(suggestions);
  }, [searchPlace, jobs]);

  return (
    <View style={styles.wrapper}>
      {/* KEYWORD */}
      <TextInput
        style={styles.input}
        placeholder="Job title, skills, company"
        placeholderTextColor={'#000000'}
        value={searchKeyword}
        onChangeText={t => {
          setSearchKeyword(t);
          setAppliedKeyword('');
        }}
      />

      {keywordSug.length > 0 && (
        <View style={styles.suggestBox}>
          <FlatList
            data={keywordSug}
            keyExtractor={(i, idx) => idx.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestItem}
                onPress={() => {
                  setSearchKeyword(item.text);
                  setAppliedKeyword(item.text);
                  setKeywordSug([]);
                }}
              >
                <Text style={styles.suggestText}>{item.text}</Text>
                <Text style={styles.suggestType}>{item.type}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* LOCATION */}
      <TextInput
        style={styles.input}
        placeholder="City or state"
        placeholderTextColor={'#000000'}
        value={searchPlace}
        onChangeText={t => {
          setSearchPlace(t);
          setAppliedPlace('');
        }}
      />

      {placeSug.length > 0 && (
        <View style={styles.suggestBox}>
          {placeSug.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={styles.suggestItem}
              onPress={() => {
                setSearchPlace(p);
                setAppliedPlace(p);
                setPlaceSug([]);
              }}
            >
              <Text style={styles.suggestText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
        <Text style={styles.searchText}>Search jobs</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  suggestBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxHeight: 220,
  },
  suggestItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  suggestText: {
    fontWeight: '700',
    color: '#111',
  },
  suggestType: {
    fontSize: 12,
    color: '#6b7280',
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },
});
