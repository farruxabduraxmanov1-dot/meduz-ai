// Doctors list with filters
import { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import {
  ScreenHeader,
  Card,
  RatingStars,
  ChipsRow,
  Tag,
  MaterialCommunityIcons,
  Ionicons,
} from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { DOCTORS, SPECIALTIES } from "@/src/data/demo";

type Filter = "all" | "online" | "offline" | "home";

export default function DoctorsList() {
  const router = useRouter();
  const { language } = useAppState();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState<string>("all");
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => {
    return DOCTORS.filter((d) => {
      if (query && !`${d.name} ${d.specialty}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (specialty !== "all" && d.specialty !== specialty) return false;
      if (filter === "online" && !d.online) return false;
      if (filter === "offline" && !d.offline) return false;
      if (filter === "home" && !d.homeVisit) return false;
      return true;
    });
  }, [query, specialty, filter]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "doctors")} back testID="doctors-header" />
      <View style={{ paddingHorizontal: SPACING.xl, paddingBottom: SPACING.sm }}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={COLORS.text.tertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={tr(language, "search") + " ..."}
            placeholderTextColor={COLORS.text.tertiary}
            style={styles.search}
            testID="doctors-search"
          />
        </View>
      </View>

      <ChipsRow
        items={[
          { value: "all", label: "All", icon: "filter-variant" },
          { value: "online", label: tr(language, "online"), icon: "video" },
          { value: "offline", label: tr(language, "offline"), icon: "hospital-building" },
          { value: "home", label: tr(language, "homeVisit"), icon: "home-heart" },
        ]}
        selected={filter}
        onSelect={(v) => setFilter(v as Filter)}
        testID="doctor-filter-row"
      />

      <View style={{ height: 48 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: 8, alignItems: "center" }}>
          {["all", ...SPECIALTIES].map((s) => {
            const active = s === specialty;
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setSpecialty(s)}
                activeOpacity={0.85}
                style={[styles.specChip, active && { backgroundColor: COLORS.text.primary }]}
                testID={`spec-${s}`}
              >
                <Text style={[styles.specChipText, active && { color: "#fff" }]}>
                  {s === "all" ? "All specialties" : s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={list}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md, paddingTop: SPACING.sm }}
        renderItem={({ item: d }) => (
          <Card onPress={() => router.push(`/(patient)/doctor/${d.id}` as any)} testID={`doctor-card-${d.id}`} style={{ flexDirection: "row", padding: SPACING.md }}>
            <Image source={{ uri: d.photo }} style={styles.docImg} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text style={styles.docName} numberOfLines={1}>{d.name}</Text>
                {d.featured && <Tag label={tr(language, "premium")} icon="crown" color="#fff" background="#7C3AED" />}
              </View>
              <Text style={styles.docSpec}>{d.specialty} · {d.city}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <RatingStars rating={d.rating} count={d.reviewsCount} />
                <Text style={styles.dot}>·</Text>
                <Text style={styles.exp}>{d.yearsExp} {tr(language, "yearsExp")}</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 6, gap: 6, flexWrap: "wrap" }}>
                {d.online && <Tag label={tr(language, "online")} icon="video" color={COLORS.success} background="rgba(16,185,129,0.12)" />}
                {d.homeVisit && <Tag label={tr(language, "homeVisit")} icon="home" color={COLORS.warning} background="rgba(245,158,11,0.12)" />}
                <Tag label={`${d.distanceKm} km`} icon="map-marker" color={COLORS.text.secondary} background="rgba(15,23,42,0.06)" />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8, alignItems: "center" }}>
                <Text style={styles.price}>{d.price} 000 UZS</Text>
                <TouchableOpacity
                  style={styles.bookSmall}
                  onPress={() => router.push(`/(patient)/booking/${d.id}` as any)}
                  testID={`book-doctor-${d.id}`}
                >
                  <Text style={styles.bookSmallText}>{tr(language, "book")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", padding: SPACING.xxxl }}>
            <MaterialCommunityIcons name="account-search-outline" size={48} color={COLORS.text.tertiary} />
            <Text style={{ color: COLORS.text.tertiary, marginTop: SPACING.md }}>No doctors found</Text>
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
  specChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, flexShrink: 0 },
  specChipText: { fontSize: 12, fontWeight: "600", color: COLORS.text.secondary },
  docImg: { width: 80, height: 100, borderRadius: RADIUS.md },
  docName: { fontSize: 15, fontWeight: "700", color: COLORS.text.primary, flex: 1, marginRight: 6 },
  docSpec: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  dot: { color: COLORS.text.tertiary, marginHorizontal: 6 },
  exp: { fontSize: 11, color: COLORS.text.tertiary },
  price: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  viewPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.pill, backgroundColor: "rgba(37,99,235,0.10)" },
  viewPillText: { color: COLORS.primary, fontSize: 11, fontWeight: "700", marginRight: 2 },
});
