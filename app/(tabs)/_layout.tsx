
// app/(tabs)/_layout.tsx

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../../context/ThemeContext";

export default function TabLayout() {
  const { temaGelap } = useTema();

  const warna = {
  header: temaGelap ? "#29233B" : "#EAE3F8",
  latarTab: temaGelap ? "#29233B" : "#DCD0F4",
  teks: temaGelap ? "#F3EEFF" : "#302747",
  aktif: temaGelap ? "#D0C0FF" : "#7655B8",
  tidakAktif: temaGelap ? "#C0B6D6" : "#8D80A8",
  border: temaGelap ? "#403653" : "#D3C5EC",
};

  return (
    <Tabs
      screenOptions={{
        headerShown: true,

        headerTintColor: warna.teks,
        headerShadowVisible: false,

        headerStyle: {
          backgroundColor: warna.header,
          elevation: 0,
          shadowOpacity: 0,
        },

        headerTitleStyle: {
          fontWeight: "bold",
          color: warna.teks,
        },

        headerTitleAlign: "left",

        tabBarStyle: {
          backgroundColor: warna.latarTab,
          borderTopColor: warna.border,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },

        tabBarActiveTintColor: warna.aktif,
        tabBarInactiveTintColor: warna.tidakAktif,

        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarLabel: "Beranda",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat Pencarian",
          tabBarLabel: "Riwayat",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pengaturan"
        options={{
          title: "Pengaturan",
          tabBarLabel: "Pengaturan",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="tentang"
        options={{
          title: "Tentang",
          tabBarLabel: "Tentang",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={
                focused
                  ? "information-circle"
                  : "information-circle-outline"
              }
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
