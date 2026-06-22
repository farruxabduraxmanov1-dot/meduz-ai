// Medical Services list
import { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Card, RatingStars, Tag, ScreenHeader, ChipsRow, MaterialCommunityIcons, Ionicons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { MEDICAL_SERVICES } from "@/src/data/demo";

const TYPES = Array.from(new Set(MEDICAL_SERVICES.map((s) => s.serviceType)));

export default function ServicesList() {
  const router = useRouter();
  const { language } = useAppState();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");

  const list = useMemo(
    () =>
      MEDICAL_SERVICES.filter((s) => {
        if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
        if (type !== "all" && s.serviceType !== type) return false;
        return true;
      }),
    [query, type],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "medicalServices")} back />
      <View style={{ paddingHorizontal: SPACING.xl, paddingBottom: SPACING.sm }}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={COLORS.text.tertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search providers"
            placeholderTextColor={COLORS.text.tertiary}
            style={styles.search}
            testID="services-search"
          />
        </View>
      </View>
      <View style={{ height: 56, justifyContent: "center" }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: 8, alignItems: "center" }}>
          {["all", ...TYPES].map((t) => {
            const active = t === type;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setType(t)}
                style={[styles.chip, active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
                testID={`svc-type-${t}`}
              >
                <Text style={[styles.chipText, active && { color: "#fff" }]}>{t === "all" ? "All" : t}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={list}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}
        renderItem={({ item: s }) => (
          <Card style={{ flexDirection: "row", padding: SPACING.md }} onPress={() => router.push(`/(patient)/service/${s.id}` as any)} testID={`service-${s.id}`}>
            <Image source={{ uri: s.photo }} style={styles.img} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.name}>{s.name}</Text>
                {s.featured && <Tag label="TOP" icon="crown" color="#fff" background="#7C3AED" />}
              </View>
              <Text style={styles.type}>{s.serviceType}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <RatingStars rating={s.rating} count={s.reviewsCount} />
                <Text style={styles.dot}>·</Text>
                <Text style={styles.city}>{s.city} · {s.distanceKm} km</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 6, gap: 6, alignItems: "center", justifyContent: "space-between" }}>
                <Text style={styles.price}>{s.price} 000 UZS</Text>
                {s.homeVisit && <Tag label={tr(language, "homeVisit")} icon="home" color={COLORS.warning} background="rgba(245,158,11,0.12)" />}
              </View>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchWrap: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, height: 48, ...SHADOW.card },
  search: { flex: 1, marginLeft: SPACING.sm, fontSize: 14, color: COLORS.text.primary },
  chip: { paddingHorizontal: 14, height: 36, borderRadius: 18, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  chipText: { fontSize: 12, fontWeight: "600", color: COLORS.text.secondary },
  img: { width: 80, height: 90, borderRadius: 14 },
  name: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary, flex: 1 },
  type: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  dot: { color: COLORS.text.tertiary, marginHorizontal: 6 },
  city: { fontSize: 11, color: COLORS.text.tertiary },
  price: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
});
