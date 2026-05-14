import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

export default function RNDropdownModal({
  label,
  value,
  options = [],
  labelKey = "label",
  valueKey = "value",
  placeholder = "Select",
  searchable = true,
  disabled = false,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    const found = options.find((x) => String(x[valueKey]) === String(value));
    return found ? found[labelKey] : "";
  }, [value, options, labelKey, valueKey]);

  const filtered = useMemo(() => {
    if (!searchable) return options;
    if (!q.trim()) return options;
    return options.filter((x) =>
      String(x[labelKey] || "")
        .toLowerCase()
        .includes(q.toLowerCase())
    );
  }, [q, options, searchable, labelKey]);

  return (
    <View style={{ marginTop: 10 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          setQ("");
          setOpen(true);
        }}
        style={[
          styles.selectBox,
          disabled ? { opacity: 0.45 } : null,
        ]}
      >
        <Text style={styles.selectText}>
          {selectedLabel || placeholder}
        </Text>
        <Text style={styles.arrow}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || "Select"}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            {searchable && (
              <TextInput
                placeholder="Search..."
                value={q}
                onChangeText={setQ}
                style={styles.searchInput}
              />
            )}

            <FlatList
              data={filtered}
              keyExtractor={(item, index) =>
                String(item[valueKey] ?? index)
              }
              style={{ maxHeight: 380 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemRow}
                  onPress={() => {
                    onChange?.(item[valueKey]);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.itemText}>{item[labelKey]}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", padding: 14 }}>
                  No results
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "800",
    marginBottom: 6,
    color: "#111827",
  },

  selectBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  selectText: {
    color: "#111827",
    fontWeight: "700",
  },

  arrow: { fontWeight: "900", color: "#6b7280" },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 16,
  },

  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  modalTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },

  close: { fontSize: 18, fontWeight: "900" },

  searchInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },

  itemRow: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
  },

  itemText: { fontWeight: "700", color: "#111827" },
});
