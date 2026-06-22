// Medicine detail — premium pharmacy list with 24/7, delivery, reserve actions
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Card, ScreenHeader, MaterialCommunityIcons, Tag, GradientButton } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import {
  MEDICINES,
  PHARMACIES,
  pharmacyHas24h,
  pharmacyHasDelivery,
  pharmacyDeliveryEta,
  seedRand,
} from "@/src/data/demo";

export default function MedicineDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language } = useAppState();
  const medicine = MEDICINES.find((m) => m.id === id) || MEDICINES[0];
  const pharmacies = PHARMACIES.filter((p) => medicine.pharmacyIds.includes(p.id));
  const [reservedAt, setReservedAt] = useState<string | null>(null);

  const reserve = (pharmacyId: string, pharmacyName: string) => {
    setReservedAt(pharmacyId);
    if (typeof window !== "undefined" && (window as any).alert) {
      (window as any).alert(`Reserved at ${pharmacyName}. Pick up within 24 hours.`);
    } else {
      Alert.alert("Reserved", `${medicine.name} reserved at ${pharmacyName}. Pick up within 24 hours.`);
    }
  };

  const orderDelivery = (pharmacyName: string, eta: number) => {
    if (typeof window !== "undefined" && (window as any).alert) {
      (window as any).alert(`${medicine.name} will be delivered from ${pharmacyName} in ~${eta} minutes.`);
    } else {
      Alert.alert("Delivery", `${medicine.name} will be delivered from ${pharmacyName} in ~${eta} minutes.`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="Medicine" back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md, paddingBottom: 32 }}>
        <Card style={{ alignItems: "center" }}>
          <Image source={{ uri: medicine.image }} style={styles.image} />
          <Text style={styles.name}>{medicine.name}</Text>
          <Text style={styles.generic}>{medicine.generic}</Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Tag label={`${medicine.priceMin}–${medicine.priceMax} k UZS`} color="#fff" background={COLORS.primary} icon="tag" />
            <Tag label={`${pharmacies.length} pharmacies`} color={COLORS.text.secondary} background="rgba(15,23,42,0.06)" icon="store" />
          </View>
        </Card>

        <Card>
          <Text style={styles.section}>Description</Text>
          <Text style={styles.body}>{medicine.description}</Text>
          <Text style={styles.section}>Usage</Text>
          <Text style={styles.body}>{medicine.usage}</Text>
        </Card>

        <Card>
          <Text style={styles.section}>
            {tr(language, "availableAt")} {pharmacies.length} {tr(language, "pharmaciesNearby")}
          </Text>
          {pharmacies.map((p) => {
            const is24h = pharmacyHas24h(p);
            const hasDelivery = pharmacyHasDelivery(p.id);
            const delivEta = pharmacyDeliveryEta(p.id);
            const isReserved = reservedAt === p.id;
            // Pharmacy-specific price (within the medicine's range, seeded)
            const phPrice = Math.round(seedRand(`${medicine.id}-${p.id}`, medicine.priceMin, medicine.priceMax));
            return (
              <View key={p.id} style={styles.phRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image source={{ uri: p.logo }} style={styles.phImg} />
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text style={styles.phName}>{p.name}</Text>
                    <Text style={styles.phAddr}>{p.address} · {p.distanceKm} km</Text>
                    <View style={{ flexDirection: "row", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                      {is24h && <Tag label="24/7" icon="clock-time-eight" color="#fff" background="#7C3AED" />}
                      {hasDelivery && <Tag label={`Delivery ${delivEta}min`} icon="moped" color={COLORS.primary} background="rgba(37,99,235,0.10)" />}
                      <Tag label={p.open ? "Open" : "Closed"} color={p.open ? COLORS.success : COLORS.danger} background={p.open ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"} />
                    </View>
                  </View>
                  <Text style={styles.phPrice}>{phPrice}k</Text>
                </View>
                <View style={styles.phActions}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${p.phone.replace(/\s/g, "")}`)}
                    style={styles.iconBtn}
                    testID={`med-call-${p.id}`}
                  >
                    <MaterialCommunityIcons name="phone" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => reserve(p.id, p.name)}
                    style={[styles.reserveBtn, isReserved && { backgroundColor: COLORS.success }]}
                    testID={`med-reserve-${p.id}`}
                  >
                    <MaterialCommunityIcons name={isReserved ? "check-circle" : "bookmark-plus"} size={14} color="#fff" />
                    <Text style={styles.reserveText}>{isReserved ? "Reserved" : "Reserve"}</Text>
                  </TouchableOpacity>
                  {hasDelivery && (
                    <TouchableOpacity
                      onPress={() => orderDelivery(p.name, delivEta)}
                      style={styles.deliverBtn}
                      testID={`med-deliver-${p.id}`}
                    >
                      <MaterialCommunityIcons name="moped" size={14} color={COLORS.primary} />
                      <Text style={styles.deliverText}>Delivery</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </Card>

        <Card>
          <Text style={styles.section}>Important</Text>
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 4 }}>
            <MaterialCommunityIcons name="alert-circle-outline" size={16} color={COLORS.warning} style={{ marginTop: 2 }} />
            <Text style={[styles.body, { flex: 1, marginLeft: 8 }]}>
              Some medicines require a prescription. Reservations and delivery are demo features only.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  image: { width: 140, height: 140, borderRadius: 16, backgroundColor: COLORS.surfaceMuted },
  name: { fontSize: 20, fontWeight: "800", color: COLORS.text.primary, marginTop: SPACING.md, textAlign: "center" },
  generic: { fontSize: 13, color: COLORS.text.secondary, marginTop: 2 },
  section: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary, marginTop: SPACING.sm, marginBottom: 4 },
  body: { fontSize: 13, color: COLORS.text.secondary, lineHeight: 20 },
  phRow: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  phImg: { width: 48, height: 48, borderRadius: 12 },
  phName: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  phAddr: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
  phPrice: { fontSize: 16, fontWeight: "800", color: COLORS.primary, marginLeft: 8 },
  phActions: { flexDirection: "row", marginTop: SPACING.sm, gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(37,99,235,0.08)" },
  reserveBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, gap: 6 },
  reserveText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  deliverBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: "rgba(37,99,235,0.10)", gap: 6 },
  deliverText: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },
});
