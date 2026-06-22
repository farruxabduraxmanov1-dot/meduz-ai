// Service gallery
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, ScreenHeader, GradientButton, MaterialCommunityIcons } from "@/src/components/ui";
import { COLORS, SPACING, RADIUS } from "@/src/theme";
import { tr } from "@/src/i18n";
import { useAppState } from "@/src/store/app-state";
import { SERVICE_DEMO } from "@/src/data/demo";

export default function ServiceGallery() {
  const { language } = useAppState();
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title={tr(language, "gallery")} back />
      <ScrollView contentContainerStyle={{ padding: SPACING.xl, gap: SPACING.md }}>
        <Card style={{ alignItems: "center" }}>
          <Text style={styles.title}>Showcase your work</Text>
          <Text style={styles.sub}>Photos build trust. Verified providers earn 3× more.</Text>
        </Card>
        <View style={styles.grid}>
          {SERVICE_DEMO.gallery.concat(SERVICE_DEMO.gallery).map((g, i) => (
            <Image key={i} source={{ uri: g }} style={styles.tile} />
          ))}
          <TouchableOpacity style={styles.addTile} testID="svc-add-photo">
            <MaterialCommunityIcons name="image-plus" size={28} color={COLORS.primary} />
            <Text style={styles.addText}>Add photo</Text>
          </TouchableOpacity>
        </View>
        <GradientButton label="Publish gallery" icon="upload" size="lg" onPress={() => {}} testID="svc-publish-gallery" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  title: { fontSize: 16, fontWeight: "800", color: COLORS.text.primary },
  sub: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tile: { width: "31%", aspectRatio: 1, borderRadius: 14 },
  addTile: { width: "31%", aspectRatio: 1, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surface, borderWidth: 2, borderStyle: "dashed", borderColor: COLORS.primary },
  addText: { color: COLORS.primary, marginTop: 6, fontSize: 11, fontWeight: "700" },
});
