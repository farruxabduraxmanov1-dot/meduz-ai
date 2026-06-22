// Booking flow
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Card, ScreenHeader, GradientButton, MaterialCommunityIcons, Tag } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { DOCTORS } from "@/src/data/demo";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const DAYS_AHEAD = 14;
const TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "16:00", "17:00"];

function buildDates() {
  const out: { date: Date; key: string; day: string; date_short: string }[] = [];
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push({
      date: d,
      key: d.toISOString().slice(0, 10),
      day: labels[d.getDay()],
      date_short: `${d.getDate()}`,
    });
  }
  return out;
}

export default function Booking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language, user } = useAppState();
  const doctor = DOCTORS.find((d) => d.id === id) || DOCTORS[0];

  const dates = buildDates();
  const [date, setDate] = useState(dates[1].key);
  const [time, setTime] = useState("10:00");
  const [type, setType] = useState<"online" | "offline" | "home">("offline");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      await fetch(`${BACKEND_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: doctor.id,
          doctor_name: doctor.name,
          patient_name: user?.name || "Demo Patient",
          date,
          time,
          consultation_type: type,
          notes,
        }),
      });
    } catch {
      // continue with success screen anyway (demo)
    }
    setLoading(false);
    router.replace({
      pathname: "/(patient)/booking-confirmed",
      params: {
        doctor: doctor.name,
        date,
        time,
        type,
      },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "bookAppointment")} back />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg, paddingBottom: 120 }}>
          <Card style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={{ uri: doctor.photo }} style={styles.docImg} />
            <View style={{ marginLeft: SPACING.md, flex: 1 }}>
              <Text style={styles.docName}>{doctor.name}</Text>
              <Text style={styles.docSpec}>{doctor.specialty}</Text>
              <Text style={styles.price}>{doctor.price} 000 UZS</Text>
            </View>
          </Card>

          <Card>
            <Text style={styles.section}>{tr(language, "selectDate")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: SPACING.sm }}>
              {dates.map((d) => {
                const active = d.key === date;
                return (
                  <TouchableOpacity
                    key={d.key}
                    onPress={() => setDate(d.key)}
                    testID={`date-${d.key}`}
                    style={[styles.dateChip, active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
                  >
                    <Text style={[styles.dateDay, active && { color: "#fff" }]}>{d.day}</Text>
                    <Text style={[styles.dateNum, active && { color: "#fff" }]}>{d.date_short}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Card>

          <Card>
            <Text style={styles.section}>{tr(language, "selectTime")}</Text>
            <View style={styles.timesGrid}>
              {TIMES.map((tm) => {
                const active = tm === time;
                return (
                  <TouchableOpacity
                    key={tm}
                    onPress={() => setTime(tm)}
                    testID={`time-${tm}`}
                    style={[styles.timeChip, active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
                  >
                    <Text style={[styles.timeText, active && { color: "#fff" }]}>{tm}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          <Card>
            <Text style={styles.section}>{tr(language, "consultationType")}</Text>
            <View style={{ gap: SPACING.sm, marginTop: SPACING.sm }}>
              {([
                { value: "online", label: tr(language, "consultationOnline"), icon: "video", disabled: !doctor.online },
                { value: "offline", label: tr(language, "consultationOffline"), icon: "hospital-building", disabled: !doctor.offline },
                { value: "home", label: tr(language, "consultationHome"), icon: "home-heart", disabled: !doctor.homeVisit },
              ] as const).map((opt) => {
                const active = opt.value === type;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => !opt.disabled && setType(opt.value)}
                    activeOpacity={opt.disabled ? 1 : 0.85}
                    style={[styles.typeRow, active && { borderColor: COLORS.primary, backgroundColor: "rgba(37,99,235,0.05)" }, opt.disabled && { opacity: 0.35 }]}
                    testID={`type-${opt.value}`}
                  >
                    <MaterialCommunityIcons name={opt.icon as any} size={20} color={active ? COLORS.primary : COLORS.text.secondary} />
                    <Text style={[styles.typeLabel, active && { color: COLORS.primary, fontWeight: "700" }]}>{opt.label}</Text>
                    {active && <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          <Card>
            <Text style={styles.section}>{tr(language, "notes")}</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Brief reason for the visit…"
              placeholderTextColor={COLORS.text.tertiary}
              style={styles.notes}
              multiline
              testID="booking-notes"
            />
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.footerLabel}>Total</Text>
            <Text style={styles.footerPrice}>{doctor.price} 000 UZS</Text>
          </View>
          <GradientButton
            label={tr(language, "confirm")}
            onPress={confirm}
            disabled={loading}
            icon="calendar-check"
            testID="confirm-booking-button"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  docImg: { width: 60, height: 60, borderRadius: 30 },
  docName: { fontSize: 15, fontWeight: "700", color: COLORS.text.primary },
  docSpec: { fontSize: 12, color: COLORS.text.secondary, marginTop: 2 },
  price: { fontSize: 14, fontWeight: "700", color: COLORS.primary, marginTop: 4 },
  section: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  dateChip: { width: 56, height: 72, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  dateDay: { fontSize: 11, color: COLORS.text.secondary, fontWeight: "600" },
  dateNum: { fontSize: 18, fontWeight: "800", color: COLORS.text.primary, marginTop: 2 },
  timesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: SPACING.sm },
  timeChip: { width: "23%", paddingVertical: 12, alignItems: "center", borderRadius: 14, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  timeText: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  typeRow: { flexDirection: "row", alignItems: "center", padding: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  typeLabel: { flex: 1, fontSize: 13, color: COLORS.text.primary },
  notes: { marginTop: SPACING.sm, minHeight: 80, padding: SPACING.md, backgroundColor: COLORS.bg, borderRadius: RADIUS.md, fontSize: 13, color: COLORS.text.primary, textAlignVertical: "top" },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: COLORS.surface, padding: SPACING.lg, flexDirection: "row", alignItems: "center", gap: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.borderSoft },
  footerLabel: { fontSize: 11, color: COLORS.text.tertiary },
  footerPrice: { fontSize: 16, fontWeight: "800", color: COLORS.text.primary },
});
