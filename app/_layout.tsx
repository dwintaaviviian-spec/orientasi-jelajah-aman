
import { Stack } from "expo-router";
import { ThemeProvider, useTema } from "../context/ThemeContext";

function RootStack() {
  const { temaGelap } = useTema();

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="detail/[kota]"
        options={{
          title: "Detail Cuaca",
          headerStyle: {
            backgroundColor: temaGelap ? "#121212" : "#FFFFFF",
          },
          headerTintColor: temaGelap ? "#FFFFFF" : "#222222",
          contentStyle: {
            backgroundColor: temaGelap ? "#121212" : "#F2F2F2",
          },
        }}
      />

      <Stack.Screen
        name="tambah-favorit"
        options={{
          presentation: "modal",
          title: "Tambah Favorit",
          headerStyle: {
            backgroundColor: temaGelap ? "#121212" : "#FFFFFF",
          },
          headerTintColor: temaGelap ? "#FFFFFF" : "#222222",
          headerShadowVisible: true,
          contentStyle: {
            backgroundColor: temaGelap ? "#121212" : "#F2F2F2",
          },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}
