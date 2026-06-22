// Patient profile
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Card, ScreenHeader, Avatar, GradientButton, MaterialCommunityIcons, Tag } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS } from "@/src/theme";
import { tr, LANGUAGES, type LanguageCode } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";

const MENU = [
  { icon: "calendar-check", label: "My Appointments", route: null },
  { icon: "history", label: "Chat History", route: null },
  { icon: "heart-pulse", label: "Health Records", route: null },
  { icon: "credit-card", label: "Payments", route: null },
  { icon: "shield-check", label: "Privacy", route: null },
  { icon: "help-circle-outline", label: "Help", route: null },
];

export default function PatientProfile() {
  const router = useRouter();
  const { language, user, signOut, setLanguage, setRole } = useAppState();

  const handleSwitchRole = async () => {
    await setRole(null);
    router.replace("/role");
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "profile")} back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg }}>
        <Card style={{ alignItems: "center", padding: SPACING.xl }}>
          <Avatar name={user?.name || "User"} size={80} />
          <Text style={styles.name}>{user?.name || "Guest"}</Text>
          <Text style={styles.method}>via {user?.method || "demo"}</Text>
          <Tag label="Demo Account" color="#fff" background={COLORS.primary} style={{ marginTop: SPACING.md }} />
        </Card>

        <Card>
          <Text style={styles.section}>Language</Text>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            {LANGUAGES.map((l) => {
              const active = l.code === language;
              return (
                <TouchableOpacity
                  key={l.code}
                  onPress={() => setLanguage(l.code as LanguageCode)}
                  style={[styles.langChip, active && { borderColor: COLORS.primary, backgroundColor: "rgba(37,99,235,0.06)" }]}
                  testID={`profile-lang-${l.code}`}
                >
                  <Text style={{ fontSize: 18 }}>{l.flag}</Text>
                  <Text style={{ marginLeft: 6, fontWeight: "600", color: active ? COLORS.primary : COLORS.text.primary, fontSize: 13 }}>
                    {l.native}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <Card style={{ padding: 0 }}>
          {MENU.map((m, i) => (
            <TouchableOpacity key={m.label} style={[styles.menuRow, i === MENU.length - 1 && { borderBottomWidth: 0 }]}>
              <MaterialCommunityIcons name={m.icon as any} size={20} color={COLORS.primary} />
              <Text style={styles.menuLabel}>{m.label}</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.text.tertiary} />
            </TouchableOpacity>
          ))}
        </Card>

        <GradientButton
          label="Switch Role"
          onPress={handleSwitchRole}
          variant="secondary"
          icon="account-switch"
          testID="switch-role-button"
        />
        <TouchableOpacity onPress={handleSignOut} style={styles.signOut} testID="sign-out-button">
          <Text style={styles.signOutText}>{tr(language, "signOut")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  name: { fontSize: 20, fontWeight: "800", color: COLORS.text.primary, marginTop: SPACING.md },
  method: { fontSize: 12, color: COLORS.text.tertiary, marginTop: 2 },
  section: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  langChip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, borderRadius: RADIUS.lg, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, flex: 1, justifyContent: "center" },
  menuRow: { flexDirection: "row", alignItems: "center", padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  menuLabel: { flex: 1, marginLeft: 12, fontSize: 14, color: COLORS.text.primary, fontWeight: "500" },
  signOut: { alignItems: "center", padding: SPACING.md, marginTop: SPACING.lg },
  signOutText: { fontSize: 14, color: COLORS.danger, fontWeight: "700" },
});
