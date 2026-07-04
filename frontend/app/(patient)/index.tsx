// Patient Dashboard — AI Assistant dominant + 6 modules
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import {
  Card,
  ModuleCard,
  JellyfishLogo,
  Avatar,
  MaterialCommunityIcons,
  Ionicons,
  RatingStars,
  Tag,
} from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { DOCTORS, ORGANIZATIONS } from "@/src/data/demo";
import { useChat } from "@/src/store/chat";

export default function PatientDashboard() {
  const router = useRouter();
  const { language, user } = useAppState();
  const { totalUnread } = useChat();
  const featuredDoctors = DOCTORS.filter((d) => d.featured).slice(0, 4);
  const featuredOrgs = ORGANIZATIONS.filter((o) => o.featured).slice(0, 3);

  const modules: {
    titleKey: any;
    descKey: any;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    route: string;
    color: string;
    bg: string;
  }[] = [
    { titleKey: "aiChat", descKey: "aiChatDesc", icon: "chat-processing", route: "/(patient)/ai-chat", color: "#7C3AED", bg: "rgba(124,58,237,0.10)" },
    { titleKey: "doctors", descKey: "doctorsDesc", icon: "stethoscope", route: "/(patient)/doctors", color: "#2563EB", bg: "rgba(37,99,235,0.10)" },
    { titleKey: "organizations", descKey: "organizationsDesc", icon: "hospital-building", route: "/(patient)/organizations", color: "#0EA5E9", bg: "rgba(14,165,233,0.10)" },
    { titleKey: "pharmacies", descKey: "pharmaciesDesc", icon: "pill", route: "/(patient)/pharmacies", color: "#10B981", bg: "rgba(16,185,129,0.10)" },
    { titleKey: "medicalServices", descKey: "medicalServicesDesc", icon: "hand-heart", route: "/(patient)/services", color: "#EC4899", bg: "rgba(236,72,153,0.10)" },
    { titleKey: "homeCare", descKey: "homeCareDesc", icon: "home-heart", route: "/(patient)/home-care", color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxxl + 40 }}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.push("/(patient)/profile")} testID="open-profile" style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar name={user?.name || "User"} size={44} />
            <View style={{ marginLeft: SPACING.md }}>
              <Text style={styles.greeting}>{tr(language, "goodMorning")}</Text>
              <Text style={styles.userName}>{user?.name || "Guest"}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bell} onPress={() => router.push("/inbox" as any)} testID="open-inbox">
            <Ionicons name="chatbubbles-outline" size={20} color={COLORS.text.primary} />
            {totalUnread > 0 && (
              <View style={styles.unreadDot}>
                <Text style={styles.unreadCount}>{totalUnread > 9 ? "9+" : totalUnread}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* AI Assistant — dominant card */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => router.push("/(patient)/ai-chat")}
          style={styles.aiWrap}
          testID="start-ai-consultation-card"
        >
          <LinearGradient
            colors={["#2563EB", "#6366F1", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiCard}
          >
            <View style={styles.aiHeader}>
              <View style={styles.aiBadge}>
                <MaterialCommunityIcons name="shield-check" size={12} color="#fff" />
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
              <JellyfishLogo size={56} glow={false} />
            </View>
            <Text style={styles.aiTitle}>{tr(language, "aiCardTitle")}</Text>
            <Text style={styles.aiSub}>{tr(language, "aiCardSub")}</Text>
            <View style={styles.aiCta}>
              <Text style={styles.aiCtaText}>{tr(language, "startAi")}</Text>
              <MaterialCommunityIcons name="arrow-right-circle" size={26} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Modules grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{tr(language, "services")}</Text>
        </View>
        <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <ModuleCard
              title={tr(language, modules[0].titleKey)}
              description={tr(language, modules[0].descKey)}
              icon={modules[0].icon}
              color={modules[0].color}
              bg={modules[0].bg}
              onPress={() => router.push(modules[0].route as any)}
              testID="module-ai-chat"
            />
            <ModuleCard
              title={tr(language, modules[1].titleKey)}
              description={tr(language, modules[1].descKey)}
              icon={modules[1].icon}
              color={modules[1].color}
              bg={modules[1].bg}
              onPress={() => router.push(modules[1].route as any)}
              testID="module-doctors"
            />
          </View>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <ModuleCard
              title={tr(language, modules[2].titleKey)}
              description={tr(language, modules[2].descKey)}
              icon={modules[2].icon}
              color={modules[2].color}
              bg={modules[2].bg}
              onPress={() => router.push(modules[2].route as any)}
              testID="module-organizations"
            />
            <ModuleCard
              title={tr(language, modules[3].titleKey)}
              description={tr(language, modules[3].descKey)}
              icon={modules[3].icon}
              color={modules[3].color}
              bg={modules[3].bg}
              onPress={() => router.push(modules[3].route as any)}
              testID="module-pharmacies"
            />
          </View>
          <View style={{ flexDirection: "row", gap: SPACING.md }}>
            <ModuleCard
              title={tr(language, modules[4].titleKey)}
              description={tr(language, modules[4].descKey)}
              icon={modules[4].icon}
              color={modules[4].color}
              bg={modules[4].bg}
              onPress={() => router.push(modules[4].route as any)}
              testID="module-services"
            />
            <ModuleCard
              title={tr(language, modules[5].titleKey)}
              description={tr(language, modules[5].descKey)}
              icon={modules[5].icon}
              color={modules[5].color}
              bg={modules[5].bg}
              onPress={() => router.push(modules[5].route as any)}
              testID="module-home-care"
            />
          </View>
        </View>

        {/* Featured doctors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{tr(language, "featured")} {tr(language, "doctors")}</Text>
          <TouchableOpacity onPress={() => router.push("/(patient)/doctors")}>
            <Text style={styles.sectionLink}>See all →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: SPACING.md, paddingBottom: 6 }}>
          {featuredDoctors.map((d) => (
            <TouchableOpacity
              key={d.id}
              onPress={() => router.push(`/(patient)/doctor/${d.id}` as any)}
              style={styles.featuredDoctor}
              activeOpacity={0.9}
              testID={`featured-doctor-${d.id}`}
            >
              <Image source={{ uri: d.photo }} style={styles.featuredImg} />
              <View style={{ padding: SPACING.md }}>
                <Tag label={tr(language, "premium")} icon="crown" color="#fff" background="#7C3AED" style={{ alignSelf: "flex-start", marginBottom: 6 }} />
                <Text style={styles.featuredName} numberOfLines={1}>{d.name}</Text>
                <Text style={styles.featuredSpec}>{d.specialty}</Text>
                <RatingStars rating={d.rating} count={d.reviewsCount} style={{ marginTop: 6 }} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured organizations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{tr(language, "organizations")}</Text>
          <TouchableOpacity onPress={() => router.push("/(patient)/organizations")}>
            <Text style={styles.sectionLink}>See all →</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
          {featuredOrgs.map((o) => (
            <Card
              key={o.id}
              onPress={() => router.push(`/(patient)/organization/${o.id}` as any)}
              testID={`featured-org-${o.id}`}
              style={{ flexDirection: "row", padding: SPACING.md, alignItems: "center" }}
            >
              <Image source={{ uri: o.logo }} style={styles.orgImg} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.orgName} numberOfLines={1}>{o.name}</Text>
                <Text style={styles.orgType}>{o.type} · {o.city}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <RatingStars rating={o.rating} count={o.reviewsCount} />
                  <Text style={styles.distance}>· {o.distanceKm} km</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.text.tertiary} />
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: { fontSize: 12, color: COLORS.text.secondary },
  userName: { fontSize: 16, fontWeight: "700", color: COLORS.text.primary, marginTop: 2 },
  bell: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center", ...SHADOW.card },
  dot: { position: "absolute", top: 12, right: 13, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger },
  unreadDot: { position: "absolute", top: 6, right: 4, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4, backgroundColor: COLORS.danger, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.surface },
  unreadCount: { color: "#fff", fontSize: 10, fontWeight: "800" },
  aiWrap: { marginHorizontal: SPACING.xl, marginTop: SPACING.sm, borderRadius: RADIUS.xl, ...SHADOW.floating },
  aiCard: { padding: SPACING.xl, borderRadius: RADIUS.xl },
  aiHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  aiBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill, backgroundColor: "rgba(255,255,255,0.2)" },
  aiBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700", marginLeft: 4 },
  aiTitle: { color: "#fff", fontSize: 22, fontWeight: "800", marginTop: SPACING.md },
  aiSub: { color: "rgba(255,255,255,0.9)", fontSize: 14, marginTop: 6 },
  aiCta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: SPACING.xl, padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: "rgba(255,255,255,0.15)" },
  aiCtaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl, marginBottom: SPACING.md },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: COLORS.text.primary },
  sectionLink: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  featuredDoctor: { width: 180, borderRadius: RADIUS.xl, backgroundColor: COLORS.surface, overflow: "hidden", ...SHADOW.card },
  featuredImg: { width: "100%", height: 140 },
  featuredName: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  featuredSpec: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  orgImg: { width: 60, height: 60, borderRadius: 14 },
  orgName: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  orgType: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  distance: { fontSize: 11, color: COLORS.text.tertiary, marginLeft: 6 },
});
