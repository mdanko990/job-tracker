// components/application-card.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";

interface ApplicationCardProps {
  title: string;
  company: string;
  status: string;
  onPress?: () => void;
}

export function ApplicationCard({
  title,
  company,
  status,
  onPress,
}: ApplicationCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.company}>{company}</Text>
      <Text style={styles.status}>{status}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2, // Android shadow equivalent
  },
  title: { fontSize: 16, fontWeight: "600" },
  company: { fontSize: 14, color: "#666", marginTop: 4 },
  status: { fontSize: 12, color: "#888", marginTop: 8 },
});
