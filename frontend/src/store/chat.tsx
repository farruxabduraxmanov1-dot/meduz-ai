// MedUZ AI - Real-time chat store (WebSocket client + persistence + presence)
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAppState } from "@/src/store/app-state";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "";

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: string;
  sender_name: string;
  text: string;
  created_at: string;
  read_by: string[];
  isMe?: boolean;
  status?: "sending" | "delivered" | "read";
};

export type Peer = {
  user_id: string;
  role: string;
  name: string;
  avatar?: string;
};

export type Conversation = {
  conversation_id: string;
  peer: Peer;
  peer_online: boolean;
  last_message?: string | null;
  last_message_at?: string | null;
  last_sender_id?: string | null;
  unread: number;
};

type ChatContextValue = {
  connected: boolean;
  onlineUsers: Set<string>;
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>; // by conversation_id
  typingByConv: Record<string, boolean>;
  totalUnread: number;
  ensureConversation: (peer: Peer) => Promise<string>;
  loadConversations: () => Promise<void>;
  loadMessages: (conversation_id: string) => Promise<void>;
  sendMessage: (peer: Peer, text: string) => Promise<void>;
  sendTyping: (peer: Peer, isTyping: boolean) => void;
  markRead: (conversation_id: string, peer_id: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

// Compute deterministic conversation id from participant ids
function convIdFor(a: string, b: string) {
  const ids = [a, b].sort();
  return `conv_${ids[0]}__${ids[1]}`;
}

// Map app role + user info -> stable chat user identity for this demo
export function chatIdentityForRole(role: string | null, user: { name?: string; userId?: string } | null): { userId: string; name: string; avatar: string; role: string } {
  if (role === "doctor") {
    return { userId: "dr-001", role: "doctor", name: "Dr. Akmal Karimov", avatar: "" };
  }
  if (role === "admin") {
    return { userId: "admin-org-006", role: "admin", name: "Medion Reception", avatar: "" };
  }
  if (role === "service") {
    return { userId: "sp-001", role: "service", name: "Sevara Kamilova", avatar: "" };
  }
  const uid = user?.userId || "patient-demo";
  return { userId: uid, role: "patient", name: user?.name || "Demo User", avatar: "" };
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { role, user, hydrated } = useAppState();
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [typingByConv, setTypingByConv] = useState<Record<string, boolean>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const meRef = useRef<{ userId: string; name: string; role: string; avatar: string } | null>(null);
  const reconnectTimerRef = useRef<any>(null);
  const typingTimeoutsRef = useRef<Record<string, any>>({});

  const identity = useMemo(
    () => chatIdentityForRole(role, user),
    [role, user?.userId, user?.name],
  );

  // ============ WebSocket connection lifecycle ============
  const connect = useCallback(() => {
    if (!hydrated) return;
    if (!BACKEND_URL) return;
    if (!identity.userId) return;
    // Avoid reconnect if we already have an open WS for the same user
    const currentTag = (wsRef.current as any)?.__userId;
    if (wsRef.current && currentTag === identity.userId && wsRef.current.readyState <= 1) {
      return;
    }
    // Close existing (different user or stale)
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }
    meRef.current = identity;
    const url = BACKEND_URL.replace(/^http/, "ws") + `/api/ws/chat/${encodeURIComponent(identity.userId)}`;
    const ws = new WebSocket(url);
    (ws as any).__userId = identity.userId;
    wsRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      // Auto-reconnect after 2s
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = setTimeout(() => connect(), 2000);
    };
    ws.onerror = () => {
      // Handled by onclose
    };
    ws.onmessage = (evt) => {
      let data: any;
      try { data = JSON.parse(evt.data); } catch { return; }
      const t = data.type;
      if (t === "hello") {
        setOnlineUsers(new Set(data.online_users || []));
      } else if (t === "presence") {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          if (data.online) next.add(data.user_id);
          else next.delete(data.user_id);
          return next;
        });
      } else if (t === "typing") {
        const cid = data.conversation_id;
        setTypingByConv((prev) => ({ ...prev, [cid]: !!data.is_typing }));
      } else if (t === "message" || t === "message_ack") {
        const msg: ChatMessage = data.message;
        if (!msg) return;
        const cid = msg.conversation_id;
        setMessages((prev) => {
          const list = prev[cid] || [];
          if (list.find((m) => m.id === msg.id)) return prev;
          return { ...prev, [cid]: [...list, msg] };
        });
        // Update conversations list preview
        setConversations((prev) => {
          const existing = prev.find((c) => c.conversation_id === cid);
          if (existing) {
            const incoming = !msg.isMe;
            return prev.map((c) =>
              c.conversation_id === cid
                ? {
                    ...c,
                    last_message: msg.text,
                    last_message_at: msg.created_at,
                    last_sender_id: msg.sender_id,
                    unread: incoming ? c.unread + 1 : c.unread,
                  }
                : c,
            );
          }
          return prev;
        });
      } else if (t === "read") {
        // Mark my messages as read
        const cid = data.conversation_id;
        setMessages((prev) => {
          const list = prev[cid] || [];
          return {
            ...prev,
            [cid]: list.map((m) =>
              m.sender_id === meRef.current?.userId ? { ...m, status: "read" } : m,
            ),
          };
        });
      }
    };
  }, [hydrated, identity]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) try { wsRef.current.close(); } catch {}
    };
  }, [connect]);

  // ============ REST helpers ============
  const ensureConversation = useCallback(async (peer: Peer) => {
    const me = identity;
    const cid = convIdFor(me.userId, peer.user_id);
    try {
      await fetch(`${BACKEND_URL}/api/chat/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: me.userId,
          user_role: me.role,
          user_name: me.name,
          user_avatar: me.avatar || "",
          peer_id: peer.user_id,
          peer_role: peer.role,
          peer_name: peer.name,
          peer_avatar: peer.avatar || "",
        }),
      });
    } catch {}
    // Optimistically add to conversations if missing
    setConversations((prev) => {
      if (prev.find((c) => c.conversation_id === cid)) return prev;
      return [
        {
          conversation_id: cid,
          peer,
          peer_online: onlineUsers.has(peer.user_id),
          last_message: null,
          last_message_at: null,
          last_sender_id: null,
          unread: 0,
        },
        ...prev,
      ];
    });
    return cid;
  }, [identity, onlineUsers]);

  const loadConversations = useCallback(async () => {
    const me = identity;
    try {
      const res = await fetch(`${BACKEND_URL}/api/chat/conversations?user_id=${encodeURIComponent(me.userId)}`);
      const json = await res.json();
      setConversations(json.conversations || []);
    } catch {}
  }, [identity]);

  const loadMessages = useCallback(async (conversation_id: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/chat/messages?conversation_id=${encodeURIComponent(conversation_id)}`);
      const json = await res.json();
      const list: ChatMessage[] = (json.messages || []).map((m: ChatMessage) => ({
        ...m,
        isMe: m.sender_id === meRef.current?.userId,
      }));
      setMessages((prev) => ({ ...prev, [conversation_id]: list }));
    } catch {}
  }, []);

  const sendMessage = useCallback(async (peer: Peer, text: string) => {
    const me = identity;
    if (!text.trim()) return;
    const cid = convIdFor(me.userId, peer.user_id);
    // Optimistic add
    const tempId = `t-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      conversation_id: cid,
      sender_id: me.userId,
      sender_role: me.role,
      sender_name: me.name,
      text,
      created_at: new Date().toISOString(),
      read_by: [me.userId],
      isMe: true,
      status: "sending",
    };
    setMessages((prev) => ({ ...prev, [cid]: [...(prev[cid] || []), optimistic] }));
    // WS send
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "message",
        conversation_id: cid,
        peer_id: peer.user_id,
        peer_role: peer.role,
        peer_name: peer.name,
        peer_avatar: peer.avatar || "",
        sender_role: me.role,
        sender_name: me.name,
        sender_avatar: me.avatar || "",
        text,
      }));
      // Server will ack, replacing temp -> real via id match, but simplest: leave temp and dedupe on ack
      // We'll deduplicate by removing the temp on next matching text
    }
  }, [identity]);

  const sendTyping = useCallback((peer: Peer, isTyping: boolean) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const me = identity;
    const cid = convIdFor(me.userId, peer.user_id);
    // Throttle: only send if state changes for this peer
    const key = `${peer.user_id}-${isTyping}`;
    if (typingTimeoutsRef.current[key]) return;
    typingTimeoutsRef.current[key] = setTimeout(() => {
      delete typingTimeoutsRef.current[key];
    }, 800);
    ws.send(JSON.stringify({
      type: "typing",
      conversation_id: cid,
      peer_id: peer.user_id,
      is_typing: isTyping,
    }));
  }, [identity]);

  const markRead = useCallback((conversation_id: string, peer_id: string) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: "read",
        conversation_id,
        peer_id,
      }));
    }
    // Reset unread locally
    setConversations((prev) => prev.map((c) =>
      c.conversation_id === conversation_id ? { ...c, unread: 0 } : c,
    ));
  }, []);

  const totalUnread = useMemo(() =>
    conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
  [conversations]);

  const value = useMemo<ChatContextValue>(() => ({
    connected,
    onlineUsers,
    conversations,
    messages,
    typingByConv,
    totalUnread,
    ensureConversation,
    loadConversations,
    loadMessages,
    sendMessage,
    sendTyping,
    markRead,
  }), [connected, onlineUsers, conversations, messages, typingByConv, totalUnread, ensureConversation, loadConversations, loadMessages, sendMessage, sendTyping, markRead]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}

export function useMe() {
  const { role, user } = useAppState();
  return useMemo(() => chatIdentityForRole(role, user), [role, user]);
}
