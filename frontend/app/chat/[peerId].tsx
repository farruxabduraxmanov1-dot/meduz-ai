// Real-time chat screen — works for all roles. Peer info via URL params.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { LinearGradient } from "expo-linear-gradient";

import { COLORS, SPACING, RADIUS, SHADOW } from "@/src/theme";
import { MaterialCommunityIcons } from "@/src/components/ui";
import { useChat, useMe } from "@/src/store/chat";

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function ChatScreen() {
  const router = useRouter();
  const { peerId, peerName, peerRole, peerAvatar } = useLocalSearchParams<{
    peerId: string;
    peerName?: string;
    peerRole?: string;
    peerAvatar?: string;
  }>();
  const me = useMe();
  const {
    connected,
    onlineUsers,
    messages,
    typingByConv,
    ensureConversation,
    loadMessages,
    sendMessage,
    sendTyping,
    markRead,
  } = useChat();

  const peer = useMemo(
    () => ({
      user_id: peerId!,
      role: (peerRole as string) || "doctor",
      name: (peerName as string) || "Doctor",
      avatar: (peerAvatar as string) || "",
    }),
    [peerId, peerName, peerRole, peerAvatar],
  );

  const cid = useMemo(() => {
    const ids = [me.userId, peer.user_id].sort();
    return `conv_${ids[0]}__${ids[1]}`;
  }, [me.userId, peer.user_id]);

  const list = messages[cid] || [];
  const isTyping = !!typingByConv[cid];
  const online = onlineUsers.has(peer.user_id);

  const [input, setInput] = useState("");
  const listRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    (async () => {
      await ensureConversation(peer);
      await loadMessages(cid);
      markRead(cid, peer.user_id);
    })();
  }, [peer, cid, ensureConversation, loadMessages, markRead]);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (list.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
    }
  }, [list.length, isTyping]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendTyping(peer, false);
    await sendMessage(peer, text);
  };

  const onChangeInput = (v: string) => {
    setInput(v);
    sendTyping(peer, v.length > 0);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="chat-back">
          <MaterialCommunityIcons name="arrow-left" size={22} color={COLORS.text.primary} />
        </TouchableOpacity>
        <View style={styles.avatarWrap}>
          {peer.avatar ? (
            <Image source={{ uri: peer.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialCommunityIcons
                name={peer.role === "doctor" ? "stethoscope" : peer.role === "service" ? "medical-bag" : peer.role === "admin" ? "office-building" : "account"}
                size={20}
                color={COLORS.primary}
              />
            </View>
          )}
          {online && <View style={styles.presenceDot} />}
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.peerName} numberOfLines={1}>{peer.name}</Text>
          <Text style={styles.peerSub} numberOfLines={1}>
            {isTyping ? "typing…" : online ? "Online" : connected ? "Offline" : "Connecting…"}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} testID="chat-call">
          <MaterialCommunityIcons name="phone" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={list}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 20 }}
        renderItem={({ item, index }) => {
          const prev = list[index - 1];
          const showAvatar = !item.isMe && (!prev || prev.sender_id !== item.sender_id);
          return (
            <View style={[styles.row, { justifyContent: item.isMe ? "flex-end" : "flex-start" }]}>
              {!item.isMe && (
                <View style={{ width: 32, marginRight: 6 }}>
                  {showAvatar && (
                    peer.avatar ? (
                      <Image source={{ uri: peer.avatar }} style={styles.msgAvatar} />
                    ) : (
                      <View style={[styles.msgAvatar, styles.avatarPlaceholder]}>
                        <MaterialCommunityIcons
                          name={peer.role === "doctor" ? "stethoscope" : peer.role === "service" ? "medical-bag" : peer.role === "admin" ? "office-building" : "account"}
                          size={14}
                          color={COLORS.primary}
                        />
                      </View>
                    )
                  )}
                </View>
              )}
              <View style={{ maxWidth: "78%" }}>
                {item.isMe ? (
                  <LinearGradient colors={["#2563EB", "#7C3AED"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.bubble, styles.bubbleMe]}>
                    <Text style={styles.textMe}>{item.text}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.bubble, styles.bubblePeer]}>
                    <Text style={styles.textPeer}>{item.text}</Text>
                  </View>
                )}
                <View style={[styles.metaRow, { justifyContent: item.isMe ? "flex-end" : "flex-start" }]}>
                  <Text style={styles.time}>{formatTime(item.created_at)}</Text>
                  {item.isMe && (
                    <MaterialCommunityIcons
                      name={item.status === "read" || (item.read_by || []).includes(peer.user_id) ? "check-all" : "check"}
                      size={12}
                      color={item.status === "read" || (item.read_by || []).includes(peer.user_id) ? "#7C3AED" : COLORS.text.tertiary}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 60 }}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="message-text-outline" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>Start the conversation</Text>
            <Text style={styles.emptySub}>{peer.name} will reply as soon as they can</Text>
          </View>
        }
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingRow}>
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color={COLORS.text.secondary} />
                <Text style={styles.typingText}>typing…</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Sticky input */}
      <KeyboardStickyView offset={{ closed: 0, opened: Platform.OS === "ios" ? 0 : 0 }}>
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.iconBtn} testID="chat-attach">
            <MaterialCommunityIcons name="paperclip" size={20} color={COLORS.text.secondary} />
          </TouchableOpacity>
          <TextInput
            value={input}
            onChangeText={onChangeInput}
            placeholder="Message…"
            placeholderTextColor={COLORS.text.tertiary}
            style={styles.input}
            multiline
            testID="chat-input"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}
            onPress={send}
            disabled={!input.trim()}
            testID="chat-send"
          >
            <LinearGradient colors={["#2563EB", "#7C3AED"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sendGrad}>
              <MaterialCommunityIcons name="send" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardStickyView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg, paddingVertical: 10, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.borderSoft },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarWrap: { width: 40, height: 40, position: "relative" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarPlaceholder: { backgroundColor: "rgba(37,99,235,0.10)", alignItems: "center", justifyContent: "center" },
  presenceDot: { position: "absolute", right: -1, bottom: -1, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surface },
  peerName: { fontSize: 15, fontWeight: "800", color: COLORS.text.primary },
  peerSub: { fontSize: 11, color: COLORS.text.tertiary, marginTop: 2 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(37,99,235,0.08)", alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "flex-end", marginBottom: 10 },
  msgAvatar: { width: 32, height: 32, borderRadius: 16 },
  bubble: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
  bubbleMe: { borderBottomRightRadius: 4 },
  bubblePeer: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4, ...SHADOW.card },
  textMe: { color: "#fff", fontSize: 14, lineHeight: 20 },
  textPeer: { color: COLORS.text.primary, fontSize: 14, lineHeight: 20 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  time: { fontSize: 10, color: COLORS.text.tertiary },
  typingRow: { flexDirection: "row", justifyContent: "flex-start", marginTop: 4 },
  typingBubble: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, ...SHADOW.card, gap: 6, marginLeft: 38 },
  typingText: { fontSize: 12, color: COLORS.text.secondary },
  emptyIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(37,99,235,0.10)", alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 15, fontWeight: "800", color: COLORS.text.primary, marginTop: 12 },
  emptySub: { fontSize: 12, color: COLORS.text.secondary, marginTop: 4 },
  inputBar: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: SPACING.lg, paddingVertical: 10, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.borderSoft, gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg },
  input: { flex: 1, minHeight: 40, maxHeight: 120, backgroundColor: COLORS.bg, borderRadius: 20, paddingHorizontal: 14, paddingVertical: Platform.OS === "ios" ? 12 : 8, fontSize: 14, color: COLORS.text.primary },
  sendBtn: { width: 40, height: 40, borderRadius: 20, overflow: "hidden" },
  sendGrad: { flex: 1, alignItems: "center", justifyContent: "center" },
});
