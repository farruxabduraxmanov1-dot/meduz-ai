// Admin analytics
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, ScreenHeader, BarChart, MaterialCommunityIcons, RatingStars } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { ADMIN_DEMO } from "@/src/data/demo";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function AdminAnalytics() {
  const { language } = useAppState();
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "analytics")} back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg }}>
        <View style={styles.row}>
          <Stat label="Visits / mo" value={ADMIN_DEMO.monthlyVisits.toLocaleString()} icon="calendar-check" tint="#2563EB" />
          <Stat label="Revenue / mo" value={`${ADMIN_DEMO.monthlyRevenue.toLocaleString()}k`} icon="cash-multiple" tint="#10B981" />
        </View>
        <View style={styles.row}>
          <Stat label="Active doctors" value={`${ADMIN_DEMO.activeDoctors}`} icon="stethoscope" tint="#7C3AED" />
          <Stat label="Total patients" value={ADMIN_DEMO.totalPatients.toLocaleString()} icon="account-multiple" tint="#F59E0B" />
        </View>

        <Card>
          <Text style={styles.title}>Patient visits</Text>
          <BarChart data={ADMIN_DEMO.patientVisitsMonthly} labels={MONTHS} />
        </Card>

        <Card>
          <Text style={styles.title}>Revenue trend</Text>
          <BarChart data={ADMIN_DEMO.revenueMonthly} labels={MONTHS} color="#10B981" />
        </Card>

        <Card>
          <Text style={styles.title}>Recent reviews</Text>
          {ADMIN_DEMO.recentReviews.map((r) => (
            <View key={r.id} style={styles.reviewRow}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.author}>{r.author}</Text>
                <RatingStars rating={r.rating} />
              </View>
              <Text style={styles.body}>{r.text}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, icon, tint }: { label: string; value: string; icon: any; tint: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${tint}1A` }]}>
        <MaterialCommunityIcons name={icon} size={20} color={tint} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  row: { flexDirection: "row", gap: SPACING.md },
  statCard: { flex: 1, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg },
  statIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: COLORS.text.primary, marginTop: 10 },
  statLabel: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
  title: { fontSize: 15, fontWeight: "700", color: COLORS.text.primary, marginBottom: 10 },
  reviewRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  author: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  body: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4, lineHeight: 18 },
});
