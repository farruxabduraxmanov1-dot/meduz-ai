// MedUZ AI — Splash screen with jellyfish logo (routes based on saved state)
import { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { JellyfishLogo } from "@/src/components/ui";
import { useAppState } from "@/src/store/app-state";
import { tr } from "@/src/i18n";

const { width } = Dimensions.get("window");

export default function Splash() {
  const router = useRouter();
  const { hydrated, language, isAuthenticated, role } = useAppState();

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      if (!language) {
        router.replace("/language");
      } else if (!isAuthenticated) {
        router.replace("/language");
      } else if (!role) {
        router.replace("/role");
      } else {
        router.replace(`/(${role})` as any);
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [hydrated, language, isAuthenticated, role, router]);

  return (
    <LinearGradient
      colors={["#2563EB", "#6366F1", "#7C3AED"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
      testID="splash-screen"
    >
      <View style={styles.center}>
        <JellyfishLogo size={Math.min(width * 0.42, 180)} />
        <Text style={styles.title}>MedUZ AI</Text>
        <Text style={styles.subtitle}>{tr("en", "tagline")}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Your Intelligent Healthcare Ecosystem</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  center: { alignItems: "center" },
  title: { fontSize: 42, fontWeight: "800", color: "#fff", marginTop: 28, letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 10, fontWeight: "500" },
  footer: { position: "absolute", bottom: 48, alignItems: "center" },
  footerText: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
});
