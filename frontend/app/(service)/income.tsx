// Service income
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Card, ScreenHeader, BarChart, MaterialCommunityIcons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { SERVICE_DEMO } from "@/src/data/demo";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const INCOME = [8200, 9100, 8800, 10200, 11800, 12100, 13500, 14600, 15800, 17200, 18100, 18600];

export default function ServiceIncome() {
  const { language } = useAppState();
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "income")} back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg }}>
        <LinearGradient colors={["#10B981", "#0EA5E9"]} style={styles.hero}>
          <Text style={styles.heroLabel}>YEAR INCOME</Text>
          <Text style={styles.heroValue}>{SERVICE_DEMO.yearIncome.toLocaleString()} 000 UZS</Text>
          <Text style={styles.heroSub}>+24% YoY</Text>
        </LinearGradient>

        <Card>
          <Text style={styles.title}>Monthly trend</Text>
          <BarChart data={INCOME} labels={MONTHS} color="#10B981" />
        </Card>

        <Card>
          <Text style={styles.title}>Earnings breakdown</Text>
          <Row label="Home nurse visits" value="62%" amount="11 532k" />
          <Row label="IV therapy" value="18%" amount="3 348k" />
          <Row label="Injections" value="12%" amount="2 232k" />
          <Row label="Wound care" value="8%" amount="1 488k" />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, amount }: { label: string; value: string; amount: string }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rLabel}>{label}</Text>
        <Text style={styles.rAmount}>{amount}</Text>
      </View>
      <Text style={styles.rValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { padding: SPACING.xxl, borderRadius: RADIUS.xl, ...SHADOW.floating },
  heroLabel: { color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  heroValue: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: SPACING.sm },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 4 },
  title: { fontSize: 15, fontWeight: "700", color: COLORS.text.primary, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  rLabel: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  rAmount: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
  rValue: { fontSize: 14, fontWeight: "800", color: COLORS.primary },
});
