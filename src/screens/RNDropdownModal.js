import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';

export default function RNDropdownModal({
  label,
  value,
  options = [],
  labelKey = 'label',
  valueKey = 'value',
  placeholder = 'Select',
  searchable = true,
  disabled = false,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const selectedLabel = useMemo(() => {
    if (!value) return '';
    const found = options.find(x => String(x[valueKey]) === String(value));
    return found ? found[labelKey] : '';
  }, [value, options, labelKey, valueKey]);

  const filtered = useMemo(() => {
    if (!searchable) return options;
    if (!q.trim()) return options;
    return options.filter(x =>
      String(x[labelKey] || '')
        .toLowerCase()
        .includes(q.toLowerCase()),
    );
  }, [q, options, searchable, labelKey]);

  return (
    <View style={{ marginTop: 12 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* SELECT BOX */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={() => {
          setQ('');
          setOpen(true);
        }}
        style={[styles.selectBox, disabled && styles.disabled]}
      >
        <Text style={[styles.selectText, !selectedLabel && styles.placeholder]}>
          {selectedLabel || placeholder}
        </Text>
        <Text style={styles.arrow}>⌄</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={open} transparent animationType="slide">
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            {/* HEADER */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label || 'Select option'}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* SEARCH */}
            {searchable && (
              <TextInput
                placeholder="Search"
                placeholderTextColor={'#000000'}
                value={q}
                onChangeText={setQ}
                style={styles.search}
                autoFocus
              />
            )}

            {/* LIST */}
            <FlatList
              data={filtered}
              keyExtractor={(item, index) => String(item[valueKey] ?? index)}
              renderItem={({ item }) => {
                const isSelected = String(item[valueKey]) === String(value);

                return (
                  <TouchableOpacity
                    style={[styles.row, isSelected && styles.rowActive]}
                    onPress={() => {
                      onChange?.(item[valueKey]);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.rowText,
                        isSelected && styles.rowTextActive,
                      ]}
                    >
                      {item[labelKey]}
                    </Text>

                    {isSelected && <Text style={styles.tick}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.empty}>No results found</Text>
              }
              style={{ maxHeight: 420 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
    color: '#111827',
  },

  selectBox: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },

  disabled: {
    opacity: 0.5,
    backgroundColor: '#f3f4f6',
  },

  selectText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  placeholder: {
    color: '#6b7280',
    fontWeight: '600',
  },

  arrow: {
    fontSize: 16,
    fontWeight: '900',
    color: '#6b7280',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sheetTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },

  close: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },

  search: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },

  rowActive: {
    backgroundColor: '#eef3ff',
  },

  rowText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  rowTextActive: {
    color: '#2557a7',
  },

  tick: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2557a7',
  },

  empty: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#6b7280',
    fontWeight: '700',
  },
});
