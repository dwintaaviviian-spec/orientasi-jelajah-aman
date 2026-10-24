
// app/(tabs)/tentang.tsx

import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTema } from "../../context/ThemeContext";

export default function TabTentang() {
  const { temaGelap } = useTema();

  const warna = {
    latar: temaGelap ? "#191526" : "#F7F4FC",
    kartu: temaGelap ? "#29233B" : "#FFFFFF",
    teks: temaGelap ? "#F3EEFF" : "#302747",
    teksSekunder: temaGelap ? "#C0B6D6" : "#766D88",
    border: temaGelap ? "#403653" : "#E6DFF2",
    aksen: temaGelap ? "#B7A5F5" : "#8870C9",
    aksenLembut: temaGelap ? "#332A4B" : "#EAE3F8",
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: warna.latar,
      }}
    >
      <View style={{ padding: 16 }}>
        <View
          style={{
            backgroundColor: warna.kartu,
            borderWidth: 1,
            borderColor: warna.border,
            borderRadius: 18,
            padding: 22,
            gap: 14,
            elevation: 2,
            shadowColor: temaGelap ? "#000000" : "#8870C9",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: temaGelap ? 0.15 : 0.08,
            shadowRadius: 6,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: warna.aksenLembut,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 30 }}>☁️</Text>
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: warna.teks,
            }}
          >
            Jelajah Aman
          </Text>

          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: warna.aksenLembut,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: warna.aksen,
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              VERSI 1.0.0
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: warna.border,
              marginVertical: 4,
            }}
          />

          <Text
            style={{
              fontSize: 14,
              color: warna.teksSekunder,
              lineHeight: 22,
            }}
          >
            Aplikasi Jelajah Aman.
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: warna.teksSekunder,
            }}
          >
            Dibuat oleh
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: warna.teks,
            }}
          >
            Dwinta Vivian Acintya Syahda
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
