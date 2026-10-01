import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";

const TAB_BAR_WIDTH = 200;

export default function AuthLayout() {
  const { width: screenWidth } = useWindowDimensions();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#3a3e93",
        tabBarStyle: {
          position: "absolute", // float over the content
          left: screenWidth - TAB_BAR_WIDTH,
          right: TAB_BAR_WIDTH,
          bottom: 64,
          height: 64,
          width: 200,
          borderRadius: 32, // pill shape
          backgroundColor: "#fff",
          borderTopWidth: 0, // remove the default top line
          elevation: 8, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        },
        tabBarItemStyle: { paddingVertical: 8 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
