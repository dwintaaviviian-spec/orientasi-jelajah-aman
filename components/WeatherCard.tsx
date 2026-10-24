// components/WeatherCard.tsx

import { View, Text } from "react-native";
import { useTema } from "../context/ThemeContext";
import { WeatherCardProps, TingkatAQI } from "../types/cuaca";
import { typeScale, spacing } from "../constants/styles";

const warnaPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "green",
  SEDANG: "goldenrod",
  TIDAK_SEHAT: "orange",
  BERBAHAYA: "crimson",
};


const rekomendasiPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "Udara baik. Nikmati aktivitas di luar ruangan.",
  SEDANG:
    "Udara cukup baik, tetapi kelompok sensitif sebaiknya memperhatikan kondisi tubuh.",
  TIDAK_SEHAT:
    "Kurangi aktivitas luar ruangan yang terlalu lama, terutama jika sensitif terhadap polusi.",
  BERBAHAYA:
    "Hindari aktivitas luar ruangan yang tidak diperlukan dan kurangi paparan polusi.",
};


export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
  indeksAQI,
}: WeatherCardProps) {
  const { temaGelap } = useTema();
  const teksAQI =
    indeksAQI !== undefined
      ? `AQI: ${indeksAQI} (${tingkatAQI})`
      : `AQI: ${tingkatAQI}`;

  const labelAksesibilitas =
    indeksAQI !== undefined
      ? `Cuaca ${kota}, suhu ${suhu} derajat, indeks kualitas udara ${indeksAQI}, kategori ${tingkatAQI}`
      : `Cuaca ${kota}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}`;

  return (
    <View
      accessible
      accessibilityLabel={labelAksesibilitas}
      style={{
        padding: spacing.sedang,
        borderRadius: 8,
        backgroundColor: temaGelap ? "#29233B" : "#FFFFFF",
borderWidth: 1,
borderColor: temaGelap ? "#403653" : "#E6DFF2",
      }}
    >
      <Text
  style={{
    fontWeight: "bold",
    fontSize: typeScale.judul,
    color: temaGelap ? "#F3EEFF" : "#302747",
  }}
>
  {kota}
</Text>

      <Text
  style={{
    fontSize: 32,
    color: temaGelap ? "#F3EEFF" : "#302747",
  }}
>
  {suhu}°C
</Text>

      <Text
        style={{
          color: warnaPerTingkat[tingkatAQI],
          
          fontSize: typeScale.isi,
        }}
      >
        {teksAQI}
      </Text>
      
      <View
        style={{
          marginTop: spacing.sedang,
          padding: spacing.sedang,
          borderRadius: 8,
          backgroundColor: temaGelap ? "#332D24" : "#FFF4E5",
          borderLeftWidth: 4,
          borderLeftColor: warnaPerTingkat[tingkatAQI],
        }}
      >
        <Text
          style={{
            fontSize: typeScale.isi,
            fontWeight: "bold",
            color: temaGelap ? "#FFE0B2" : "#7A4100",
            marginBottom: 4,
          }}
        >
          Rekomendasi Kesehatan Udara
        </Text>

        <Text
          style={{
            fontSize: typeScale.isi,
            color: temaGelap ? "#E0DAD2" : "#493A2A",
          }}
        >
          {rekomendasiPerTingkat[tingkatAQI]}
        </Text>
      </View>

    </View>
  );
}