// Booking confirmed
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Card, GradientButton, MaterialCommunityIcons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";

export default function BookingConfirmed() {
  const { doctor, date, time, type } = useLocalSearchParams<{ doctor?: string; date?: string; time?: string; type?: string }>();
  const router = useRouter();
  const { language } = useAppState();
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.center}>
        <LinearGradient colors={["#10B981", "#059669"]} style={styles.ring}>
          <MaterialCommunityIcons name="check-bold" size={56} color="#fff" />
        </LinearGradient>
        <Text style={styles.title}>{tr(language, "appointmentConfirmed")}</Text>
        <Text style={styles.sub}>{tr(language, "appointmentConfirmedSub")}</Text>

        <Card style={{ marginTop: SPACING.xxl, width: "100%" }}>
          <Row label="Doctor" value={doctor || "—"} />
          <Row label="Date" value={date || "—"} />
          <Row label="Time" value={time || "—"} />
          <Row label="Type" value={(type || "—").toUpperCase()} />
        </Card>

        <GradientButton
          label={tr(language, "backHome")}
          onPress={() => router.replace("/(patient)")}
          icon="home"
          size="lg"
          style={{ marginTop: SPACING.xxxl, alignSelf: "stretch" }}
          testID="back-home-button"
        />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xl },
  ring: { width: 120, height: 120, borderRadius: 60, alignItems: "center", justifyContent: "center", ...SHADOW.floating },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.text.primary, marginTop: SPACING.xl, textAlign: "center" },
  sub: { fontSize: 14, color: COLORS.text.secondary, marginTop: 8, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  rowLabel: { fontSize: 12, color: COLORS.text.tertiary },
  rowValue: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
});
