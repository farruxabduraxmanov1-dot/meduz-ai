// Admin marketing
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Card, ScreenHeader, GradientButton, MaterialCommunityIcons, Tag } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { ADMIN_DEMO } from "@/src/data/demo";

export default function AdminMarketing() {
  const { language } = useAppState();
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "marketing")} back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg, paddingBottom: 60 }}>
        <LinearGradient colors={["#7C3AED", "#EC4899"]} style={styles.hero}>
          <MaterialCommunityIcons name="crown" size={32} color="#fff" />
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.heroTitle}>Featured Organization</Text>
            <Text style={styles.heroSub}>Top placement · 4× more bookings · advanced analytics</Text>
          </View>
        </LinearGradient>

        <Card>
          <Text style={styles.section}>Active campaigns</Text>
          {ADMIN_DEMO.marketingCampaigns.map((c) => (
            <View key={c.name} style={styles.campRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.campName}>{c.name}</Text>
                <Text style={styles.campStat}>{c.clicks.toLocaleString()} clicks</Text>
              </View>
              <Tag
                label={c.status}
                color="#fff"
                background={c.status === "Active" ? COLORS.success : COLORS.text.tertiary}
              />
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.section}>Recommendations</Text>
          {[
            { title: "Launch a Spring promo", body: "20% off cosmetology bookings to boost off-season demand.", icon: "tag-multiple" },
            { title: "Highlight cardiology", body: "Your cardiology dept has +28% inbound traffic.", icon: "heart-pulse" },
            { title: "Add 4 new doctors", body: "Estimated +18% capacity utilization.", icon: "account-plus" },
          ].map((r) => (
            <TouchableOpacity key={r.title} style={styles.recRow}>
              <View style={styles.recIcon}>
                <MaterialCommunityIcons name={r.icon as any} size={18} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.recTitle}>{r.title}</Text>
                <Text style={styles.recBody}>{r.body}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.text.tertiary} />
            </TouchableOpacity>
          ))}
        </Card>

        <GradientButton label="Create new campaign" icon="bullhorn" size="lg" onPress={() => {}} testID="admin-create-campaign" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { flexDirection: "row", alignItems: "center", padding: SPACING.lg, borderRadius: RADIUS.xl, ...SHADOW.floating },
  heroTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 4 },
  section: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary, marginBottom: 8 },
  campRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  campName: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  campStat: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
  recRow: { flexDirection: "row", alignItems: "center", padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.bg, marginTop: 8 },
  recIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(37,99,235,0.10)", alignItems: "center", justifyContent: "center" },
  recTitle: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  recBody: { fontSize: 11, color: COLORS.text.secondary, marginTop: 2, lineHeight: 16 },
});
