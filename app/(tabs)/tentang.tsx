// app/(tabs)/tentang.tsx
import { View, Text } from "react-native";
import { typeScale, spacing } from "../../constants/styles";

export default function TabTentang() {
  return (
    <View style={{ padding: spacing.sedang }}>
      <Text
        accessibilityLabel="Nama aplikasi Jelajah Aman"
        style={{
          fontSize: typeScale.judul,
          fontWeight: "bold",
          marginBottom: spacing.kecil,
        }}
      >
        Jelajah Aman
      </Text>

      <Text style={{ fontSize: typeScale.isi }}>
        Versi 1.0.0
      </Text>

      <Text
        style={{
          fontSize: typeScale.keterangan,
          marginTop: spacing.kecil,
        }}
      >
        Dibuat oleh Dwinta Vivian Acintya Syahda
      </Text>
    </View>
  );
}