// Medical Organizations list
import { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Card, RatingStars, ChipsRow, Tag, ScreenHeader, MaterialCommunityIcons, Ionicons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { ORGANIZATIONS, CITIES } from "@/src/data/demo";

type Tab = "all" | "private" | "public" | "specialized" | "polyclinic";

export default function OrganizationsList() {
  const router = useRouter();
  const { language } = useAppState();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [city, setCity] = useState<string>("all");

  const list = useMemo(() => {
    return ORGANIZATIONS.filter((o) => {
      if (query && !o.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (tab === "private" && o.ownership !== "private") return false;
      if (tab === "public" && o.ownership !== "public") return false;
      if (tab === "specialized" && o.type !== "Specialized Center") return false;
      if (tab === "polyclinic" && o.type !== "Polyclinic" && o.type !== "Family Medicine Center") return false;
      if (city !== "all" && o.city !== city) return false;
      return true;
    });
  }, [query, tab, city]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "organizations")} back />
      <View style={{ paddingHorizontal: SPACING.xl, paddingBottom: SPACING.sm }}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={COLORS.text.tertiary} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search clinics & hospitals" placeholderTextColor={COLORS.text.tertiary} style={styles.search} testID="org-search" />
        </View>
      </View>
      <ChipsRow
        items={[
          { value: "all", label: "All", icon: "view-grid" },
          { value: "private", label: "Private", icon: "office-building" },
          { value: "public", label: "Public", icon: "hospital-building" },
          { value: "specialized", label: "Specialized", icon: "doctor" },
          { value: "polyclinic", label: "Polyclinic", icon: "home-city" },
        ]}
        selected={tab}
        onSelect={(v) => setTab(v as Tab)}
        testID="org-filter-row"
      />
      <View style={{ height: 48 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: 8, alignItems: "center" }}>
          {["all", ...CITIES].map((c) => {
            const active = c === city;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setCity(c)}
                style={[styles.cityChip, active && { backgroundColor: COLORS.text.primary }]}
                testID={`city-${c}`}
              >
                <Text style={[styles.cityChipText, active && { color: "#fff" }]}>{c === "all" ? "All cities" : c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={list}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}
        renderItem={({ item: o }) => (
          <Card onPress={() => router.push(`/(patient)/organization/${o.id}` as any)} testID={`org-card-${o.id}`}>
            <Image source={{ uri: o.hero }} style={styles.orgHero} />
            <View style={{ padding: SPACING.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.orgName} numberOfLines={1}>{o.name}</Text>
                {o.featured && <Tag label="TOP" icon="crown" color="#fff" background="#7C3AED" />}
              </View>
              <Text style={styles.orgType}>{o.type} · {o.city}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, justifyContent: "space-between" }}>
                <RatingStars rating={o.rating} count={o.reviewsCount} />
                <Text style={styles.dist}>{o.distanceKm} km · {o.doctorsCount} doctors</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {o.departments.slice(0, 3).map((d) => (
                  <Tag key={d} label={d} color={COLORS.primary} background="rgba(37,99,235,0.08)" />
                ))}
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", padding: SPACING.xxxl }}>
            <Text style={{ color: COLORS.text.tertiary }}>No organizations found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchWrap: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, height: 48, ...SHADOW.card },
  search: { flex: 1, marginLeft: SPACING.sm, fontSize: 14, color: COLORS.text.primary },
  cityChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, flexShrink: 0 },
  cityChipText: { fontSize: 12, fontWeight: "600", color: COLORS.text.secondary },
  orgHero: { width: "100%", height: 140 },
  orgName: { fontSize: 16, fontWeight: "700", color: COLORS.text.primary, flex: 1, marginRight: 6 },
  orgType: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  dist: { fontSize: 11, color: COLORS.text.tertiary },
});
