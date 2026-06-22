// Service provider dashboard
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Card, ModuleCard, MaterialCommunityIcons, Tag, RatingStars } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { SERVICE_DEMO } from "@/src/data/demo";

export default function ServiceDashboard() {
  const router = useRouter();
  const { language, setRole } = useAppState();
  const s = SERVICE_DEMO;
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxxl }}>
        <View style={styles.topBar}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={{ uri: s.photo }} style={styles.avatar} />
            <View style={{ marginLeft: SPACING.md }}>
              <Text style={styles.greeting}>{tr(language, "goodMorning")}</Text>
              <Text style={styles.name}>{s.name}</Text>
              <Text style={styles.role}>{s.serviceType}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.switchBtn} onPress={async () => { await setRole(null); router.replace("/role"); }} testID="svc-switch-role">
            <MaterialCommunityIcons name="account-switch" size={18} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Income hero */}
        <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.md }}>
          <LinearGradient colors={["#10B981", "#0EA5E9"]} style={styles.income}>
            <Text style={styles.incomeLabel}>MONTH INCOME</Text>
            <Text style={styles.incomeValue}>{s.monthIncome.toLocaleString()} 000 UZS</Text>
            <View style={styles.incomeRow}>
              <View style={styles.incomeStat}>
                <Text style={styles.istV}>{s.todayOrders}</Text>
                <Text style={styles.istL}>Today</Text>
              </View>
              <View style={styles.incomeStat}>
                <Text style={styles.istV}>{s.weekOrders}</Text>
                <Text style={styles.istL}>This week</Text>
              </View>
              <View style={styles.incomeStat}>
                <Text style={styles.istV}>{s.rating}</Text>
                <Text style={styles.istL}>★ Rating</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.section}>Dashboard</Text>
        </View>
        <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <ModuleCard title={tr(language, "orders")} description={`${s.todayOrders} active`} icon="clipboard-list" color="#2563EB" bg="rgba(37,99,235,0.10)" onPress={() => router.push("/(service)/orders")} testID="svc-orders" />
            <ModuleCard title={tr(language, "income")} description="Track earnings" icon="cash-multiple" color="#10B981" bg="rgba(16,185,129,0.10)" onPress={() => router.push("/(service)/income")} testID="svc-income" />
          </View>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <ModuleCard title={tr(language, "gallery")} description="Showcase your work" icon="image-multiple" color="#7C3AED" bg="rgba(124,58,237,0.10)" onPress={() => router.push("/(service)/gallery")} testID="svc-gallery" />
            <ModuleCard title={tr(language, "reviews")} description={`${s.rating} ★`} icon="star-circle" color="#F59E0B" bg="rgba(245,158,11,0.10)" onPress={() => router.push("/(service)/orders")} testID="svc-reviews" />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.section}>Active orders</Text>
        </View>
        <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.sm }}>
          {s.activeOrders.map((o) => (
            <Card key={o.id} style={{ flexDirection: "row", alignItems: "center", padding: SPACING.md }}>
              <View style={styles.timeChip}><Text style={styles.timeText}>{o.time}</Text></View>
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.orderClient}>{o.client}</Text>
                <Text style={styles.orderService}>{o.service}</Text>
              </View>
              <Tag
                label={o.status}
                color="#fff"
                background={o.status === "In transit" ? COLORS.primary : o.status === "Confirmed" ? COLORS.success : COLORS.warning}
              />
            </Card>
          ))}
        </View>

        {/* Premium */}
        <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl }}>
          <LinearGradient colors={["#F59E0B", "#EC4899"]} style={styles.premium}>
            <MaterialCommunityIcons name="rocket-launch" size={28} color="#fff" />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.premTitle}>Become a Featured Provider</Text>
              <Text style={styles.premSub}>Priority listing · Promotion campaigns</Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  greeting: { fontSize: 11, color: COLORS.text.tertiary },
  name: { fontSize: 15, fontWeight: "800", color: COLORS.text.primary },
  role: { fontSize: 11, color: COLORS.primary, marginTop: 2 },
  switchBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center", ...SHADOW.card },
  income: { padding: SPACING.xl, borderRadius: RADIUS.xl, ...SHADOW.floating },
  incomeLabel: { color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  incomeValue: { color: "#fff", fontSize: 26, fontWeight: "900", marginTop: SPACING.sm },
  incomeRow: { flexDirection: "row", marginTop: SPACING.lg, gap: SPACING.md },
  incomeStat: { flex: 1, alignItems: "center", padding: SPACING.sm, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12 },
  istV: { color: "#fff", fontWeight: "800", fontSize: 16 },
  istL: { color: "rgba(255,255,255,0.85)", fontSize: 10, marginTop: 2 },
  sectionHeader: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl, marginBottom: SPACING.md },
  section: { fontSize: 15, fontWeight: "700", color: COLORS.text.primary },
  timeChip: { backgroundColor: "rgba(37,99,235,0.10)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  timeText: { color: COLORS.primary, fontWeight: "800", fontSize: 12 },
  orderClient: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  orderService: { fontSize: 11, color: COLORS.text.secondary, marginTop: 2 },
  premium: { flexDirection: "row", alignItems: "center", padding: SPACING.lg, borderRadius: RADIUS.xl, ...SHADOW.floating },
  premTitle: { color: "#fff", fontWeight: "800", fontSize: 14 },
  premSub: { color: "rgba(255,255,255,0.85)", fontSize: 11, marginTop: 4 },
});
