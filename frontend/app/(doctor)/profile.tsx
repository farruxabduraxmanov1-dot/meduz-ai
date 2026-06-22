// Doctor profile / settings
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Card, ScreenHeader, GradientButton, RatingStars, Tag, MaterialCommunityIcons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { DOCTOR_DEMO, generateReviews } from "@/src/data/demo";

export default function DoctorProfileSettings() {
  const router = useRouter();
  const { language, signOut } = useAppState();
  const d = DOCTOR_DEMO;
  const [online, setOnline] = useState(true);
  const [offline, setOffline] = useState(true);
  const [home, setHome] = useState(false);
  const [price, setPrice] = useState("250");
  const reviews = generateReviews(99, 4);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="Profile & Settings" back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg }}>
        <Card style={{ alignItems: "center" }}>
          <Image source={{ uri: d.photo }} style={styles.avatar} />
          <Text style={styles.name}>{d.name}</Text>
          <Text style={styles.spec}>{d.specialty}</Text>
          <RatingStars rating={d.rating} count={d.reviewsCount} style={{ marginTop: 6 }} />
          <Tag label="Verified" icon="check-decagram" color="#fff" background={COLORS.success} style={{ marginTop: 8 }} />
        </Card>

        <Card>
          <Text style={styles.section}>Consultation modes</Text>
          <ToggleRow icon="video" label="Online consultations" value={online} onChange={setOnline} />
          <ToggleRow icon="hospital-building" label="Offline visits" value={offline} onChange={setOffline} />
          <ToggleRow icon="home-heart" label="Home visits" value={home} onChange={setHome} />
          <Text style={styles.section}>Price (UZS thousands)</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="number-pad"
            style={styles.input}
            testID="doc-price-input"
          />
        </Card>

        <Card>
          <Text style={styles.section}>Workplaces</Text>
          <Text style={styles.body}>Primary: Medion Private Clinic</Text>
          <Text style={styles.body}>Secondary: Andijan Regional Hospital</Text>
          <TouchableOpacity style={styles.linkBtn}>
            <MaterialCommunityIcons name="plus" size={16} color={COLORS.primary} />
            <Text style={styles.linkText}>Link another organization</Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Text style={styles.section}>Certificates</Text>
          {["Diploma — Tashkent Medical Academy", "Board cert. Cardiology", "ESC Member"].map((c) => (
            <View key={c} style={styles.certRow}>
              <MaterialCommunityIcons name="certificate" size={16} color={COLORS.primary} />
              <Text style={styles.body}>{c}</Text>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.section}>Patient reviews</Text>
          {reviews.map((r) => (
            <View key={r.id} style={styles.reviewRow}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.author}>{r.author}</Text>
                <RatingStars rating={r.rating} />
              </View>
              <Text style={styles.reviewDate}>{r.date}</Text>
              <Text style={styles.body}>{r.text}</Text>
            </View>
          ))}
        </Card>

        <GradientButton label="Save changes" onPress={() => router.back()} icon="content-save" testID="doc-save" />
        <TouchableOpacity onPress={async () => { await signOut(); router.replace("/auth"); }} style={styles.signOut} testID="doc-sign-out">
          <Text style={styles.signOutText}>{tr(language, "signOut")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({ icon, label, value, onChange }: { icon: any; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <MaterialCommunityIcons name={icon} size={18} color={value ? COLORS.primary : COLORS.text.tertiary} />
      <Text style={[styles.toggleLabel, value && { color: COLORS.text.primary, fontWeight: "700" }]}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: "#E5E7EB", true: COLORS.primary }} thumbColor="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  name: { fontSize: 18, fontWeight: "800", color: COLORS.text.primary, marginTop: SPACING.md },
  spec: { fontSize: 13, color: COLORS.text.secondary, marginTop: 4 },
  section: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary, marginTop: SPACING.md, marginBottom: 8 },
  body: { fontSize: 13, color: COLORS.text.secondary, lineHeight: 20 },
  toggleRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 10 },
  toggleLabel: { flex: 1, fontSize: 13, color: COLORS.text.secondary },
  input: { backgroundColor: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 14, fontWeight: "600", color: COLORS.text.primary },
  linkBtn: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 6 },
  linkText: { color: COLORS.primary, fontWeight: "700", fontSize: 13 },
  certRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6 },
  reviewRow: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  author: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  reviewDate: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2, marginBottom: 4 },
  signOut: { alignItems: "center", padding: SPACING.md },
  signOutText: { fontSize: 14, color: COLORS.danger, fontWeight: "700" },
});
