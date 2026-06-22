// MedUZ AI — Shared UI components
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Path, Circle, Rect, G } from "react-native-svg";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { COLORS, RADIUS, SHADOW, SPACING } from "@/src/theme";

// ====== JellyfishLogo — premium medical-tech mark (custom SVG) ======
export function JellyfishLogo({
  size = 96,
  glow = true,
  monochrome = false,
}: {
  size?: number;
  glow?: boolean;
  monochrome?: boolean;
}) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        ...(glow ? SHADOW.floating : {}),
      }}
      testID="jellyfish-logo"
    >
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <SvgGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={monochrome ? "#FFFFFF" : "#3B82F6"} stopOpacity="1" />
            <Stop offset="0.55" stopColor={monochrome ? "#FFFFFF" : "#6366F1"} stopOpacity="1" />
            <Stop offset="1" stopColor={monochrome ? "#FFFFFF" : "#7C3AED"} stopOpacity="1" />
          </SvgGradient>
          <SvgGradient id={`dome-${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.65" />
          </SvgGradient>
          <SvgGradient id={`tent-${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.15" />
          </SvgGradient>
        </Defs>

        {/* Soft circular background */}
        <Circle cx={100} cy={100} r={96} fill={`url(#bg-${id})`} />

        {/* Inner highlight ring */}
        <Circle cx={100} cy={92} r={70} fill="none" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth={2} />

        {/* Jellyfish dome */}
        <Path
          d="M 50 110 C 50 60, 75 40, 100 40 C 125 40, 150 60, 150 110 C 138 118, 128 110, 118 116 C 108 122, 92 122, 82 116 C 72 110, 62 118, 50 110 Z"
          fill={`url(#dome-${id})`}
        />

        {/* Tentacles — wavy gradient lines */}
        <G strokeLinecap="round" fill="none" strokeWidth={3.5}>
          <Path d="M 60 116 C 56 130, 64 138, 58 152 C 64 162, 56 168, 62 178" stroke={`url(#tent-${id})`} />
          <Path d="M 78 121 C 74 138, 82 148, 76 162 C 82 172, 74 178, 80 188" stroke={`url(#tent-${id})`} />
          <Path d="M 100 124 C 100 142, 100 158, 100 174 C 100 184, 100 188, 100 192" stroke={`url(#tent-${id})`} />
          <Path d="M 122 121 C 126 138, 118 148, 124 162 C 118 172, 126 178, 120 188" stroke={`url(#tent-${id})`} />
          <Path d="M 140 116 C 144 130, 136 138, 142 152 C 136 162, 144 168, 138 178" stroke={`url(#tent-${id})`} />
        </G>

        {/* Medical cross inside dome */}
        <G opacity="0.95">
          <Rect x="93" y="62" width="14" height="36" rx="3" fill="#FFFFFF" />
          <Rect x="82" y="73" width="36" height="14" rx="3" fill="#FFFFFF" />
        </G>
      </Svg>
    </View>
  );
}

// ====== GradientButton ======
type ButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  style?: StyleProp<ViewStyle>;
  testID?: string;
  disabled?: boolean;
};

export function GradientButton({
  label,
  onPress,
  icon,
  variant = "primary",
  size = "md",
  style,
  testID,
  disabled,
}: ButtonProps) {
  const heights = { sm: 40, md: 52, lg: 60 };
  const fontSize = { sm: 14, md: 16, lg: 17 };
  const height = heights[size];

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        disabled={disabled}
        testID={testID}
        style={[{ borderRadius: RADIUS.lg, opacity: disabled ? 0.5 : 1 }, SHADOW.soft, style]}
      >
        <LinearGradient
          colors={COLORS.gradient as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height,
            borderRadius: RADIUS.lg,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            paddingHorizontal: SPACING.xl,
          }}
        >
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={size === "lg" ? 22 : 18}
              color="#fff"
              style={{ marginRight: 10 }}
            />
          )}
          <Text style={{ color: "#fff", fontSize: fontSize[size], fontWeight: "700" }}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const bg = variant === "secondary" ? COLORS.surface : variant === "danger" ? "#FEE2E2" : "transparent";
  const fg = variant === "danger" ? COLORS.danger : COLORS.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      testID={testID}
      style={[
        {
          height,
          borderRadius: RADIUS.lg,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          paddingHorizontal: SPACING.xl,
          backgroundColor: bg,
          borderWidth: variant === "ghost" ? 1 : 0,
          borderColor: COLORS.border,
        },
        variant === "secondary" ? SHADOW.card : undefined,
        style,
        disabled ? { opacity: 0.5 } : null,
      ]}
    >
      {icon && (
        <MaterialCommunityIcons name={icon} size={18} color={fg} style={{ marginRight: 8 }} />
      )}
      <Text style={{ color: fg, fontSize: fontSize[size], fontWeight: "700" }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ====== Card ======
export function Card({
  children,
  style,
  testID,
  onPress,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  onPress?: () => void;
}) {
  const C: any = onPress ? TouchableOpacity : View;
  return (
    <C
      onPress={onPress}
      activeOpacity={0.85}
      testID={testID}
      style={[
        {
          backgroundColor: COLORS.surface,
          borderRadius: RADIUS.xl,
          padding: SPACING.lg,
        },
        SHADOW.card,
        style,
      ]}
    >
      {children}
    </C>
  );
}

// ====== Header ======
export function ScreenHeader({
  title,
  subtitle,
  back = false,
  right,
  testID,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: React.ReactNode;
  testID?: string;
}) {
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
      }}
      testID={testID}
    >
      {back && (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.surface,
            alignItems: "center",
            justifyContent: "center",
            marginRight: SPACING.md,
            ...SHADOW.card,
          }}
          testID="header-back-button"
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.text.primary} />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: COLORS.text.primary }}>{title}</Text>
        {subtitle ? (
          <Text style={{ fontSize: 13, color: COLORS.text.secondary, marginTop: 2 }}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

// ====== RatingStars ======
export function RatingStars({
  rating,
  count,
  size = 14,
  style,
}: {
  rating: number;
  count?: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      <Ionicons name="star" size={size} color={COLORS.star} />
      <Text style={{ marginLeft: 4, fontSize: size - 1, fontWeight: "700", color: COLORS.text.primary }}>
        {rating.toFixed(1)}
      </Text>
      {count !== undefined && (
        <Text style={{ marginLeft: 4, fontSize: size - 2, color: COLORS.text.tertiary }}>
          ({count})
        </Text>
      )}
    </View>
  );
}

// ====== ChipsRow (sticky chip row) ======
export function ChipsRow<T extends string>({
  items,
  selected,
  onSelect,
  testID,
}: {
  items: { value: T; label: string; icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"] }[];
  selected: T;
  onSelect: (v: T) => void;
  testID?: string;
}) {
  return (
    <View style={{ height: 56, justifyContent: "center" }} testID={testID}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.xl, gap: 10, alignItems: "center" }}
      >
        {items.map((it) => {
          const active = it.value === selected;
          return (
            <TouchableOpacity
              key={it.value}
              onPress={() => onSelect(it.value)}
              activeOpacity={0.85}
              style={{
                height: 36,
                flexShrink: 0,
                paddingHorizontal: 14,
                borderRadius: 18,
                backgroundColor: active ? COLORS.primary : COLORS.surface,
                borderWidth: 1,
                borderColor: active ? COLORS.primary : COLORS.border,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
              testID={`chip-${it.value}`}
            >
              {it.icon && (
                <MaterialCommunityIcons
                  name={it.icon}
                  size={14}
                  color={active ? "#fff" : COLORS.text.secondary}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                style={{
                  color: active ? "#fff" : COLORS.text.secondary,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {it.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ====== TextWithIcon ======
export function IconText({
  icon,
  text,
  color = COLORS.text.secondary,
  style,
  textStyle,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  text: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  return (
    <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>
      <MaterialCommunityIcons name={icon} size={14} color={color} />
      <Text style={[{ marginLeft: 4, fontSize: 12, color }, textStyle]}>{text}</Text>
    </View>
  );
}

// ====== Avatar with fallback ======
export function Avatar({ uri, size = 56, name = "" }: { uri?: string; size?: number; name?: string }) {
  const initials = (name || "")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: COLORS.surfaceMuted,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} />
      ) : (
        <Text style={{ fontSize: size * 0.34, fontWeight: "700", color: COLORS.primary }}>
          {initials || "?"}
        </Text>
      )}
    </View>
  );
}

// ====== Tag (badges) ======
export function Tag({
  label,
  color = COLORS.primary,
  background = "rgba(37,99,235,0.10)",
  icon,
  style,
}: {
  label: string;
  color?: string;
  background?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: RADIUS.pill,
          backgroundColor: background,
          flexDirection: "row",
          alignItems: "center",
        },
        style,
      ]}
    >
      {icon && (
        <MaterialCommunityIcons name={icon} size={12} color={color} style={{ marginRight: 4 }} />
      )}
      <Text style={{ color, fontSize: 11, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

// ====== Mini bar chart ======
export function BarChart({
  data,
  height = 120,
  color = COLORS.primary,
  labels,
}: {
  data: number[];
  height?: number;
  color?: string;
  labels?: string[];
}) {
  const max = Math.max(...data, 1);
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "flex-end", height, gap: 6 }}>
        {data.map((v, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <LinearGradient
              colors={[color, COLORS.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                width: "100%",
                height: (v / max) * height,
                borderRadius: 6,
              }}
            />
          </View>
        ))}
      </View>
      {labels && (
        <View style={{ flexDirection: "row", marginTop: 6, gap: 6 }}>
          {labels.map((l, i) => (
            <Text
              key={i}
              style={{ flex: 1, textAlign: "center", fontSize: 10, color: COLORS.text.tertiary }}
            >
              {l}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

// ====== ModuleCard ======
export function ModuleCard({
  title,
  description,
  icon,
  onPress,
  testID,
  color = COLORS.primary,
  bg = "rgba(37,99,235,0.10)",
}: {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress: () => void;
  testID?: string;
  color?: string;
  bg?: string;
}) {
  return (
    <Card onPress={onPress} testID={testID} style={{ flex: 1 }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: SPACING.md,
        }}
      >
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Text style={{ fontSize: 15, fontWeight: "700", color: COLORS.text.primary }}>{title}</Text>
      <Text style={{ fontSize: 12, color: COLORS.text.secondary, marginTop: 4 }}>{description}</Text>
    </Card>
  );
}

export { Feather, Ionicons, MaterialCommunityIcons };
