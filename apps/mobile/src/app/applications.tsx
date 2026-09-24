// app/index.tsx
import { View, FlatList } from "react-native";
import { router } from "expo-router";
import { ApplicationCard } from "@/components/application-card";
import { trpc } from "@/lib/trpc";

export default function ApplicationsScreen() {
  const { data } = trpc.application.list.useQuery();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ApplicationCard
            title={item.title}
            company={item.company.name}
            status={item.currentStatus}
            onPress={() => router.push(`/applications/${item.id}`)}
          />
        )}
      />
    </View>
  );
}
