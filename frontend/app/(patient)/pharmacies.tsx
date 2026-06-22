// Pharmacies + Medicine search
import { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Card, Tag, ScreenHeader, MaterialCommunityIcons, Ionicons, ChipsRow } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { PHARMACIES, MEDICINES, pharmacyHas24h, pharmacyHasDelivery, pharmacyDeliveryEta } from "@/src/data/demo";

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
          renderItem={({ item: p }) => {
            const is24h = pharmacyHas24h(p);
            const hasDelivery = pharmacyHasDelivery(p.id);
            const delivEta = pharmacyDeliveryEta(p.id);
            return (
              <Card style={{ padding: SPACING.md }} testID={`pharmacy-${p.id}`}>
                <View style={{ flexDirection: "row" }}>
                  <Image source={{ uri: p.logo }} style={styles.phImg} />
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Text style={styles.phName} numberOfLines={1}>{p.name}</Text>
                      <Tag label={p.open ? tr(language, "open") : "Closed"} color={p.open ? COLORS.success : COLORS.danger} background={p.open ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"} />
                    </View>
                    <Text style={styles.phAddr}>{p.address} · {p.city}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 8, flexWrap: "wrap" }}>
                      {is24h && <Tag label="24/7" icon="clock-time-eight" color="#fff" background="#7C3AED" />}
                      {hasDelivery && <Tag label={`Delivery ${delivEta}min`} icon="moped" color={COLORS.primary} background="rgba(37,99,235,0.10)" />}
                      <Tag label={`${p.distanceKm} km`} icon="map-marker" color={COLORS.text.secondary} background="rgba(15,23,42,0.06)" />
                    </View>
                  </View>
                </View>
                <View style={styles.phActions}>
                  <TouchableOpacity onPress={() => Linking.openURL(`tel:${p.phone.replace(/\s/g, "")}`)} style={styles.actionBtn} testID={`ph-call-${p.id}`}>
                    <MaterialCommunityIcons name="phone" size={14} color={COLORS.primary} />
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(p.address + ", " + p.city)}`)} style={styles.actionBtn} testID={`ph-route-${p.id}`}>
                    <MaterialCommunityIcons name="map-marker-radius" size={14} color={COLORS.primary} />
                    <Text style={styles.actionText}>Route</Text>
                  </TouchableOpacity>
                  {hasDelivery && (
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primary }]} testID={`ph-deliver-${p.id}`}>
                      <MaterialCommunityIcons name="moped" size={14} color="#fff" />
                      <Text style={[styles.actionText, { color: "#fff" }]}>Order</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            );
          }}
        />
      ) : (
        <FlatList
          data={medicineList}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}
          renderItem={({ item: m }) => {
            const availablePharmacies = PHARMACIES.filter((p) => m.pharmacyIds.includes(p.id));
            const has24h = availablePharmacies.some((p) => pharmacyHas24h(p));
            const hasDelivery = availablePharmacies.some((p) => pharmacyHasDelivery(p.id));
            return (
              <Card onPress={() => router.push(`/(patient)/medicine/${m.id}` as any)} style={{ padding: SPACING.md }} testID={`medicine-${m.id}`}>
                <View style={{ flexDirection: "row" }}>
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
                </View>
                <View style={{ flexDirection: "row", gap: 6, marginTop: SPACING.sm, flexWrap: "wrap" }}>
                  {has24h && <Tag label="24/7" icon="clock-time-eight" color="#fff" background="#7C3AED" />}
                  {hasDelivery && <Tag label="Delivery" icon="moped" color={COLORS.primary} background="rgba(37,99,235,0.10)" />}
                  <Tag label="Reserve" icon="bookmark-plus" color={COLORS.warning} background="rgba(245,158,11,0.12)" />
                </View>
              </Card>
            );
          }}
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
  phName: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary, flex: 1, marginRight: 8 },
  phAddr: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4 },
  hours: { fontSize: 11, color: COLORS.text.tertiary },
  dist: { fontSize: 11, color: COLORS.text.tertiary },
  dot: { color: COLORS.text.tertiary, marginHorizontal: 6, fontSize: 11 },
  phActions: { flexDirection: "row", gap: 8, marginTop: SPACING.md, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.borderSoft },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10, borderRadius: RADIUS.md, backgroundColor: "rgba(37,99,235,0.06)", gap: 4 },
  actionText: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },
  medImg: { width: 72, height: 72, borderRadius: 12 },
  medName: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  medGen: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
  medDesc: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4 },
  price: { fontSize: 13, fontWeight: "700", color: COLORS.primary },
  available: { fontSize: 10, color: COLORS.text.tertiary, textAlign: "right" },
  medActions: { flexDirection: "row", gap: 8, marginTop: SPACING.md, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.borderSoft },
  reserveBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, gap: 6 },
  reserveText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  deliverBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10, borderRadius: RADIUS.md, backgroundColor: "rgba(37,99,235,0.10)", gap: 6 },
  deliverText: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },
});
