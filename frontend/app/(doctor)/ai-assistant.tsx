// AI Assistant for Doctors
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, ScreenHeader, GradientButton, MaterialCommunityIcons, Tag } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const TOOLS: { id: "medical_summary" | "recommendations" | "patient_notes" | "follow_up_plan"; label: string; icon: any; color: string }[] = [
  { id: "medical_summary", label: "Medical Summary", icon: "file-document", color: "#2563EB" },
  { id: "recommendations", label: "Recommendations", icon: "clipboard-check", color: "#7C3AED" },
  { id: "patient_notes", label: "SOAP Notes", icon: "notebook", color: "#10B981" },
  { id: "follow_up_plan", label: "Follow-Up Plan", icon: "calendar-clock", color: "#F59E0B" },
];

export default function DoctorAi() {
  const { language } = useAppState();
  const [tool, setTool] = useState<typeof TOOLS[number]["id"]>("medical_summary");
  const [context, setContext] = useState("Patient: 45M, chest discomfort on exertion for 2 weeks. BP 145/90, ECG normal. Past history: HTN, smoker 20py.");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/doctor-tool`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, patient_context: context, language }),
      });
      const data = await res.json();
      setOutput(data.content || "");
    } catch {
      setOutput("(Demo) AI service unavailable. Showing a placeholder for the requested output.");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "aiForDoctors")} subtitle="Powered by Claude Sonnet 4.5" back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.lg, paddingBottom: 120 }}>
        <Card>
          <Text style={styles.section}>Choose tool</Text>
          <View style={styles.grid}>
            {TOOLS.map((t) => {
              const active = t.id === tool;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setTool(t.id)}
                  style={[styles.toolCell, active && { backgroundColor: `${t.color}14`, borderColor: t.color }]}
                  testID={`tool-${t.id}`}
                >
                  <MaterialCommunityIcons name={t.icon} size={22} color={active ? t.color : COLORS.text.secondary} />
                  <Text style={[styles.toolLabel, active && { color: t.color, fontWeight: "700" }]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <Card>
          <Text style={styles.section}>Patient context</Text>
          <TextInput
            value={context}
            onChangeText={setContext}
            multiline
            placeholder="Brief patient context, vitals, history…"
            placeholderTextColor={COLORS.text.tertiary}
            style={styles.input}
            testID="doc-ai-context"
          />
          <GradientButton
            label={loading ? "Generating…" : "Generate"}
            onPress={run}
            disabled={!context.trim() || loading}
            icon="auto-fix"
            size="lg"
            style={{ marginTop: SPACING.md }}
            testID="doc-ai-generate"
          />
        </Card>

        {output ? (
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="check-decagram" size={20} color={COLORS.success} />
              <Text style={[styles.section, { marginLeft: 6 }]}>AI output</Text>
              <View style={{ flex: 1 }} />
              <Tag label="Draft" color={COLORS.primary} background="rgba(37,99,235,0.10)" />
            </View>
            <Text style={styles.output}>{output}</Text>
            <Text style={styles.disclaimer}>For clinical decision support only. Validate before sharing.</Text>
          </Card>
        ) : loading ? (
          <Card style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={{ marginLeft: 10, color: COLORS.text.secondary }}>AI is generating your output…</Text>
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  section: { fontSize: 13, fontWeight: "700", color: COLORS.text.primary },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: SPACING.sm },
  toolCell: { width: "48%", padding: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bg, alignItems: "center", gap: 6 },
  toolLabel: { fontSize: 12, color: COLORS.text.secondary, textAlign: "center" },
  input: { marginTop: SPACING.sm, minHeight: 100, padding: SPACING.md, backgroundColor: COLORS.bg, borderRadius: RADIUS.md, fontSize: 13, color: COLORS.text.primary, textAlignVertical: "top" },
  output: { marginTop: SPACING.md, fontSize: 13, color: COLORS.text.primary, lineHeight: 20 },
  disclaimer: { fontSize: 11, color: COLORS.text.tertiary, marginTop: SPACING.md, fontStyle: "italic" },
});
