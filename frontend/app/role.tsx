// Role selection
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { MaterialCommunityIcons, JellyfishLogo } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState, type Role } from "@/src/store/app-state";

type RoleDef = {
  id: NonNullable<Role>;
  titleKey: "rolePatient" | "roleDoctor" | "roleAdmin" | "roleService";
  descKey: "rolePatientDesc" | "roleDoctorDesc" | "roleAdminDesc" | "roleServiceDesc";
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  gradient: readonly [string, string];
};

const ROLES: RoleDef[] = [
  { id: "patient", titleKey: "rolePatient", descKey: "rolePatientDesc", icon: "account-heart", gradient: ["#3B82F6", "#7C3AED"] },
  { id: "doctor", titleKey: "roleDoctor", descKey: "roleDoctorDesc", icon: "stethoscope", gradient: ["#0EA5E9", "#2563EB"] },
  { id: "admin", titleKey: "roleAdmin", descKey: "roleAdminDesc", icon: "hospital-building", gradient: ["#7C3AED", "#EC4899"] },
  { id: "service", titleKey: "roleService", descKey: "roleServiceDesc", icon: "hand-heart", gradient: ["#10B981", "#0EA5E9"] },
];

export default function RoleScreen() {
  const router = useRouter();
  const { language, setRole, user } = useAppState();

  const handlePick = async (role: NonNullable<Role>) => {
    await setRole(role);
    router.replace(`/(${role})` as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, paddingBottom: SPACING.xxxl }}>
        <View style={{ alignItems: "center", marginBottom: SPACING.xxl }}>
          <JellyfishLogo size={56} />
          <Text style={styles.title}>{tr(language, "chooseRole")}</Text>
          <Text style={styles.sub}>
            {user?.name ? `${tr(language, "welcome")}, ${user.name}` : tr(language, "chooseRoleSub")}
          </Text>
        </View>

        <View style={{ gap: SPACING.md }}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.id}
              activeOpacity={0.9}
              onPress={() => handlePick(r.id)}
              testID={`role-${r.id}`}
              style={styles.roleCard}
            >
              <LinearGradient
                colors={r.gradient as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconWrap}
              >
                <MaterialCommunityIcons name={r.icon} size={28} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1, marginLeft: SPACING.lg }}>
                <Text style={styles.roleTitle}>{tr(language, r.titleKey)}</Text>
                <Text style={styles.roleDesc}>{tr(language, r.descKey)}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={COLORS.text.tertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.text.primary, marginTop: SPACING.lg, textAlign: "center" },
  sub: { fontSize: 14, color: COLORS.text.secondary, marginTop: 6, textAlign: "center" },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    ...SHADOW.card,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  roleTitle: { fontSize: 17, fontWeight: "700", color: COLORS.text.primary },
  roleDesc: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4, lineHeight: 16 },
});
