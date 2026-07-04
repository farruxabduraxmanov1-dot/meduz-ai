// Admin dashboard
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Card, ModuleCard, BarChart, Tag, MaterialCommunityIcons, RatingStars } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { useChat } from "@/src/store/chat";
import { ADMIN_DEMO } from "@/src/data/demo";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function AdminDashboard() {
  const router = useRouter();
  const { language, setRole } = useAppState();
  const { totalUnread } = useChat();
  const a = ADMIN_DEMO;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxxl }}>
        {/* Hero */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: a.hero }} style={styles.heroImg} />
          <LinearGradient colors={["transparent", "rgba(15,23,42,0.85)"]} style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Tag label="Admin Console" icon="shield-account" color="#fff" background="rgba(255,255,255,0.18)" />
            <Text style={styles.orgName}>{a.organizationName}</Text>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <RatingStars rating={4.7} count={256} size={12} />
            </View>
          </View>
          <TouchableOpacity
            style={styles.switchBtn}
            onPress={async () => { await setRole(null); router.replace("/role"); }}
            testID="admin-switch-role"
          >
            <MaterialCommunityIcons name="account-switch" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Stat label="Active doctors" value={`${a.activeDoctors}`} icon="stethoscope" tint="#2563EB" />
          <Stat label="Total patients" value={a.totalPatients.toLocaleString()} icon="account-multiple" tint="#7C3AED" />
          <Stat label="Monthly visits" value={a.monthlyVisits.toLocaleString()} icon="calendar-check" tint="#10B981" />
        </View>

        {/* Module grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Manage</Text>
        </View>
        <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <ModuleCard title={tr(language, "manageDoctors")} description={`${a.activeDoctors} doctors`} icon="stethoscope" color="#2563EB" bg="rgba(37,99,235,0.10)" onPress={() => router.push("/(admin)/doctors")} testID="admin-doctors" />
            <ModuleCard title={tr(language, "departments")} description="10+ departments" icon="briefcase-variant" color="#7C3AED" bg="rgba(124,58,237,0.10)" onPress={() => router.push("/(admin)/departments")} testID="admin-departments" />
          </View>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <ModuleCard title={tr(language, "analytics")} description="Visits & revenue" icon="chart-line" color="#10B981" bg="rgba(16,185,129,0.10)" onPress={() => router.push("/(admin)/analytics")} testID="admin-analytics" />
            <ModuleCard title={tr(language, "marketing")} description="Promotions & ads" icon="bullhorn" color="#EC4899" bg="rgba(236,72,153,0.10)" onPress={() => router.push("/(admin)/marketing")} testID="admin-marketing" />
          </View>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <ModuleCard title="Inbox" description={totalUnread > 0 ? `${totalUnread} unread` : "Patient inquiries"} icon="chat-processing" color="#F59E0B" bg="rgba(245,158,11,0.10)" onPress={() => router.push("/inbox" as any)} testID="admin-inbox" />
            <View style={{ flex: 1 }} />
          </View>
        </View>

        {/* Revenue */}
        <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl }}>
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View>
                <Text style={styles.cardTitle}>Monthly revenue</Text>
                <Text style={styles.cardSub}>+18.2% YoY</Text>
              </View>
              <Text style={styles.bigNum}>{a.monthlyRevenue.toLocaleString()} k</Text>
            </View>
            <View style={{ marginTop: SPACING.md }}>
              <BarChart data={a.revenueMonthly} labels={MONTHS} color="#10B981" />
            </View>
          </Card>
        </View>

        {/* Popular services */}
        <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.lg }}>
          <Card>
            <Text style={styles.cardTitle}>Popular services</Text>
            <View style={{ marginTop: SPACING.md, gap: 10 }}>
              {a.popularServices.map((s) => (
                <View key={s.name} style={styles.popRow}>
                  <Text style={styles.popName}>{s.name}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${s.percent * 3}%` }]} />
                  </View>
                  <Text style={styles.popPct}>{s.percent}%</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, icon, tint }: { label: string; value: string; icon: any; tint: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${tint}1A` }]}>
        <MaterialCommunityIcons name={icon} size={18} color={tint} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  heroWrap: { height: 200, position: "relative" },
  heroImg: { width: "100%", height: "100%" },
  heroOverlay: { position: "absolute", left: 0, right: 0, bottom: 0, height: "100%" },
  heroContent: { position: "absolute", left: SPACING.xl, bottom: SPACING.xl, gap: 6 },
  orgName: { color: "#fff", fontSize: 22, fontWeight: "800" },
  switchBtn: { position: "absolute", top: SPACING.lg, right: SPACING.xl, width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row", gap: SPACING.md, paddingHorizontal: SPACING.xl, marginTop: SPACING.lg },
  statCard: { flex: 1, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, ...SHADOW.card },
  statIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 16, fontWeight: "800", color: COLORS.text.primary, marginTop: 8 },
  statLabel: { fontSize: 10, color: COLORS.text.tertiary, marginTop: 2 },
  sectionHeader: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl, marginBottom: SPACING.md },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text.primary },
  cardTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text.primary },
  cardSub: { fontSize: 12, color: COLORS.success, marginTop: 2 },
  bigNum: { fontSize: 22, fontWeight: "800", color: COLORS.text.primary },
  popRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  popName: { width: 110, fontSize: 12, color: COLORS.text.primary },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: COLORS.surfaceMuted, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: COLORS.primary, borderRadius: 4 },
  popPct: { width: 36, textAlign: "right", fontSize: 12, fontWeight: "700", color: COLORS.text.secondary },
});
