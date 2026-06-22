// Doctor appointments
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, ScreenHeader, ChipsRow, Avatar, Tag, MaterialCommunityIcons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { DOCTOR_DEMO } from "@/src/data/demo";

type Tab = "today" | "upcoming" | "requests";

export default function DoctorAppointments() {
  const { language } = useAppState();
  const [tab, setTab] = useState<Tab>("today");
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "appointments")} back />
      <ChipsRow
        items={[
          { value: "today", label: tr(language, "today"), icon: "calendar-today" },
          { value: "upcoming", label: "Upcoming", icon: "calendar-clock" },
          { value: "requests", label: "Requests", icon: "bell-ring" },
        ]}
        selected={tab}
        onSelect={(v) => setTab(v as Tab)}
        testID="doc-appt-tabs"
      />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}>
        {(tab === "today" || tab === "upcoming") &&
          DOCTOR_DEMO.upcoming.map((a, i) => (
            <Card key={i} style={{ flexDirection: "row", alignItems: "center", padding: SPACING.md }}>
              <View style={styles.timeChip}><Text style={styles.timeText}>{a.time}</Text></View>
              <View style={{ marginLeft: SPACING.md, flex: 1 }}>
                <Text style={styles.patient}>{a.patient}</Text>
                <Text style={styles.type}>{a.type}</Text>
              </View>
              <TouchableOpacity style={styles.callBtn}>
                <MaterialCommunityIcons name="phone" size={18} color="#fff" />
              </TouchableOpacity>
            </Card>
          ))}
        {tab === "requests" &&
          DOCTOR_DEMO.consultationRequests.map((r) => (
            <Card key={r.id} style={{ flexDirection: "row", alignItems: "center", padding: SPACING.md }}>
              <Avatar name={r.patient} size={48} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.patient}>{r.patient}</Text>
                <Text style={styles.type}>{r.reason}</Text>
              </View>
              <Tag label={r.urgency} color="#fff" background={r.urgency === "HIGH" ? COLORS.danger : r.urgency === "MEDIUM" ? COLORS.warning : COLORS.success} />
            </Card>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  timeChip: { backgroundColor: "rgba(37,99,235,0.10)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  timeText: { color: COLORS.primary, fontWeight: "800", fontSize: 13 },
  patient: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  type: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  callBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.success, alignItems: "center", justifyContent: "center" },
});
