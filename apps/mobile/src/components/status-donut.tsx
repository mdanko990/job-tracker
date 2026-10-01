import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

export type DonutSegment = {
  key: string;
  value: number;
  color: string;
};

type Props = {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
};

const GAP = 2; // px between segments

/**
 * Donut chart drawn with one stroked circle per segment: each circle's dash
 * covers its share of the circumference, offset by the segments before it.
 */
export function StatusDonut({
  segments,
  size = 220,
  thickness = 28,
  centerLabel = "Total",
}: Props) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const gap = segments.length > 1 ? GAP : 0;

  // Where each segment starts along the circumference
  const arcs = segments.map((segment, i) => ({
    segment,
    length: (segment.value / total) * circumference,
    start:
      (segments.slice(0, i).reduce((sum, s) => sum + s.value, 0) / total) *
      circumference,
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Start at 12 o'clock instead of 3 o'clock */}
        <G rotation={-90} origin={`${center}, ${center}`}>
          {arcs.map(({ segment, length, start }) => (
            <Circle
              key={segment.key}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={thickness}
              strokeDasharray={`${Math.max(length - gap, 0)} ${circumference}`}
              strokeDashoffset={-start}
            />
          ))}
        </G>
      </Svg>

      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text style={styles.total}>{total}</Text>
        <Text style={styles.label}>{centerLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  total: {
    fontSize: 32,
    fontWeight: "700",
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
  },
});
