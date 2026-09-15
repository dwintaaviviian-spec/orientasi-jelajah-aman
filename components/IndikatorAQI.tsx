import { View, Text } from "react-native";
import { LaporanUdara } from "../types/cuaca";

export default function IndikatorAQI({ kota, indeksAQI, tingkat, diperbaruiPada }: LaporanUdara) {
  const warnaMap: Record<string, string> = {
    BAIK: "green",
    SEDANG: "orange",
    TIDAK_SEHAT: "red",
    BERBAHAYA: "purple",
  };

  return (
    <View style={{ padding: 12, borderRadius: 8, backgroundColor: "#EFEFEF" }}>
      <Text style={{ fontWeight: "bold" }}>{kota}</Text>
      <Text>Indeks AQI: {indeksAQI}</Text>
      <Text style={{ color: warnaMap[tingkat] || "black", fontWeight: "bold" }}>
        Status: {tingkat}
      </Text>
      {diperbaruiPada && <Text style={{ fontSize: 10 }}>Diperbarui: {diperbaruiPada}</Text>}
    </View>
  );
}