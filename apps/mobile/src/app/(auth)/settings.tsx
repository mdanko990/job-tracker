import { useSession } from "@/ctx";
import { StyleSheet, Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { signOut } = useSession();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Settings</Text>
      <Button
        onPress={() => {
          // The guard in `RootNavigator` redirects back to the sign-in screen.
          signOut();
        }}
        title="Sign Out"
      ></Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // fill the screen (otherwise it shrinks to its content)
    alignItems: "center", // horizontal centering
    justifyContent: "center", // vertical centering
  },
});
