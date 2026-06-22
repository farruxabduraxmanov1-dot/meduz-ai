// OTP — mocked
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { GradientButton, ScreenHeader, JellyfishLogo } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function OtpScreen() {
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const router = useRouter();
  const { language, signIn } = useAppState();
  const [code, setCode] = useState(["", "", "", ""]);
  const refs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleChange = (idx: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 1);
    const next = [...code];
    next[idx] = v;
    setCode(next);
    if (v && idx < 3) refs[idx + 1].current?.focus();
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/mock-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "phone", phone, name: undefined }),
      });
      const data = await res.json();
      await signIn({ name: data.name, method: "phone", userId: data.user_id });
      router.replace("/role");
    } catch {
      await signIn({ name: `User ${(phone || "").slice(-4)}`, method: "phone" });
      router.replace("/role");
    } finally {
      setLoading(false);
    }
  };

  const filled = code.every((c) => c.length === 1);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScreenHeader title="" back />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ alignItems: "center", marginTop: SPACING.xl }}>
          <JellyfishLogo size={60} />
        </View>
        <View style={{ padding: SPACING.xl, marginTop: SPACING.md }}>
          <Text style={styles.title}>{tr(language, "verifyOtp")}</Text>
          <Text style={styles.sub}>
            {tr(language, "enterOtp")} {phone ? `→ ${phone}` : ""}
          </Text>
          <View style={styles.codeRow}>
            {code.map((c, i) => (
              <TextInput
                key={i}
                ref={refs[i]}
                style={[styles.codeInput, c.length === 1 && { borderColor: COLORS.primary }]}
                value={c}
                onChangeText={(v) => handleChange(i, v)}
                keyboardType="number-pad"
                maxLength={1}
                testID={`otp-input-${i}`}
              />
            ))}
          </View>
          <Text style={styles.hint}>
            Demo: any 4 digits will verify. Resend in {seconds}s
          </Text>
          <GradientButton
            label={tr(language, "verify")}
            onPress={handleVerify}
            disabled={!filled || loading}
            size="lg"
            style={{ marginTop: SPACING.xxl }}
            testID="otp-verify-button"
          />
          <TouchableOpacity
            onPress={() => setCode(["1", "2", "3", "4"])}
            style={{ marginTop: SPACING.lg, alignItems: "center" }}
          >
            <Text style={{ color: COLORS.primary, fontSize: 13, fontWeight: "600" }}>
              Auto-fill demo OTP (1234)
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  title: { fontSize: 24, fontWeight: "700", color: COLORS.text.primary, textAlign: "center" },
  sub: { fontSize: 13, color: COLORS.text.secondary, marginTop: 8, textAlign: "center" },
  codeRow: { flexDirection: "row", justifyContent: "center", gap: 12, marginTop: SPACING.xxxl },
  codeInput: {
    width: 60,
    height: 64,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  hint: { textAlign: "center", marginTop: SPACING.lg, color: COLORS.text.tertiary, fontSize: 12 },
});
