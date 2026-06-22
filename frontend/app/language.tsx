// Language selection
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { GradientButton, JellyfishLogo, Card, Ionicons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { LANGUAGES, type LanguageCode, tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";

export default function LanguageScreen() {
  const router = useRouter();
  const { setLanguage, language } = useAppState();
  const [picked, setPicked] = useState<LanguageCode>(language || "en");

  const handleContinue = async () => {
    await setLanguage(picked);
    router.replace("/auth");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, paddingTop: SPACING.xxl }}>
        <View style={styles.header}>
          <JellyfishLogo size={64} />
          <Text style={styles.title}>{tr(picked, "chooseLanguage")}</Text>
          <Text style={styles.sub}>MedUZ AI</Text>
        </View>

        <View style={{ marginTop: SPACING.xxxl, gap: SPACING.md }}>
          {LANGUAGES.map((lang) => {
            const active = lang.code === picked;
            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.9}
                onPress={() => setPicked(lang.code)}
                testID={`language-${lang.code}`}
                style={[
                  styles.langCard,
                  active && { borderColor: COLORS.primary, backgroundColor: "rgba(37,99,235,0.05)" },
                ]}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <View style={{ flex: 1, marginLeft: SPACING.md }}>
                  <Text style={styles.langNative}>{lang.native}</Text>
                  <Text style={styles.langLabel}>{lang.label}</Text>
                </View>
                {active ? (
                  <View style={styles.check}>
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  </View>
                ) : (
                  <View style={styles.radio} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <GradientButton
          label={tr(picked, "continue")}
          onPress={handleContinue}
          size="lg"
          icon="arrow-right"
          testID="language-continue-button"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { alignItems: "center", marginTop: SPACING.lg },
  title: { fontSize: 24, fontWeight: "700", color: COLORS.text.primary, marginTop: SPACING.lg },
  sub: { fontSize: 13, color: COLORS.text.secondary, marginTop: 4 },
  langCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: "transparent",
    ...SHADOW.card,
  },
  flag: { fontSize: 36 },
  langNative: { fontSize: 17, fontWeight: "700", color: COLORS.text.primary },
  langLabel: { fontSize: 12, color: COLORS.text.tertiary, marginTop: 2 },
  check: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  radio: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: COLORS.border },
  footer: { padding: SPACING.xl },
});
