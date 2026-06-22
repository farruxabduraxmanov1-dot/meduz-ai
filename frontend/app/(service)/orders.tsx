// Service orders
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, ScreenHeader, ChipsRow, Tag, MaterialCommunityIcons, RatingStars } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { SERVICE_DEMO, generateReviews } from "@/src/data/demo";

type Tab = "active" | "completed" | "reviews";

const COMPLETED = [
  { id: "c1", client: "Aziza K.", service: "IV Therapy", date: "Today 09:00", earned: 150 },
  { id: "c2", client: "Bobur T.", service: "Dressing", date: "Yesterday", earned: 60 },
  { id: "c3", client: "Madina E.", service: "Injection", date: "Yesterday", earned: 50 },
  { id: "c4", client: "Sherzod K.", service: "Wound care", date: "2 days ago", earned: 110 },
  { id: "c5", client: "Lola I.", service: "Lab sample", date: "3 days ago", earned: 40 },
];

export default function ServiceOrders() {
  const { language } = useAppState();
  const [tab, setTab] = useState<Tab>("active");
  const reviews = generateReviews(77, 5);
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "orders")} back />
      <ChipsRow
        items={[
          { value: "active", label: "Active", icon: "play-circle" },
          { value: "completed", label: "Completed", icon: "check-circle" },
          { value: "reviews", label: "Reviews", icon: "star" },
        ]}
        selected={tab}
        onSelect={(v) => setTab(v as Tab)}
        testID="svc-tabs"
      />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}>
        {tab === "active" &&
          SERVICE_DEMO.activeOrders.map((o) => (
            <Card key={o.id} style={{ padding: SPACING.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.client}>{o.client}</Text>
                <Tag label={o.status} color="#fff" background={COLORS.primary} />
              </View>
              <Text style={styles.svc}>{o.service} · {o.time}</Text>
              <View style={{ flexDirection: "row", marginTop: SPACING.sm, gap: 8 }}>
                <TouchableOpacity style={styles.btnP}>
                  <Text style={styles.btnPText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnS}>
                  <Text style={styles.btnSText}>Call client</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        {tab === "completed" &&
          COMPLETED.map((c) => (
            <Card key={c.id} style={{ flexDirection: "row", alignItems: "center", padding: SPACING.md }}>
              <View style={styles.checkRing}>
                <MaterialCommunityIcons name="check" size={18} color={COLORS.success} />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.client}>{c.client}</Text>
                <Text style={styles.svc}>{c.service} · {c.date}</Text>
              </View>
              <Text style={styles.amount}>+{c.earned} 000</Text>
            </Card>
          ))}
        {tab === "reviews" &&
          reviews.map((r) => (
            <Card key={r.id} style={{ padding: SPACING.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.client}>{r.author}</Text>
                <RatingStars rating={r.rating} />
              </View>
              <Text style={styles.svc}>{r.text}</Text>
              <Text style={styles.date}>{r.date}</Text>
            </Card>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  client: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary },
  svc: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4 },
  date: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 6 },
  btnP: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.pill, backgroundColor: COLORS.primary },
  btnPText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  btnS: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.pill, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border },
  btnSText: { color: COLORS.text.primary, fontWeight: "700", fontSize: 12 },
  checkRing: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(16,185,129,0.12)", alignItems: "center", justifyContent: "center" },
  amount: { color: COLORS.success, fontWeight: "800", fontSize: 14 },
});
