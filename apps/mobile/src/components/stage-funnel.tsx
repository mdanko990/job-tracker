import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { trpc } from "@/lib/trpc";
import { getStatusColor } from "@/constants/status";

const STAGE_LABELS: Record<string, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  SCREENING: "1st interview",
  TECHNICAL_INTERVIEW: "2nd interview",
  OFFER: "Offer",
};

/**
 * How far applications got: each row counts applications that reached at
 * least that stage, even if they were later rejected, withdrawn or ghosted.
 */
export function StageFunnel() {
  const { data, isLoading, error } = trpc.analytics.stageFunnel.useQuery();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>How far applications got</Text>
      <Text style={styles.subtitle}>
        Furthest stage reached, including rejected ones
      </Text>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : error ? (
        <Text style={styles.muted}>Couldn&apos;t load stats.</Text>
      ) : (
        (data ?? []).map(({ stage, count }) => (
          <View key={stage} style={styles.row}>
            <View
              style={[styles.dot, { backgroundColor: getStatusColor(stage) }]}
            />
            <Text style={styles.label}>{STAGE_LABELS[stage] ?? stage}</Text>
            <Text style={styles.count}>{count}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: -8,
  },
  loader: {
    paddingVertical: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    flex: 1, // pushes the count to the right edge
    color: "#6B7280",
  },
  count: {
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  muted: {
    color: "#6B7280",
  },
});
