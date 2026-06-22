// Organization profile
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Card, RatingStars, Tag, ScreenHeader, GradientButton, IconText, MaterialCommunityIcons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { ORGANIZATIONS, DOCTORS, generateReviews } from "@/src/data/demo";

type Tab = "doctors" | "departments" | "reviews";

export default function OrganizationProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language } = useAppState();
  const org = ORGANIZATIONS.find((o) => o.id === id) || ORGANIZATIONS[0];
  const [tab, setTab] = useState<Tab>("doctors");
  const linkedDoctors = DOCTORS.filter((d) => d.organizationIds.includes(org.id));
  const reviews = generateReviews(parseInt(org.id.replace(/\D/g, ""), 10) || 1, 5);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "organizations")} back />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Image source={{ uri: org.hero }} style={styles.hero} />
        <View style={{ padding: SPACING.xl }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={styles.name}>{org.name}</Text>
            {org.featured && <Tag label="TOP" icon="crown" color="#fff" background="#7C3AED" />}
          </View>
          <Text style={styles.type}>{org.type} · {org.city}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
            <RatingStars rating={org.rating} count={org.reviewsCount} />
            <Text style={styles.dot}>·</Text>
            <Text style={styles.subText}>{org.doctorsCount} doctors</Text>
          </View>
          <Text style={[styles.body, { marginTop: SPACING.md }]}>{org.description}</Text>

          <Card style={{ marginTop: SPACING.lg }}>
            <Row icon="map-marker" text={`${org.address} · ${org.distanceKm} km`} />
            <Row icon="phone" text={org.phone} onPress={() => Linking.openURL(`tel:${org.phone.replace(/\s/g, "")}`)} />
            <Row icon="clock-outline" text={org.hours} />
          </Card>

          <View style={styles.tabs}>
            {(["doctors", "departments", "reviews"] as Tab[]).map((t) => {
              const active = t === tab;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTab(t)}
                  style={[styles.tab, active && { borderBottomColor: COLORS.primary }]}
                  testID={`org-tab-${t}`}
                >
                  <Text style={[styles.tabText, active && { color: COLORS.primary, fontWeight: "700" }]}>
                    {t === "doctors" ? tr(language, "doctorsList") : t === "departments" ? tr(language, "departments") : tr(language, "reviews")}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {tab === "doctors" && (
            <View style={{ gap: SPACING.md, marginTop: SPACING.md }}>
              {linkedDoctors.length === 0 ? (
                <Text style={styles.subText}>Doctors will appear here as they join the platform.</Text>
              ) : (
                linkedDoctors.map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    onPress={() => router.push(`/(patient)/doctor/${d.id}` as any)}
                    style={styles.docRow}
                    testID={`org-doctor-${d.id}`}
                  >
                    <Image source={{ uri: d.photo }} style={styles.docImg} />
                    <View style={{ flex: 1, marginLeft: SPACING.md }}>
                      <Text style={styles.docName}>{d.name}</Text>
                      <Text style={styles.docSpec}>{d.specialty} · {d.yearsExp} yrs</Text>
                      <RatingStars rating={d.rating} count={d.reviewsCount} style={{ marginTop: 4 }} />
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.text.tertiary} />
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
          {tab === "departments" && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: SPACING.md }}>
              {org.departments.map((d) => (
                <View key={d} style={styles.deptCard}>
                  <MaterialCommunityIcons name="briefcase-variant-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.deptText}>{d}</Text>
                </View>
              ))}
            </View>
          )}
          {tab === "reviews" && (
            <View style={{ marginTop: SPACING.md }}>
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
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL(`tel:${org.phone.replace(/\s/g, "")}`)}
          testID="org-call-button"
        >
          <MaterialCommunityIcons name="phone" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(org.address + ", " + org.city)}`)}
          testID="org-directions-button"
        >
          <MaterialCommunityIcons name="map-marker-radius" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <GradientButton
          label={tr(language, "bookAppointment")}
          onPress={() => linkedDoctors[0] ? router.push(`/(patient)/booking/${linkedDoctors[0].id}` as any) : router.push("/(patient)/doctors")}
          icon="calendar-check"
          style={{ flex: 1, marginLeft: SPACING.md }}
          testID="org-book-button"
        />
      </View>
    </SafeAreaView>
  );
}

function Row({ icon, text, onPress }: { icon: any; text: string; onPress?: () => void }) {
  const C: any = onPress ? TouchableOpacity : View;
  return (
    <C onPress={onPress} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
      <MaterialCommunityIcons name={icon} size={16} color={COLORS.primary} />
      <Text style={{ marginLeft: 10, fontSize: 13, color: COLORS.text.primary }}>{text}</Text>
    </C>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { width: "100%", height: 200 },
  name: { fontSize: 22, fontWeight: "800", color: COLORS.text.primary, flex: 1, marginRight: 8 },
  type: { fontSize: 13, color: COLORS.text.secondary, marginTop: 2 },
  subText: { fontSize: 12, color: COLORS.text.tertiary },
  dot: { color: COLORS.text.tertiary, marginHorizontal: 6 },
  body: { fontSize: 13, color: COLORS.text.secondary, lineHeight: 20 },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft, marginTop: SPACING.lg },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabText: { fontSize: 13, fontWeight: "600", color: COLORS.text.secondary },
  docRow: { flexDirection: "row", alignItems: "center", padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, ...SHADOW.card },
  docImg: { width: 56, height: 56, borderRadius: 28 },
  docName: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  docSpec: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  deptCard: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: RADIUS.lg, backgroundColor: COLORS.surface, ...SHADOW.card },
  deptText: { fontSize: 12, color: COLORS.text.primary, marginLeft: 8, fontWeight: "600" },
  reviewRow: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  reviewAuthor: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  reviewDate: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2, marginBottom: 4 },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: COLORS.surface, padding: SPACING.lg, flexDirection: "row", alignItems: "center", gap: 10, borderTopWidth: 1, borderTopColor: COLORS.borderSoft },
  callBtn: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg, ...SHADOW.card },
});
