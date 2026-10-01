import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { trpc } from "@/lib/trpc";
import { StatusDonut } from "@/components/status-donut";
import {
  getStatusColor,
  RANGES,
  STATUS_LABELS,
  type Range,
} from "@/constants/status";

/**
 * Swipeable list of status charts — one page per date range. Swipe
 * horizontally or tap a range label to switch.
 */
export function StatusChartsPager() {
  const listRef = useRef<FlatList<(typeof RANGES)[number]>>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [index, setIndex] = useState(0);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth > 0) {
      setIndex(Math.round(event.nativeEvent.contentOffset.x / pageWidth));
    }
  };

  const goTo = (i: number) => {
    setIndex(i);
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };

  return (
    <View
      style={styles.card}
      onLayout={(e) => setPageWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.tabs}>
        {RANGES.map((range, i) => (
          <Pressable
            key={range.value}
            onPress={() => goTo(i)}
            style={[styles.tab, i === index && styles.tabActive]}
          >
            <Text style={[styles.tabText, i === index && styles.tabTextActive]}>
              {range.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {pageWidth > 0 && (
        <FlatList
          ref={listRef}
          data={RANGES}
          keyExtractor={(item) => item.value}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          getItemLayout={(_, i) => ({
            length: pageWidth,
            offset: pageWidth * i,
            index: i,
          })}
          renderItem={({ item }) => (
            <View style={{ width: pageWidth }}>
              <RangeChart range={item.value} />
            </View>
          )}
        />
      )}

      <View style={styles.dots}>
        {RANGES.map((range, i) => (
          <View
            key={range.value}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

function RangeChart({ range }: { range: Range }) {
  const { data, isLoading, error } = trpc.analytics.statusBreakdown.useQuery({
    range,
  });

  if (isLoading) {
    return (
      <View style={styles.placeholder}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.muted}>Couldn&apos;t load stats.</Text>
      </View>
    );
  }

  const segments = (data ?? [])
    .filter((d) => d.count > 0)
    .map((d) => ({
      key: d.status,
      value: d.count,
      color: getStatusColor(d.status),
      label: STATUS_LABELS[d.status] ?? d.status,
    }));

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  if (total === 0) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.muted}>No applications in this period.</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <StatusDonut segments={segments} centerLabel="Applications" />

      <View style={styles.legend}>
        {segments.map((s) => (
          <View key={s.key} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: s.color }]} />
            <Text>
              <Text style={styles.percent}>
                {Math.round((s.value / total) * 100)}%
              </Text>{" "}
              <Text style={styles.muted}>{s.label}</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 12,
    overflow: "hidden",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tabActive: {
    backgroundColor: "#111827",
  },
  tabText: {
    fontSize: 13,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  page: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  placeholder: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 16,
    rowGap: 8,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  percent: {
    fontWeight: "600",
  },
  muted: {
    color: "#6B7280",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
  },
  dotActive: {
    backgroundColor: "#111827",
  },
});
