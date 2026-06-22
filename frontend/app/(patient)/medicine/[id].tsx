// Medicine detail
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Card, ScreenHeader, MaterialCommunityIcons, Tag } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { MEDICINES, PHARMACIES } from "@/src/data/demo";

export default function MedicineDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language } = useAppState();
  const medicine = MEDICINES.find((m) => m.id === id) || MEDICINES[0];
  const pharmacies = PHARMACIES.filter((p) => medicine.pharmacyIds.includes(p.id));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="Medicine" back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}>
        <Card style={{ alignItems: "center" }}>
          <Image source={{ uri: medicine.image }} style={styles.image} />
          <Text style={styles.name}>{medicine.name}</Text>
          <Text style={styles.generic}>{medicine.generic}</Text>
          <Tag label={`${medicine.priceMin}–${medicine.priceMax} k UZS`} color="#fff" background={COLORS.primary} style={{ marginTop: 8 }} />
        </Card>

        <Card>
          <Text style={styles.section}>Description</Text>
          <Text style={styles.body}>{medicine.description}</Text>
          <Text style={styles.section}>Usage</Text>
          <Text style={styles.body}>{medicine.usage}</Text>
        </Card>

        <Card>
          <Text style={styles.section}>{tr(language, "availableAt")} {pharmacies.length} {tr(language, "pharmaciesNearby")}</Text>
          {pharmacies.map((p) => (
            <View key={p.id} style={styles.phRow}>
              <Image source={{ uri: p.logo }} style={styles.phImg} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.phName}>{p.name}</Text>
                <Text style={styles.phAddr}>{p.address} · {p.distanceKm} km</Text>
              </View>
              <MaterialCommunityIcons name="phone" size={18} color={COLORS.primary} />
            </View>
          ))}
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
  phRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  phImg: { width: 44, height: 44, borderRadius: 12 },
  phName: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  phAddr: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
});
