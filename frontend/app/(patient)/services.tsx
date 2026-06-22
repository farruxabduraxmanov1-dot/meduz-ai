// Medical Services list — Specialists / Diagnostics / Procedures
import { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Card, RatingStars, Tag, ScreenHeader, ChipsRow, MaterialCommunityIcons, Ionicons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { MEDICAL_SERVICES, DIAGNOSTICS, PROCEDURES } from "@/src/data/demo";

const TYPES = Array.from(new Set(MEDICAL_SERVICES.map((s) => s.serviceType)));

type Tab = "specialists" | "diagnostics" | "procedures";

export default function ServicesList() {
  const router = useRouter();
  const { language } = useAppState();
  const [tab, setTab] = useState<Tab>("specialists");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");

  const specialistsList = useMemo(
    () =>
      MEDICAL_SERVICES.filter((s) => {
        if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
        if (type !== "all" && s.serviceType !== type) return false;
        return true;
      }),
    [query, type],
  );

  const diagnosticsList = useMemo(
    () => DIAGNOSTICS.filter((d) => !query || d.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const proceduresList = useMemo(
    () => PROCEDURES.filter((p) => !query || p.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "medicalServices")} back />
      <View style={{ paddingHorizontal: SPACING.xl, paddingBottom: SPACING.sm }}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={COLORS.text.tertiary} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Qidiruv (MRI, EKG, hamshira…)" placeholderTextColor={COLORS.text.tertiary} style={styles.search} testID="services-search" />
        </View>
      </View>
      <ChipsRow
        items={[
          { value: "specialists", label: "Mutaxassislar", icon: "account-tie" },
          { value: "diagnostics", label: "Diagnostika", icon: "stethoscope" },
          { value: "procedures", label: "Muolajalar", icon: "needle" },
        ]}
        selected={tab}
        onSelect={(v) => setTab(v as Tab)}
        testID="services-categories"
      />

      {tab === "specialists" && (
        <>
          <View style={{ height: 48 }}>
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
                    <Text style={[styles.chipText, active && { color: "#fff" }]}>{t === "all" ? "Barchasi" : t}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <FlatList
            data={specialistsList}
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
                  <View style={{ flexDirection: "row", marginTop: 6, alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={styles.price}>{s.price} 000 UZS</Text>
                    {s.homeVisit && <Tag label={tr(language, "homeVisit")} icon="home" color={COLORS.warning} background="rgba(245,158,11,0.12)" />}
                  </View>
                </View>
              </Card>
            )}
          />
        </>
      )}

      {tab === "diagnostics" && (
        <FlatList
          data={diagnosticsList}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}
          renderItem={({ item: d }) => (
            <Card style={{ padding: SPACING.md }} testID={`diagnostic-${d.id}`}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={[styles.diagIcon, { backgroundColor: "rgba(37,99,235,0.10)" }]}>
                  <MaterialCommunityIcons name={d.icon as any} size={24} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.name}>{d.name}</Text>
                    <Tag label={d.category} color={COLORS.primary} background="rgba(37,99,235,0.08)" style={{ marginLeft: 8 }} />
                  </View>
                  <Text style={styles.diagDesc} numberOfLines={2}>{d.description}</Text>
                </View>
              </View>
              <View style={styles.diagMetaRow}>
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.text.tertiary} />
                  <Text style={styles.metaText}>{d.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MaterialCommunityIcons name="account-multiple" size={14} color={COLORS.text.tertiary} />
                  <Text style={styles.metaText}>{d.providers} markazda</Text>
                </View>
                <Text style={styles.priceBig}>{d.price} 000 UZS</Text>
              </View>
            </Card>
          )}
        />
      )}

      {tab === "procedures" && (
        <FlatList
          data={proceduresList}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}
          renderItem={({ item: p }) => (
            <Card style={{ flexDirection: "row", padding: SPACING.md, alignItems: "center" }} onPress={() => router.push("/(patient)/home-care")} testID={`procedure-${p.id}`}>
              <View style={[styles.diagIcon, { backgroundColor: "rgba(16,185,129,0.10)" }]}>
                <MaterialCommunityIcons name={p.icon as any} size={24} color={COLORS.success} />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.diagDesc} numberOfLines={2}>{p.description}</Text>
                <View style={{ flexDirection: "row", marginTop: 6, gap: 6, alignItems: "center" }}>
                  {p.homeAvailable && <Tag label={tr(language, "homeVisit")} icon="home" color={COLORS.warning} background="rgba(245,158,11,0.12)" />}
                  <Text style={styles.metaText}>{p.providers} mutaxassis</Text>
                </View>
              </View>
              <Text style={styles.price}>{p.price} 000</Text>
            </Card>
          )}
        />
      )}
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
  name: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  type: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  dot: { color: COLORS.text.tertiary, marginHorizontal: 6 },
  city: { fontSize: 11, color: COLORS.text.tertiary },
  price: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  priceBig: { fontSize: 16, fontWeight: "800", color: COLORS.primary, marginLeft: "auto" },
  diagIcon: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  diagDesc: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4, lineHeight: 17 },
  diagMetaRow: { flexDirection: "row", alignItems: "center", marginTop: SPACING.md, gap: 14, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.borderSoft },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, color: COLORS.text.tertiary },
});
