// Admin: departments
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, ScreenHeader, MaterialCommunityIcons, GradientButton } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";

const DEPTS = [
  { id: "d1", name: "Cardiology", doctors: 12, icon: "heart-pulse", color: "#EF4444" },
  { id: "d2", name: "Pediatrics", doctors: 18, icon: "baby-face-outline", color: "#F59E0B" },
  { id: "d3", name: "Surgery", doctors: 14, icon: "needle", color: "#7C3AED" },
  { id: "d4", name: "Neurology", doctors: 9, icon: "brain", color: "#3B82F6" },
  { id: "d5", name: "ENT", doctors: 7, icon: "ear-hearing", color: "#10B981" },
  { id: "d6", name: "Plastic Surgery", doctors: 5, icon: "face-woman", color: "#EC4899" },
  { id: "d7", name: "Orthopedics", doctors: 11, icon: "bone", color: "#0EA5E9" },
  { id: "d8", name: "Dermatology", doctors: 8, icon: "lotion", color: "#F97316" },
  { id: "d9", name: "Gynecology", doctors: 13, icon: "human-female", color: "#A855F7" },
  { id: "d10", name: "Emergency", doctors: 16, icon: "ambulance", color: "#DC2626" },
];

export default function AdminDepartments() {
  const { language } = useAppState();
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "departments")} back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, paddingBottom: 120 }}>
        <View style={styles.grid}>
          {DEPTS.map((d) => (
            <Card key={d.id} style={styles.deptCard}>
              <View style={[styles.iconWrap, { backgroundColor: `${d.color}14` }]}>
                <MaterialCommunityIcons name={d.icon as any} size={26} color={d.color} />
              </View>
              <Text style={styles.deptName}>{d.name}</Text>
              <Text style={styles.deptSub}>{d.doctors} doctors</Text>
            </Card>
          ))}
        </View>
        <GradientButton label="Add department" icon="plus" size="lg" onPress={() => {}} style={{ marginTop: SPACING.lg }} testID="admin-add-department" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md },
  deptCard: { width: "47%", padding: SPACING.lg, alignItems: "center" },
  iconWrap: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: SPACING.md },
  deptName: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary, textAlign: "center" },
  deptSub: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
});
