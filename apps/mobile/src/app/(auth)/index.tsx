import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusChartsPager } from "@/components/status-charts-pager";
import { StageFunnel } from "@/components/stage-funnel";

export default function Index() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Jobs</Text>
        <StatusChartsPager />
        <StageFunnel />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 160, // room for the floating tab bar
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});
