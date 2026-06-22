// Doctor dashboard
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import {
  Card,
  ModuleCard,
  Avatar,
  Tag,
  RatingStars,
  MaterialCommunityIcons,
  Ionicons,
  GradientButton,
} from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { DOCTOR_DEMO } from "@/src/data/demo";

const URGENCY: Record<string, string> = { HIGH: COLORS.danger, MEDIUM: COLORS.warning, LOW: COLORS.success };

export default function DoctorDashboard() {
  const router = useRouter();
  const { language, signOut, setRole } = useAppState();
  const d = DOCTOR_DEMO;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxxl }}>
        <View style={styles.topBar}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={{ uri: d.photo }} style={styles.doctorImg} />
            <View style={{ marginLeft: SPACING.md }}>
              <Text style={styles.greeting}>{tr(language, "goodMorning")}</Text>
              <Text style={styles.userName}>{d.name}</Text>
              <Text style={styles.spec}>{d.specialty}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bell}
            onPress={async () => { await setRole(null); router.replace("/role"); }}
            testID="doctor-switch-role"
          >
            <MaterialCommunityIcons name="account-switch" size={18} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Stat label="Today" value={`${d.todayAppointments}`} sub={`${d.todayConsultations} online`} icon="calendar-today" tint="#2563EB" />
          <Stat label="Earnings" value={`${d.todayEarnings}k`} sub="UZS today" icon="cash-multiple" tint="#10B981" />
          <Stat label="Rating" value={d.rating.toFixed(1)} sub={`${d.reviewsCount} reviews`} icon="star" tint="#F59E0B" />
        </View>

        {/* Next appointment */}
        <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.md }}>
          <LinearGradient colors={["#2563EB", "#7C3AED"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.nextCard}>
            <View style={styles.nextHeader}>
              <View style={styles.timeBadge}><Text style={styles.timeText}>{d.nextAppointment.time}</Text></View>
              <Text style={styles.nextLabel}>Next appointment</Text>
            </View>
            <Text style={styles.nextPatient}>{d.nextAppointment.patient}</Text>
            <Text style={styles.nextType}>{d.nextAppointment.type}</Text>
            <View style={{ flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.md }}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(doctor)/appointments")}>
                <MaterialCommunityIcons name="phone-in-talk" size={16} color="#fff" />
                <Text style={styles.actionText}>Start call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "rgba(255,255,255,0.16)" }]} onPress={() => router.push("/(doctor)/appointments")}>
                <Text style={styles.actionText}>View all</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Module grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
        </View>
        <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <ModuleCard title={tr(language, "appointments")} description="Schedule & requests" icon="calendar-check" color="#2563EB" bg="rgba(37,99,235,0.10)" onPress={() => router.push("/(doctor)/appointments")} testID="doc-appointments" />
            <ModuleCard title={tr(language, "analytics")} description="Patient & rating trends" icon="chart-line" color="#7C3AED" bg="rgba(124,58,237,0.10)" onPress={() => router.push("/(doctor)/analytics")} testID="doc-analytics" />
          </View>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <ModuleCard title={tr(language, "earnings")} description="Income overview" icon="cash-multiple" color="#10B981" bg="rgba(16,185,129,0.10)" onPress={() => router.push("/(doctor)/earnings")} testID="doc-earnings" />
            <ModuleCard title={tr(language, "aiForDoctors")} description="AI clinical assistant" icon="robot-happy" color="#EC4899" bg="rgba(236,72,153,0.10)" onPress={() => router.push("/(doctor)/ai-assistant")} testID="doc-ai" />
          </View>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <ModuleCard title="Reviews" description={`${d.reviewsCount} patient reviews`} icon="star-circle" color="#F59E0B" bg="rgba(245,158,11,0.10)" onPress={() => router.push("/(doctor)/profile")} testID="doc-reviews" />
            <ModuleCard title="Profile" description="Edit profile & prices" icon="account-cog" color="#0EA5E9" bg="rgba(14,165,233,0.10)" onPress={() => router.push("/(doctor)/profile")} testID="doc-profile" />
          </View>
        </View>

        {/* Consultation requests */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Consultation requests</Text>
          <TouchableOpacity onPress={() => router.push("/(doctor)/appointments")}>
            <Text style={styles.link}>See all →</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.sm }}>
          {d.consultationRequests.map((r) => (
            <Card key={r.id} style={{ flexDirection: "row", alignItems: "center", padding: SPACING.md }}>
              <Avatar name={r.patient} size={40} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.reqName}>{r.patient}</Text>
                <Text style={styles.reqReason}>{r.reason}</Text>
              </View>
              <Tag label={r.urgency} color="#fff" background={URGENCY[r.urgency] || COLORS.primary} />
            </Card>
          ))}
        </View>

        {/* Premium card */}
        <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl }}>
          <LinearGradient colors={["#F59E0B", "#7C3AED"]} style={styles.premiumCard}>
            <MaterialCommunityIcons name="crown" size={32} color="#fff" />
            <View style={{ marginLeft: SPACING.md, flex: 1 }}>
              <Text style={styles.premiumTitle}>Become a Featured Doctor</Text>
              <Text style={styles.premiumSub}>Top placement · Advanced analytics · AI Assistant Pro</Text>
            </View>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, sub, icon, tint }: { label: string; value: string; sub: string; icon: any; tint: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${tint}1A` }]}>
        <MaterialCommunityIcons name={icon} size={18} color={tint} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg },
  doctorImg: { width: 52, height: 52, borderRadius: 26 },
  greeting: { fontSize: 11, color: COLORS.text.tertiary },
  userName: { fontSize: 15, fontWeight: "800", color: COLORS.text.primary },
  spec: { fontSize: 11, color: COLORS.primary, marginTop: 2 },
  bell: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center", ...SHADOW.card },
  statsRow: { flexDirection: "row", gap: SPACING.md, paddingHorizontal: SPACING.xl, marginTop: SPACING.lg },
  statCard: { flex: 1, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, ...SHADOW.card },
  statIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: COLORS.text.primary, marginTop: 8 },
  statLabel: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
  statSub: { fontSize: 10, color: COLORS.text.tertiary, marginTop: 2 },
  nextCard: { padding: SPACING.xl, borderRadius: RADIUS.xl, ...SHADOW.floating },
  nextHeader: { flexDirection: "row", alignItems: "center" },
  timeBadge: { backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  timeText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  nextLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginLeft: 10 },
  nextPatient: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: SPACING.md },
  nextType: { color: "rgba(255,255,255,0.9)", fontSize: 13, marginTop: 2 },
  actionBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.pill, backgroundColor: "rgba(255,255,255,0.22)", gap: 6 },
  actionText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl, marginBottom: SPACING.md },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text.primary },
  link: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  reqName: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  reqReason: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  premiumCard: { flexDirection: "row", alignItems: "center", padding: SPACING.lg, borderRadius: RADIUS.xl, ...SHADOW.floating },
  premiumTitle: { color: "#fff", fontSize: 15, fontWeight: "800" },
  premiumSub: { color: "rgba(255,255,255,0.85)", fontSize: 11, marginTop: 4 },
});
