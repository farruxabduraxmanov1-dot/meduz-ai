// Home Medical Assistance — service catalog + request flow
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Card, ScreenHeader, GradientButton, Tag, MaterialCommunityIcons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { HOME_CARE_SERVICES, HOME_CARE_REQUESTS } from "@/src/data/demo";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const TIMES = ["ASAP", "In 1 hour", "Today 18:00", "Tomorrow 10:00", "Choose…"];

export default function HomeCare() {
  const router = useRouter();
  const { language, user } = useAppState();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<string>(HOME_CARE_SERVICES[0].id);
  const [address, setAddress] = useState("");
  const [time, setTime] = useState(TIMES[0]);
  const [phone, setPhone] = useState("+998 ");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState<{ id: string; eta_minutes: number; service: string } | null>(null);

  const svc = HOME_CARE_SERVICES.find((s) => s.id === selectedService)!;

  const submit = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/home-visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: svc.name,
          address,
          preferred_time: time,
          phone,
          notes,
          patient_name: user?.name || "Demo Patient",
        }),
      });
      const data = await res.json();
      setSubmitted({ id: data.id, eta_minutes: data.eta_minutes || 35, service: svc.name });
    } catch {
      setSubmitted({ id: `req-${Date.now()}`, eta_minutes: 35, service: svc.name });
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.center}>
          <LinearGradient colors={["#10B981", "#059669"]} style={styles.ring}>
            <MaterialCommunityIcons name="check-bold" size={56} color="#fff" />
          </LinearGradient>
          <Text style={styles.successTitle}>{tr(language, "requestSubmitted")}</Text>
          <Text style={styles.successSub}>{tr(language, "requestSubmittedSub")}</Text>
          <Card style={{ marginTop: SPACING.xl, width: "100%" }}>
            <Row label="Service" value={submitted.service} />
            <Row label="ETA" value={`${submitted.eta_minutes} minutes`} />
            <Row label="Request ID" value={submitted.id.slice(0, 12)} />
          </Card>
          <GradientButton
            label={tr(language, "backHome")}
            onPress={() => router.replace("/(patient)")}
            icon="home"
            size="lg"
            style={{ marginTop: SPACING.xxxl, alignSelf: "stretch" }}
            testID="home-care-back-home"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "homeCare")} back />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg, paddingBottom: 120 }}>
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

          <Card>
            <Text style={styles.section}>Recent requests (demo)</Text>
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
      <Text style={{ fontSize: 13, fontWeight: "700", color: COLORS.text.primary }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xl },
  ring: { width: 120, height: 120, borderRadius: 60, alignItems: "center", justifyContent: "center", ...SHADOW.floating },
  successTitle: { fontSize: 24, fontWeight: "800", color: COLORS.text.primary, marginTop: SPACING.xl, textAlign: "center" },
  successSub: { fontSize: 14, color: COLORS.text.secondary, marginTop: 8, textAlign: "center" },
  section: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary, marginTop: SPACING.md, marginBottom: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: SPACING.sm },
  serviceCell: { width: "31%", padding: SPACING.md, borderRadius: 14, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, alignItems: "center" },
  serviceName: { fontSize: 11, color: COLORS.text.secondary, marginTop: 6, textAlign: "center", lineHeight: 14 },
  servicePrice: { fontSize: 10, color: COLORS.primary, marginTop: 4, fontWeight: "700" },
  input: { backgroundColor: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 14, color: COLORS.text.primary },
  timeChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  timeChipText: { fontSize: 12, fontWeight: "600", color: COLORS.text.secondary },
  recRow: { flexDirection: "row", alignItems: "center", paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  recName: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  recDate: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, padding: SPACING.lg, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.borderSoft, flexDirection: "row", alignItems: "center" },
});
