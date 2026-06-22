// Service provider profile
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Card, RatingStars, Tag, ScreenHeader, GradientButton, MaterialCommunityIcons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { MEDICAL_SERVICES, generateReviews } from "@/src/data/demo";

export default function ServiceProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language } = useAppState();
  const svc = MEDICAL_SERVICES.find((s) => s.id === id) || MEDICAL_SERVICES[0];
  const reviews = generateReviews(parseInt(svc.id.replace(/\D/g, ""), 10) || 1, 5);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={svc.serviceType} back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md, paddingBottom: 120 }}>
        <Card style={{ alignItems: "center", padding: SPACING.xl }}>
          <Image source={{ uri: svc.photo }} style={styles.hero} />
          <Text style={styles.name}>{svc.name}</Text>
          <Text style={styles.type}>{svc.serviceType} · {svc.city}</Text>
          <View style={{ flexDirection: "row", gap: SPACING.xl, marginTop: SPACING.md }}>
            <Stat label="Experience" value={`${svc.experience}+ yrs`} />
            <Stat label="Rating" value={svc.rating.toFixed(1)} icon="star" />
            <Stat label="Price" value={`${svc.price} k`} />
          </View>
          {svc.homeVisit && <Tag label={tr(language, "homeVisit")} icon="home" color={COLORS.warning} background="rgba(245,158,11,0.12)" style={{ marginTop: SPACING.md }} />}
        </Card>

        <Card>
          <Text style={styles.section}>About</Text>
          <Text style={styles.body}>{svc.bio}</Text>
        </Card>

        <Card>
          <Text style={styles.section}>Price list</Text>
          <Row label={`${svc.serviceType} (1 hour)`} value={`${svc.price} 000 UZS`} />
          <Row label={`Home visit fee`} value={svc.homeVisit ? "+30 000 UZS" : "—"} />
          <Row label={`Emergency surcharge`} value={`+50 000 UZS`} />
        </Card>

        <Card>
          <Text style={styles.section}>Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 8 }}>
            {svc.gallery.map((g, i) => (
              <Image key={i} source={{ uri: g }} style={styles.galleryImg} />
            ))}
          </ScrollView>
        </Card>

        <Card>
          <Text style={styles.section}>Reviews</Text>
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
        <GradientButton
          label="Request Service"
          onPress={() => router.push("/(patient)/home-care")}
          icon="calendar-clock"
          style={{ flex: 1 }}
          testID="request-service-button"
        />
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: any }) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      {icon ? <MaterialCommunityIcons name={icon} size={16} color={COLORS.warning} /> : null}
      <Text style={{ fontSize: 16, fontWeight: "800", color: COLORS.text.primary }}>{value}</Text>
      <Text style={{ fontSize: 10, color: COLORS.text.tertiary, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
      <Text style={{ fontSize: 13, color: COLORS.text.secondary }}>{label}</Text>
      <Text style={{ fontSize: 13, color: COLORS.text.primary, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 20, fontWeight: "800", color: COLORS.text.primary, marginTop: SPACING.md },
  type: { fontSize: 13, color: COLORS.text.secondary, marginTop: 4 },
  section: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary, marginBottom: 8 },
  body: { fontSize: 13, color: COLORS.text.secondary, lineHeight: 20 },
  galleryImg: { width: 100, height: 100, borderRadius: 12 },
  reviewRow: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  reviewAuthor: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  reviewDate: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2, marginBottom: 4 },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, padding: SPACING.lg, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.borderSoft, flexDirection: "row", alignItems: "center" },
});
