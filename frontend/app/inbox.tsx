// Inbox — list of all conversations for the current role.
import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { MaterialCommunityIcons, ScreenHeader, Tag } from "@/src/components/ui";
import { useChat } from "@/src/store/chat";

function formatWhen(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const yester = new Date(now); yester.setDate(yester.getDate() - 1);
  if (d.toDateString() === yester.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
}

export default function InboxScreen() {
  const router = useRouter();
  const { conversations, onlineUsers, connected, loadConversations, totalUnread } = useChat();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader
        title="Inbox"
        back
        right={
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: connected ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.10)" }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: connected ? COLORS.success : COLORS.danger, marginRight: 6 }} />
            <Text style={{ fontSize: 11, fontWeight: "700", color: connected ? COLORS.success : COLORS.danger }}>{connected ? "Live" : "Offline"}</Text>
          </View>
        }
      />
      {totalUnread > 0 && (
        <View style={styles.banner}>
          <MaterialCommunityIcons name="bell-badge" size={16} color="#fff" />
          <Text style={styles.bannerText}>{totalUnread} unread message{totalUnread > 1 ? "s" : ""}</Text>
        </View>
      )}
      <FlatList
        data={conversations}
        keyExtractor={(c) => c.conversation_id}
        contentContainerStyle={{ padding: SPACING.lg, gap: 6, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={loadConversations} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 80 }}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="inbox" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySub}>Message a doctor, specialist or clinic to start chatting.</Text>
          </View>
        }
        renderItem={({ item: c }) => {
          const online = onlineUsers.has(c.peer.user_id);
          return (
            <TouchableOpacity
              style={styles.convo}
              onPress={() =>
                router.push({
                  pathname: "/chat/[peerId]",
                  params: {
                    peerId: c.peer.user_id,
                    peerName: c.peer.name,
                    peerRole: c.peer.role,
                    peerAvatar: c.peer.avatar || "",
                  },
                })
              }
              testID={`convo-${c.conversation_id}`}
            >
              <View style={styles.avatarWrap}>
                {c.peer.avatar ? (
                  <Image source={{ uri: c.peer.avatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <MaterialCommunityIcons
                      name={c.peer.role === "doctor" ? "stethoscope" : c.peer.role === "service" ? "medical-bag" : c.peer.role === "admin" ? "office-building" : "account"}
                      size={22}
                      color={COLORS.primary}
                    />
                  </View>
                )}
                {online && <View style={styles.presenceDot} />}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={styles.name} numberOfLines={1}>{c.peer.name}</Text>
                  <Text style={styles.when}>{formatWhen(c.last_message_at)}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                  <Text style={[styles.preview, c.unread > 0 && { color: COLORS.text.primary, fontWeight: "700" }]} numberOfLines={1}>
                    {c.last_message || "No messages yet"}
                  </Text>
                  {c.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{c.unread}</Text>
                    </View>
                  )}
                </View>
                <Tag
                  label={c.peer.role === "doctor" ? "Doctor" : c.peer.role === "service" ? "Home Care" : c.peer.role === "admin" ? "Clinic" : "Patient"}
                  color={COLORS.primary}
                  background="rgba(37,99,235,0.10)"
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  banner: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: 8, gap: 8 },
  bannerText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  convo: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOW.card },
  avatarWrap: { width: 52, height: 52, position: "relative" },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  avatarPlaceholder: { backgroundColor: "rgba(37,99,235,0.10)", alignItems: "center", justifyContent: "center" },
  presenceDot: { position: "absolute", right: 0, bottom: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surface },
  name: { fontSize: 15, fontWeight: "700", color: COLORS.text.primary, flex: 1, marginRight: 8 },
  when: { fontSize: 11, color: COLORS.text.tertiary },
  preview: { fontSize: 13, color: COLORS.text.secondary, flex: 1, marginRight: 8 },
  unreadBadge: { minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  unreadText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  emptyIcon: { width: 68, height: 68, borderRadius: 34, backgroundColor: "rgba(37,99,235,0.10)", alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text.primary, marginTop: 14 },
  emptySub: { fontSize: 12, color: COLORS.text.secondary, marginTop: 6, textAlign: "center", paddingHorizontal: SPACING.xl },
});
