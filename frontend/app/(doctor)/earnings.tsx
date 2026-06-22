// Doctor earnings
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Card, ScreenHeader, ChipsRow, BarChart, Tag, MaterialCommunityIcons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { DOCTOR_DEMO } from "@/src/data/demo";

type Period = "today" | "week" | "month" | "year";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function DoctorEarnings() {
  const { language } = useAppState();
  const [period, setPeriod] = useState<Period>("month");

  const value = period === "today" ? DOCTOR_DEMO.todayEarnings : period === "week" ? DOCTOR_DEMO.weekEarnings : period === "month" ? DOCTOR_DEMO.monthEarnings : DOCTOR_DEMO.yearEarnings;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "earnings")} back />
      <ChipsRow
        items={[
          { value: "today", label: tr(language, "today"), icon: "calendar-today" },
          { value: "week", label: tr(language, "week"), icon: "calendar-week" },
          { value: "month", label: tr(language, "month"), icon: "calendar-month" },
          { value: "year", label: tr(language, "year"), icon: "calendar-blank" },
        ]}
        selected={period}
        onSelect={(p) => setPeriod(p as Period)}
        testID="earnings-period"
      />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg }}>
        <LinearGradient colors={["#10B981", "#059669"]} style={styles.heroCard}>
          <Text style={styles.heroLabel}>{period.toUpperCase()} EARNINGS</Text>
          <Text style={styles.heroValue}>{value.toLocaleString()} UZS</Text>
          <View style={styles.deltaRow}>
            <MaterialCommunityIcons name="trending-up" size={16} color="#fff" />
            <Text style={styles.deltaText}>+12.4% vs prev. {period}</Text>
          </View>
        </LinearGradient>

        <Card>
          <Text style={styles.section}>Income trend</Text>
          <View style={{ marginTop: 12 }}>
            <BarChart data={DOCTOR_DEMO.monthlyAppointments.map((v) => v * 250)} labels={MONTHS} color="#10B981" height={140} />
          </View>
        </Card>

        <Card>
          <Text style={styles.section}>Recent transactions</Text>
          {[
            { id: "t1", patient: "Aziza Karimova", type: "Consultation", amount: 250 },
            { id: "t2", patient: "Bobur Tursunov", type: "Follow-up", amount: 150 },
            { id: "t3", patient: "Madina Ergasheva", type: "ECG review", amount: 180 },
            { id: "t4", patient: "Otabek Saidov", type: "New patient", amount: 250 },
            { id: "t5", patient: "Nilufar A.", type: "Online consult", amount: 200 },
          ].map((t) => (
            <View key={t.id} style={styles.txRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.txPatient}>{t.patient}</Text>
                <Text style={styles.txType}>{t.type}</Text>
              </View>
              <Text style={styles.txAmount}>+{t.amount} 000</Text>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.section}>Premium features</Text>
          <View style={{ gap: 10, marginTop: 8 }}>
            <PremRow label="Featured Doctor" sub="Priority search placement" tag="UPGRADE" />
            <PremRow label="AI Assistant Pro" sub="Generate notes & follow-ups" tag="UPGRADE" />
            <PremRow label="Advanced Analytics" sub="Deeper patient insights" tag="UPGRADE" />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function PremRow({ label, sub, tag }: { label: string; sub: string; tag: string }) {
  return (
    <View style={styles.premRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.premLabel}>{label}</Text>
        <Text style={styles.premSub}>{sub}</Text>
      </View>
      <Tag label={tag} color="#fff" background="#7C3AED" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  heroCard: { padding: SPACING.xxl, borderRadius: RADIUS.xl, ...SHADOW.floating },
  heroLabel: { color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  heroValue: { color: "#fff", fontSize: 32, fontWeight: "900", marginTop: SPACING.sm },
  deltaRow: { flexDirection: "row", alignItems: "center", marginTop: SPACING.md },
  deltaText: { marginLeft: 6, color: "#fff", fontSize: 12 },
  section: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  txRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  txPatient: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  txType: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: "800", color: COLORS.success },
  premRow: { flexDirection: "row", alignItems: "center", padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: COLORS.bg },
  premLabel: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  premSub: { fontSize: 11, color: COLORS.text.secondary, marginTop: 2 },
});
