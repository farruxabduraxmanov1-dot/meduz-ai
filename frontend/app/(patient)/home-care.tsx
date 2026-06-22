// Home Medical Assistance — service catalog + specialist matching + ETA tracking
import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import {
  Card,
  ScreenHeader,
  GradientButton,
  Tag,
  RatingStars,
  MaterialCommunityIcons,
} from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import {
  HOME_CARE_SERVICES,
  HOME_CARE_REQUESTS,
  findSpecialistsForService,
  computeServiceEta,
  HOME_CARE_ETA,
} from "@/src/data/demo";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const TIMES = ["ASAP", "In 1 hour", "Today 18:00", "Tomorrow 10:00", "Choose…"];
type GenderPref = "any" | "male" | "female";

export default function HomeCare() {
  const router = useRouter();
  const { language, user } = useAppState();
  const [selectedService, setSelectedService] = useState<string>(HOME_CARE_SERVICES[0].id);
  const [address, setAddress] = useState("");
  const [time, setTime] = useState(TIMES[0]);
  const [phone, setPhone] = useState("+998 ");
  const [notes, setNotes] = useState("");
  const [genderPref, setGenderPref] = useState<GenderPref>("any");
  const [submitted, setSubmitted] = useState<{
    id: string;
    eta_minutes: number;
    service: string;
    specialistName: string;
    specialistPhoto: string;
    specialistRating: number;
    specialistReviews: number;
    specialistExperience: number;
  } | null>(null);

  const svc = HOME_CARE_SERVICES.find((s) => s.id === selectedService)!;
  const etaRange = HOME_CARE_ETA[selectedService] || { min: 20, max: 45, label: svc.name };

  // Match specialists for this service with gender preference
  const specialists = useMemo(
    () => findSpecialistsForService(selectedService, genderPref),
    [selectedService, genderPref],
  );
  const previewSpecialist = specialists[0];

  const submit = async () => {
    const eta = computeServiceEta(selectedService, address);
    const spec = specialists[0];
    try {
      await fetch(`${BACKEND_URL}/api/home-visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: svc.name,
          address,
          preferred_time: time,
          phone,
          notes,
          patient_name: user?.name || "Demo Patient",
          gender_preference: genderPref,
          eta_minutes: eta,
        }),
      });
    } catch {}
    setSubmitted({
      id: `req-${Date.now()}`,
      eta_minutes: eta,
      service: svc.name,
      specialistName: spec?.name || "Specialist",
      specialistPhoto: spec?.photo || "",
      specialistRating: spec?.rating || 4.8,
      specialistReviews: spec?.reviewsCount || 120,
      specialistExperience: spec?.yearsExp || 7,
    });
  };

  // ===== Success / tracking screen =====
  if (submitted) {
    const role = svc.name.split(" ")[0]; // Doctor / Nurse / etc
    const arrivalCopy = `${role} will arrive in ${submitted.eta_minutes} minutes`;
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title={tr(language, "homeCare")} back />
        <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg, paddingBottom: 32 }}>
          {/* Hero status */}
          <View style={styles.heroCard}>
            <LinearGradient colors={["#10B981", "#059669"]} style={styles.heroRing}>
              <MaterialCommunityIcons name="map-marker-radius" size={36} color="#fff" />
            </LinearGradient>
            <Text style={styles.successTitle}>{tr(language, "requestSubmitted")}</Text>
            <View style={styles.etaPill}>
              <MaterialCommunityIcons name="clock-fast" size={16} color="#fff" />
              <Text style={styles.etaPillText}>{arrivalCopy}</Text>
            </View>
            <Text style={styles.successSub}>
              {tr(language, "requestSubmittedSub")}
            </Text>
          </View>

          {/* Specialist Card */}
          <Card>
            <Text style={styles.sectionTitle}>Your specialist</Text>
            <View style={styles.specRow}>
              {submitted.specialistPhoto ? (
                <Image source={{ uri: submitted.specialistPhoto }} style={styles.specPhoto} />
              ) : (
                <View style={[styles.specPhoto, { backgroundColor: COLORS.surfaceMuted, alignItems: "center", justifyContent: "center" }]}>
                  <MaterialCommunityIcons name="account" size={28} color={COLORS.text.tertiary} />
                </View>
              )}
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.specName}>{submitted.specialistName}</Text>
                <Text style={styles.specType}>{submitted.service}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <RatingStars rating={submitted.specialistRating} count={submitted.specialistReviews} />
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.specExp}>{submitted.specialistExperience} yrs exp</Text>
                </View>
              </View>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} testID="hc-call-specialist">
                <MaterialCommunityIcons name="phone" size={18} color={COLORS.primary} />
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} testID="hc-msg-specialist">
                <MaterialCommunityIcons name="message-text" size={18} color={COLORS.primary} />
                <Text style={styles.actionText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} testID="hc-track-specialist">
                <MaterialCommunityIcons name="map" size={18} color={COLORS.primary} />
                <Text style={styles.actionText}>Track</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Request details */}
          <Card>
            <Text style={styles.sectionTitle}>Request details</Text>
            <Row label="Service" value={submitted.service} />
            <Row label="Address" value={address || "—"} />
            <Row label="Preferred time" value={time} />
            <Row label="Gender preference" value={genderPref === "any" ? "Any" : genderPref === "male" ? "Male" : "Female"} />
            <Row label="Request ID" value={submitted.id.slice(0, 14)} />
          </Card>

          <GradientButton
            label={tr(language, "backHome")}
            onPress={() => router.replace("/(patient)")}
            icon="home"
            size="lg"
            testID="home-care-back-home"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ===== Request form =====
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "homeCare")} back />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg, paddingBottom: 140 }}>
          {/* Service catalog */}
          <Card>
            <Text style={styles.section}>{tr(language, "selectService")}</Text>
            <View style={styles.grid}>
              {HOME_CARE_SERVICES.map((s) => {
                const active = s.id === selectedService;
                return (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => setSelectedService(s.id)}
                    style={[styles.serviceCell, active && { backgroundColor: "rgba(37,99,235,0.08)", borderColor: COLORS.primary }]}
                    testID={`hc-service-${s.id}`}
                  >
                    <MaterialCommunityIcons name={s.icon as any} size={22} color={active ? COLORS.primary : COLORS.text.secondary} />
                    <Text style={[styles.serviceName, active && { color: COLORS.primary, fontWeight: "700" }]} numberOfLines={2}>{s.name}</Text>
                    <Text style={styles.servicePrice}>{s.price} 000 UZS</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {/* Specialist preview matched to service */}
          {previewSpecialist && (
            <Card>
              <Text style={styles.section}>Available specialist</Text>
              <View style={styles.previewWrap}>
                <Image source={{ uri: previewSpecialist.photo }} style={styles.previewPhoto} />
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={styles.previewName}>{previewSpecialist.name}</Text>
                  <Text style={styles.previewType}>{svc.name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                    <RatingStars rating={previewSpecialist.rating} count={previewSpecialist.reviewsCount} />
                    <Text style={styles.dot}>·</Text>
                    <Text style={styles.previewExp}>{previewSpecialist.yearsExp} yrs</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 6, gap: 6, alignItems: "center" }}>
                    <Tag
                      label={`ETA ~${etaRange.min}-${etaRange.max} min`}
                      icon="clock-fast"
                      color={COLORS.success}
                      background="rgba(16,185,129,0.12)"
                    />
                    <Tag
                      label={previewSpecialist.gender === "female" ? "Female" : "Male"}
                      icon={previewSpecialist.gender === "female" ? "human-female" : "human-male"}
                      color={COLORS.text.secondary}
                      background="rgba(15,23,42,0.06)"
                    />
                  </View>
                </View>
              </View>
            </Card>
          )}

          {/* Gender preference */}
          <Card>
            <Text style={styles.section}>Gender preference</Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
              {([
                { value: "any", label: "Any", icon: "account-question" },
                { value: "male", label: "Male", icon: "human-male" },
                { value: "female", label: "Female", icon: "human-female" },
              ] as { value: GenderPref; label: string; icon: any }[]).map((opt) => {
                const active = opt.value === genderPref;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setGenderPref(opt.value)}
                    style={[styles.genderChip, active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
                    testID={`hc-gender-${opt.value}`}
                  >
                    <MaterialCommunityIcons name={opt.icon} size={16} color={active ? "#fff" : COLORS.text.secondary} />
                    <Text style={[styles.genderChipText, active && { color: "#fff" }]}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {/* Address + Phone + Preferred Time */}
          <Card>
            <Text style={styles.section}>{tr(language, "yourAddress")}</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Street, building, apartment"
              placeholderTextColor={COLORS.text.tertiary}
              style={styles.input}
              testID="hc-address"
            />
            <Text style={styles.section}>{tr(language, "phone")}</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder={tr(language, "enterPhone")}
              placeholderTextColor={COLORS.text.tertiary}
              style={styles.input}
              testID="hc-phone"
            />
            <Text style={styles.section}>{tr(language, "preferredTime")}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {TIMES.map((t) => {
                const active = t === time;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTime(t)}
                    style={[styles.timeChip, active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
                    testID={`hc-time-${t}`}
                  >
                    <Text style={[styles.timeChipText, active && { color: "#fff" }]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.section}>{tr(language, "additionalNotes")}</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Special instructions…"
              placeholderTextColor={COLORS.text.tertiary}
              style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
              multiline
              testID="hc-notes"
            />
          </Card>

          {/* Recent demo requests */}
          <Card>
            <Text style={styles.section}>Recent requests</Text>
            {HOME_CARE_REQUESTS.map((r) => (
              <View key={r.id} style={styles.recRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recName}>{r.service}</Text>
                  <Text style={styles.recDate}>{r.date} · {r.patient}</Text>
                </View>
                <Tag
                  label={r.status}
                  color={r.status === "Completed" ? COLORS.success : r.status === "Scheduled" ? COLORS.warning : COLORS.primary}
                  background={r.status === "Completed" ? "rgba(16,185,129,0.10)" : r.status === "Scheduled" ? "rgba(245,158,11,0.10)" : "rgba(37,99,235,0.10)"}
                />
              </View>
            ))}
          </Card>
        </ScrollView>
        <View style={styles.footer}>
          <GradientButton
            label={tr(language, "submitRequest")}
            onPress={submit}
            disabled={!address || phone.replace(/\D/g, "").length < 9}
            icon="send"
            size="lg"
            style={{ flex: 1 }}
            testID="hc-submit"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft }}>
      <Text style={{ fontSize: 12, color: COLORS.text.tertiary }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: "700", color: COLORS.text.primary, maxWidth: "60%", textAlign: "right" }} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  // success / tracking
  heroCard: { alignItems: "center", padding: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, ...SHADOW.card },
  heroRing: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center", ...SHADOW.floating },
  successTitle: { fontSize: 20, fontWeight: "800", color: COLORS.text.primary, marginTop: SPACING.md, textAlign: "center" },
  etaPill: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, marginTop: SPACING.md, gap: 6 },
  etaPillText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  successSub: { fontSize: 13, color: COLORS.text.secondary, marginTop: SPACING.sm, textAlign: "center" },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary, marginBottom: 6 },
  specRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.sm },
  specPhoto: { width: 64, height: 64, borderRadius: 32 },
  specName: { fontSize: 15, fontWeight: "800", color: COLORS.text.primary },
  specType: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  specExp: { fontSize: 11, color: COLORS.text.tertiary },
  actionRow: { flexDirection: "row", gap: 8, marginTop: SPACING.md, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.borderSoft },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: "rgba(37,99,235,0.08)", gap: 6 },
  actionText: { color: COLORS.primary, fontSize: 12, fontWeight: "700" },
  dot: { color: COLORS.text.tertiary, marginHorizontal: 6 },
  // form
  section: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary, marginTop: SPACING.md, marginBottom: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: SPACING.sm },
  serviceCell: { width: "31%", padding: SPACING.md, borderRadius: 14, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, alignItems: "center" },
  serviceName: { fontSize: 11, color: COLORS.text.secondary, marginTop: 6, textAlign: "center", lineHeight: 14 },
  servicePrice: { fontSize: 10, color: COLORS.primary, marginTop: 4, fontWeight: "700" },
  previewWrap: { flexDirection: "row", alignItems: "center" },
  previewPhoto: { width: 64, height: 64, borderRadius: 14 },
  previewName: { fontSize: 14, fontWeight: "800", color: COLORS.text.primary },
  previewType: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  previewExp: { fontSize: 11, color: COLORS.text.tertiary },
  genderChip: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: RADIUS.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, gap: 6 },
  genderChipText: { fontSize: 12, fontWeight: "700", color: COLORS.text.secondary },
  input: { backgroundColor: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 14, color: COLORS.text.primary },
  timeChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  timeChipText: { fontSize: 12, fontWeight: "600", color: COLORS.text.secondary },
  recRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  recName: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  recDate: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, padding: SPACING.lg, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.borderSoft, flexDirection: "row", alignItems: "center" },
});
