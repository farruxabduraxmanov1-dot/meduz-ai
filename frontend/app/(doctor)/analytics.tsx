// Doctor analytics
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, ScreenHeader, BarChart, MaterialCommunityIcons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { DOCTOR_DEMO } from "@/src/data/demo";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function DoctorAnalytics() {
  const { language } = useAppState();
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "analytics")} back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg }}>
        <View style={styles.row}>
          <Stat label="Patients" value="467" icon="account-multiple" tint="#2563EB" />
          <Stat label="Consultations" value="827" icon="message-text" tint="#7C3AED" />
        </View>
        <View style={styles.row}>
          <Stat label="Rating" value="4.9" icon="star" tint="#F59E0B" />
          <Stat label="Repeat rate" value="68%" icon="repeat" tint="#10B981" />
        </View>

        <Card>
          <Text style={styles.title}>Appointments per month</Text>
          <Text style={styles.sub}>2026 · last 12 months</Text>
          <View style={{ marginTop: SPACING.md }}>
            <BarChart data={DOCTOR_DEMO.monthlyAppointments} labels={MONTHS} height={140} />
          </View>
        </Card>

        <Card>
          <Text style={styles.title}>Patient growth</Text>
          <Text style={styles.sub}>+289% YoY</Text>
          <View style={{ marginTop: SPACING.md }}>
            <BarChart data={DOCTOR_DEMO.patientGrowth} labels={MONTHS} color="#7C3AED" height={140} />
          </View>
        </Card>

        <Card>
          <Text style={styles.title}>Rating trend</Text>
          <Text style={styles.sub}>Stable above 4.8 ★</Text>
          <View style={{ marginTop: SPACING.md }}>
            <BarChart data={DOCTOR_DEMO.ratingsTrend.map((r) => Math.round(r * 10))} labels={MONTHS} color="#F59E0B" height={120} />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, icon, tint }: { label: string; value: string; icon: any; tint: string }) {
  return (
    <View style={[styles.statCard]}>
      <View style={[styles.statIcon, { backgroundColor: `${tint}1A` }]}>
        <MaterialCommunityIcons name={icon} size={22} color={tint} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  row: { flexDirection: "row", gap: SPACING.md },
  statCard: { flex: 1, padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 22, fontWeight: "800", color: COLORS.text.primary, marginTop: 12 },
  statLabel: { fontSize: 12, color: COLORS.text.tertiary, marginTop: 2 },
  title: { fontSize: 15, fontWeight: "700", color: COLORS.text.primary },
  sub: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
});
