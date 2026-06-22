// Auth — mocked phone + Google
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { GradientButton, JellyfishLogo, Ionicons, MaterialCommunityIcons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function AuthScreen() {
  const router = useRouter();
  const { language, signIn } = useAppState();
  const [phone, setPhone] = useState("+998 ");
  const [loading, setLoading] = useState<"phone" | "google" | null>(null);

  const handlePhone = async () => {
    if (phone.replace(/\D/g, "").length < 9) return;
    router.push({ pathname: "/otp", params: { phone } });
  };

  const handleGoogle = async () => {
    setLoading("google");
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/mock-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "google", email: "demo.user@gmail.com", name: "Demo User" }),
      });
      const data = await res.json();
      await signIn({ name: data.name, method: "google", userId: data.user_id });
      router.replace("/role");
    } catch (e) {
      // fallback offline mock
      await signIn({ name: "Demo User", method: "google" });
      router.replace("/role");
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: SPACING.xl, paddingTop: SPACING.xxxl, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: "center", marginBottom: SPACING.xxl }}>
            <JellyfishLogo size={72} />
            <Text style={styles.title}>{tr(language, "appName")}</Text>
            <Text style={styles.sub}>{tr(language, "welcomeBack")}</Text>
          </View>

          <Text style={styles.label}>{tr(language, "phoneNumber")}</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="call-outline" size={20} color={COLORS.text.tertiary} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder={tr(language, "enterPhone")}
              placeholderTextColor={COLORS.text.tertiary}
              keyboardType="phone-pad"
              testID="phone-input"
            />
          </View>

          <GradientButton
            label={tr(language, "sendCode")}
            onPress={handlePhone}
            size="lg"
            style={{ marginTop: SPACING.lg }}
            testID="phone-send-code-button"
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{tr(language, "orContinueWith")}</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            onPress={handleGoogle}
            activeOpacity={0.85}
            disabled={loading === "google"}
            style={styles.googleBtn}
            testID="google-signin-button"
          >
            <MaterialCommunityIcons name="google" size={22} color="#EA4335" />
            <Text style={styles.googleText}>{tr(language, "continueGoogle")}</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <Text style={styles.legal}>
            By continuing you agree to our Terms of Service & Privacy Policy. {tr(language, "sessionSavedDemo")}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.text.primary, marginTop: SPACING.lg },
  sub: { fontSize: 14, color: COLORS.text.secondary, marginTop: 6 },
  label: { fontSize: 13, fontWeight: "600", color: COLORS.text.secondary, marginBottom: SPACING.sm, marginTop: SPACING.md },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: { flex: 1, marginLeft: SPACING.sm, fontSize: 16, color: COLORS.text.primary },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: SPACING.xxl },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.text.tertiary, fontSize: 12, marginHorizontal: SPACING.md },
  googleBtn: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    ...SHADOW.card,
  },
  googleText: { marginLeft: SPACING.sm, fontSize: 16, fontWeight: "700", color: COLORS.text.primary },
  legal: { fontSize: 11, color: COLORS.text.tertiary, textAlign: "center", marginTop: SPACING.xl },
});
