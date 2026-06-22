// Pharmacies + Medicine search
import { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Card, Tag, ScreenHeader, MaterialCommunityIcons, Ionicons, ChipsRow } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { PHARMACIES, MEDICINES } from "@/src/data/demo";

type Tab = "pharmacies" | "medicines";

export default function Pharmacies() {
  const router = useRouter();
  const { language } = useAppState();
  const [tab, setTab] = useState<Tab>("pharmacies");
  const [query, setQuery] = useState("");

  const pharmacyList = useMemo(
    () => PHARMACIES.filter((p) => !query || `${p.name} ${p.address}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const medicineList = useMemo(
    () => MEDICINES.filter((m) => !query || `${m.name} ${m.generic}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "pharmacies")} back />
      <View style={{ paddingHorizontal: SPACING.xl, paddingBottom: SPACING.sm }}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={COLORS.text.tertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={tab === "medicines" ? tr(language, "medicineSearch") : "Search pharmacies"}
            placeholderTextColor={COLORS.text.tertiary}
            style={styles.search}
            testID="ph-search"
          />
        </View>
      </View>
      <ChipsRow
        items={[
          { value: "pharmacies", label: tr(language, "pharmacies"), icon: "store" },
          { value: "medicines", label: tr(language, "findMedicine"), icon: "pill" },
        ]}
        selected={tab}
        onSelect={(v) => setTab(v as Tab)}
        testID="pharmacy-tabs"
      />

      {tab === "pharmacies" ? (
        <FlatList
          data={pharmacyList}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}
          renderItem={({ item: p }) => (
            <Card style={{ flexDirection: "row", padding: SPACING.md, alignItems: "center" }} testID={`pharmacy-${p.id}`}>
              <Image source={{ uri: p.logo }} style={styles.phImg} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.phName}>{p.name}</Text>
                  <Tag label={p.open ? tr(language, "open") : "Closed"} color={p.open ? COLORS.success : COLORS.danger} background={p.open ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"} />
                </View>
                <Text style={styles.phAddr}>{p.address} · {p.city}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 12 }}>
                  <Text style={styles.hours}>{p.hours}</Text>
                  <Text style={styles.dist}>{p.distanceKm} km</Text>
                </View>
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${p.phone.replace(/\s/g, "")}`)} style={styles.callRow}>
                  <MaterialCommunityIcons name="phone" size={14} color={COLORS.primary} />
                  <Text style={styles.callText}>{p.phone}</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      ) : (
        <FlatList
          data={medicineList}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}
          renderItem={({ item: m }) => (
            <Card onPress={() => router.push(`/(patient)/medicine/${m.id}` as any)} style={{ flexDirection: "row", padding: SPACING.md }} testID={`medicine-${m.id}`}>
              <Image source={{ uri: m.image }} style={styles.medImg} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.medName}>{m.name}</Text>
                <Text style={styles.medGen}>{m.generic}</Text>
                <Text style={styles.medDesc} numberOfLines={2}>{m.description}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                  <Text style={styles.price}>{m.priceMin}–{m.priceMax} k UZS</Text>
                  <Text style={styles.available}>{tr(language, "availableAt")} {m.pharmacyIds.length} {tr(language, "pharmaciesNearby")}</Text>
                </View>
              </View>
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
  phImg: { width: 56, height: 56, borderRadius: 14 },
  phName: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary, flex: 1 },
  phAddr: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4 },
  hours: { fontSize: 11, color: COLORS.text.tertiary },
  dist: { fontSize: 11, color: COLORS.text.tertiary },
  callRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  callText: { marginLeft: 4, fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  medImg: { width: 72, height: 72, borderRadius: 12 },
  medName: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  medGen: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
  medDesc: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4 },
  price: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  available: { fontSize: 10, color: COLORS.text.tertiary, textAlign: "right" },
});
