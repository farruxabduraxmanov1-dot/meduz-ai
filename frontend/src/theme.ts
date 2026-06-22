// MedUZ AI — Design tokens
import { Platform } from "react-native";

export const COLORS = {
  bg: "#F5F7FF",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F4FA",
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  secondary: "#7C3AED",
  accent: "#6366F1",
  gradient: ["#2563EB", "#6366F1", "#7C3AED"] as const,
  gradientSoft: ["#EEF2FF", "#F5F3FF"] as const,
  text: {
    primary: "#0F172A",
    secondary: "#475569",
    tertiary: "#94A3B8",
    inverse: "#FFFFFF",
  },
  border: "#E5E7EB",
  borderSoft: "#EEF2F7",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  star: "#F59E0B",
} as const;

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const SHADOW = {
  soft: {
    shadowColor: "#2563EB",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  card: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  floating: {
    shadowColor: "#7C3AED",
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
} as const;

export const FONT = {
  family: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "System",
  }),
} as const;
