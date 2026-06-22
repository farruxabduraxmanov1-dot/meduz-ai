// AI Chat — ChatGPT-style with multilingual responses + image upload + quick actions
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import {
  ScreenHeader,
  Card,
  Tag,
  JellyfishLogo,
  MaterialCommunityIcons,
  Ionicons,
  GradientButton,
} from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { CHAT_HISTORY } from "@/src/data/demo";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type Msg = { id: string; role: "user" | "assistant"; text: string; image?: string; urgency?: string };

const URGENCY_COLOR: Record<string, string> = {
  EMERGENCY: COLORS.danger,
  HIGH: "#F97316",
  MEDIUM: COLORS.warning,
  LOW: COLORS.success,
};

export default function AiChat() {
  const router = useRouter();
  const { language } = useAppState();
  const sessionIdRef = useRef(`sess-${Date.now()}`);
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [lastSuggestions, setLastSuggestions] = useState<string[]>([]);

  const suggested = [
    tr(language, "promptChildFever"),
    tr(language, "promptHeadache"),
    tr(language, "promptBurn"),
    tr(language, "promptAbdominal"),
  ];

  const send = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;
    const userMsg: Msg = { id: `m-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          text,
          language,
          role: "patient",
        }),
      });
      const data = await res.json();
      const aiMsg: Msg = {
        id: `m-${Date.now() + 1}`,
        role: "assistant",
        text: data.reply || "…",
        urgency: data.urgency,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLastSuggestions(data.suggestions || []);
    } catch (e) {
      const aiMsg: Msg = {
        id: `m-${Date.now() + 2}`,
        role: "assistant",
        text: "Unable to reach AI service. Demo mode: please consult a doctor immediately for serious symptoms.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const empty = messages.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader
        title={tr(language, "aiChat")}
        subtitle="MedUZ AI · Claude Sonnet 4.5"
        back
        right={
          <TouchableOpacity
            onPress={() => setShowHistory((s) => !s)}
            style={styles.iconBtn}
            testID="toggle-history"
          >
            <MaterialCommunityIcons name="history" size={20} color={COLORS.text.primary} />
          </TouchableOpacity>
        }
      />
      {showHistory ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}>
          <Text style={styles.sectionTitle}>{tr(language, "chatHistory")}</Text>
          <TouchableOpacity
            onPress={() => {
              sessionIdRef.current = `sess-${Date.now()}`;
              setMessages([]);
              setLastSuggestions([]);
              setShowHistory(false);
            }}
            style={styles.newChatBtn}
            testID="new-chat"
          >
            <MaterialCommunityIcons name="plus-circle" size={20} color={COLORS.primary} />
            <Text style={{ marginLeft: 8, color: COLORS.primary, fontWeight: "700" }}>{tr(language, "newChat")}</Text>
          </TouchableOpacity>
          {CHAT_HISTORY.map((h) => (
            <Card key={h.id} onPress={() => setShowHistory(false)} testID={`history-${h.id}`} style={{ padding: SPACING.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.histTitle} numberOfLines={1}>{h.title}</Text>
                <Text style={styles.histDate}>{h.date}</Text>
              </View>
              <Text style={styles.histMsg} numberOfLines={1}>{h.lastMessage}</Text>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={20}>
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: SPACING.xl, paddingBottom: SPACING.xxxl }}
          >
            {empty && (
              <View style={styles.welcome}>
                <JellyfishLogo size={64} />
                <Text style={styles.welcomeTitle}>{tr(language, "aiCardTitle")}</Text>
                <Text style={styles.welcomeSub}>{tr(language, "aiCardSub")}</Text>
                <Text style={[styles.disclaimer, { marginTop: SPACING.lg }]}>
                  {tr(language, "disclaimer")}
                </Text>
                <Text style={[styles.sectionTitle, { marginTop: SPACING.xxl, marginBottom: SPACING.md, alignSelf: "flex-start" }]}>
                  {tr(language, "suggestedPrompts")}
                </Text>
                <View style={{ gap: 10, width: "100%" }}>
                  {suggested.map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => send(s)}
                      style={styles.suggestedItem}
                      testID={`suggested-${s.slice(0, 16)}`}
                    >
                      <MaterialCommunityIcons name="message-text-outline" size={18} color={COLORS.primary} />
                      <Text style={{ flex: 1, marginLeft: 10, fontSize: 14, color: COLORS.text.primary }} numberOfLines={2}>{s}</Text>
                      <MaterialCommunityIcons name="arrow-up-right" size={16} color={COLORS.text.tertiary} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {messages.map((m) => (
              <View key={m.id} style={[styles.bubbleWrap, m.role === "user" ? { alignItems: "flex-end" } : { alignItems: "flex-start" }]}>
                {m.role === "assistant" && (
                  <View style={styles.aiBadge}>
                    <JellyfishLogo size={20} glow={false} />
                    <Text style={styles.aiBadgeText}>MedUZ AI</Text>
                    {m.urgency && (
                      <Tag
                        label={m.urgency}
                        color="#fff"
                        background={URGENCY_COLOR[m.urgency] || COLORS.primary}
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </View>
                )}
                <View style={[styles.bubble, m.role === "user" ? styles.userBubble : styles.aiBubble]}>
                  <Text style={[styles.bubbleText, m.role === "user" ? { color: "#fff" } : {}]}>{m.text}</Text>
                </View>
                {m.role === "assistant" && (
                  <Text style={styles.disclaimer}>{tr(language, "disclaimer")}</Text>
                )}
              </View>
            ))}

            {loading && (
              <View style={[styles.bubbleWrap, { alignItems: "flex-start" }]}>
                <View style={styles.aiBadge}>
                  <JellyfishLogo size={20} glow={false} />
                  <Text style={styles.aiBadgeText}>MedUZ AI</Text>
                </View>
                <View style={[styles.bubble, styles.aiBubble, { flexDirection: "row", alignItems: "center" }]}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={[styles.bubbleText, { marginLeft: 10, color: COLORS.text.secondary }]}>
                    {tr(language, "aiThinking")}
                  </Text>
                </View>
              </View>
            )}

            {lastSuggestions.length > 0 && messages.length > 0 && !loading && (
              <View style={styles.quickActionsRow}>
                <QuickActionPill icon="stethoscope" label={tr(language, "findDoctor")} onPress={() => router.push("/(patient)/doctors")} testID="qa-doctor" />
                <QuickActionPill icon="hospital-building" label={tr(language, "findOrg")} onPress={() => router.push("/(patient)/organizations")} testID="qa-org" />
                <QuickActionPill icon="pill" label={tr(language, "findMedicine")} onPress={() => router.push("/(patient)/pharmacies")} testID="qa-medicine" />
                <QuickActionPill icon="home-heart" label={tr(language, "requestHomeVisit")} onPress={() => router.push("/(patient)/home-care")} testID="qa-home" />
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.attachBtn} onPress={() => send("Here is a photo of my symptom (demo)")} testID="ai-attach-button">
              <MaterialCommunityIcons name="camera-plus" size={22} color={COLORS.primary} />
            </TouchableOpacity>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={tr(language, "chatPlaceholder")}
              placeholderTextColor={COLORS.text.tertiary}
              style={styles.input}
              multiline
              testID="ai-chat-input"
            />
            <TouchableOpacity
              onPress={() => send()}
              disabled={!input.trim() || loading}
              style={[styles.sendBtn, (!input.trim() || loading) && { opacity: 0.4 }]}
              testID="ai-send-button"
            >
              <LinearGradient colors={["#2563EB", "#7C3AED"]} style={styles.sendGrad}>
                <Ionicons name="send" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

function QuickActionPill({
  icon,
  label,
  onPress,
  testID,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.qa} testID={testID}>
      <MaterialCommunityIcons name={icon} size={14} color={COLORS.primary} />
      <Text style={styles.qaLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center", ...SHADOW.card },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: COLORS.text.secondary },
  welcome: { alignItems: "center", paddingTop: SPACING.lg },
  welcomeTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text.primary, marginTop: SPACING.lg, textAlign: "center" },
  welcomeSub: { fontSize: 14, color: COLORS.text.secondary, marginTop: 6, textAlign: "center" },
  disclaimer: { fontSize: 11, color: COLORS.text.tertiary, fontStyle: "italic", marginTop: 6 },
  suggestedItem: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.lg, ...SHADOW.card },
  bubbleWrap: { marginBottom: SPACING.lg },
  aiBadge: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  aiBadgeText: { marginLeft: 6, fontSize: 12, fontWeight: "700", color: COLORS.text.secondary },
  bubble: { padding: SPACING.md, borderRadius: RADIUS.lg, maxWidth: "92%" },
  userBubble: { backgroundColor: COLORS.primary, borderTopRightRadius: 6 },
  aiBubble: { backgroundColor: COLORS.surface, borderTopLeftRadius: 6, ...SHADOW.card },
  bubbleText: { fontSize: 14, color: COLORS.text.primary, lineHeight: 21 },
  quickActionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: SPACING.md },
  qa: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.surface, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border },
  qaLabel: { marginLeft: 6, fontSize: 12, fontWeight: "600", color: COLORS.primary },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
    gap: 10,
  },
  attachBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.bg, alignItems: "center", justifyContent: "center" },
  input: { flex: 1, maxHeight: 100, fontSize: 14, paddingHorizontal: SPACING.md, paddingVertical: 12, backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, color: COLORS.text.primary },
  sendBtn: { width: 44, height: 44, borderRadius: 22, overflow: "hidden" },
  sendGrad: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  newChatBtn: { flexDirection: "row", alignItems: "center", padding: SPACING.md, borderRadius: RADIUS.lg, backgroundColor: COLORS.surface, ...SHADOW.card, justifyContent: "center" },
  histTitle: { fontSize: 14, fontWeight: "700", color: COLORS.text.primary, flex: 1 },
  histDate: { fontSize: 11, color: COLORS.text.tertiary, marginLeft: 6 },
  histMsg: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4 },
});
