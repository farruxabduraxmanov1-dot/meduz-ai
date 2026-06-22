// Admin: doctors management
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, ScreenHeader, GradientButton, ChipsRow, RatingStars, Tag, MaterialCommunityIcons, Ionicons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { DOCTORS } from "@/src/data/demo";

export default function AdminDoctors() {
  const { language } = useAppState();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "pending">("all");
  const list = DOCTORS.filter((d) => !query || d.name.toLowerCase().includes(query.toLowerCase())).slice(0, 12);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "manageDoctors")} back right={
        <TouchableOpacity style={styles.addBtn} testID="admin-add-doctor">
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      } />
      <View style={{ paddingHorizontal: SPACING.xl }}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={COLORS.text.tertiary} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search doctors" placeholderTextColor={COLORS.text.tertiary} style={styles.search} testID="admin-search-doctor" />
        </View>
      </View>
      <ChipsRow
        items={[
          { value: "all", label: "All", icon: "filter-variant" },
          { value: "active", label: "Active", icon: "check-circle" },
          { value: "pending", label: "Pending Link", icon: "link-variant" },
        ]}
        selected={status}
        onSelect={(v) => setStatus(v as any)}
        testID="admin-doc-tabs"
      />
      <FlatList
        data={list}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}
        renderItem={({ item: d }) => (
          <Card style={{ flexDirection: "row", padding: SPACING.md, alignItems: "center" }}>
            <Image source={{ uri: d.photo }} style={styles.docImg} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.docName}>{d.name}</Text>
              <Text style={styles.docSpec}>{d.specialty} · {d.city}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <RatingStars rating={d.rating} count={d.reviewsCount} />
              </View>
              <View style={{ flexDirection: "row", marginTop: 6, gap: 6 }}>
                <Tag label="Active" color="#fff" background={COLORS.success} />
                {d.featured && <Tag label="Featured" icon="crown" color="#fff" background="#7C3AED" />}
              </View>
            </View>
            <TouchableOpacity style={styles.menuBtn}>
              <MaterialCommunityIcons name="dots-vertical" size={20} color={COLORS.text.secondary} />
            </TouchableOpacity>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchWrap: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, height: 48, ...SHADOW.card, marginBottom: 8 },
  search: { flex: 1, marginLeft: SPACING.sm, fontSize: 14, color: COLORS.text.primary },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  docImg: { width: 56, height: 70, borderRadius: 12 },
  docName: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  docSpec: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  menuBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
});
