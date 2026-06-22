// Doctor profile
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  Card,
  RatingStars,
  Tag,
  GradientButton,
  ScreenHeader,
  IconText,
  MaterialCommunityIcons,
} from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { DOCTORS, ORGANIZATIONS, generateReviews } from "@/src/data/demo";

export default function DoctorProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language } = useAppState();
  const doctor = DOCTORS.find((d) => d.id === id) || DOCTORS[0];
  const reviews = generateReviews(parseInt(doctor.id.replace(/\D/g, ""), 10) || 1, 6);
  const linkedOrgs = ORGANIZATIONS.filter((o) => doctor.organizationIds.includes(o.id));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "doctors")} back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, paddingBottom: 120, gap: SPACING.lg }}>
        <Card style={{ alignItems: "center", padding: SPACING.xl }}>
          <Image source={{ uri: doctor.photo }} style={styles.hero} />
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.spec}>{doctor.specialty}</Text>
          <View style={{ flexDirection: "row", gap: SPACING.lg, marginTop: SPACING.md }}>
            <Stat label={tr(language, "yearsExp")} value={`${doctor.yearsExp}+`} />
            <Stat label={tr(language, "rating")} value={doctor.rating.toFixed(1)} icon="star" />
            <Stat label={tr(language, "reviews")} value={`${doctor.reviewsCount}`} />
          </View>
          <View style={{ flexDirection: "row", gap: 8, marginTop: SPACING.md, flexWrap: "wrap", justifyContent: "center" }}>
            {doctor.online && <Tag label={tr(language, "online")} icon="video" color={COLORS.success} background="rgba(16,185,129,0.12)" />}
            {doctor.offline && <Tag label={tr(language, "offline")} icon="hospital-building" color={COLORS.primary} background="rgba(37,99,235,0.10)" />}
            {doctor.homeVisit && <Tag label={tr(language, "homeVisit")} icon="home" color={COLORS.warning} background="rgba(245,158,11,0.12)" />}
            {doctor.featured && <Tag label={tr(language, "premium")} icon="crown" color="#fff" background="#7C3AED" />}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.body}>{doctor.bio}</Text>
          <Text style={styles.sectionTitle}>Languages</Text>
          <Text style={styles.body}>{doctor.languages.join(" · ")}</Text>
          <Text style={styles.sectionTitle}>Consultation</Text>
          <Text style={styles.body}>Price: {doctor.price} 000 UZS · {doctor.city} · {doctor.distanceKm} km</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Workplaces</Text>
          {linkedOrgs.length > 0 ? linkedOrgs.map((o) => (
            <TouchableOpacity
              key={o.id}
              onPress={() => router.push(`/(patient)/organization/${o.id}` as any)}
              style={styles.orgRow}
              testID={`linked-org-${o.id}`}
            >
              <Image source={{ uri: o.logo }} style={styles.orgLogo} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.orgName}>{o.name}</Text>
                <Text style={styles.orgType}>{o.type} · {o.city}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.text.tertiary} />
            </TouchableOpacity>
          )) : doctor.workplaces.map((w) => (
            <Text key={w} style={styles.body}>· {w}</Text>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>{tr(language, "reviews")}</Text>
          {reviews.map((r) => (
            <View key={r.id} style={styles.reviewRow}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.reviewAuthor}>{r.author}</Text>
                <RatingStars rating={r.rating} />
              </View>
              <Text style={styles.reviewDate}>{r.date}</Text>
              <Text style={styles.body}>{r.text}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.msgBtn} onPress={() => router.push("/(patient)/ai-chat")}>
          <MaterialCommunityIcons name="message-text" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <GradientButton
          label={tr(language, "bookAppointment")}
          onPress={() => router.push(`/(patient)/booking/${doctor.id}` as any)}
          style={{ flex: 1, marginLeft: SPACING.md }}
          testID="book-appointment-button"
          icon="calendar-check"
        />
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: any }) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      {icon ? <MaterialCommunityIcons name={icon} size={18} color={COLORS.warning} /> : null}
      <Text style={{ fontSize: 17, fontWeight: "800", color: COLORS.text.primary }}>{value}</Text>
      <Text style={{ fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 22, fontWeight: "800", color: COLORS.text.primary, marginTop: SPACING.md, textAlign: "center" },
  spec: { fontSize: 14, color: COLORS.text.secondary, marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary, marginTop: SPACING.md, marginBottom: 4 },
  body: { fontSize: 13, color: COLORS.text.secondary, lineHeight: 20 },
  orgRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  orgLogo: { width: 48, height: 48, borderRadius: 12 },
  orgName: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  orgType: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  reviewRow: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  reviewAuthor: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  reviewDate: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2, marginBottom: 4 },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: COLORS.surface, padding: SPACING.lg, flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderTopColor: COLORS.borderSoft },
  msgBtn: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg, ...SHADOW.card },
});
