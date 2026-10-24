
import { useTema } from "../context/ThemeContext";
import { View, Text, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { tambahFavorit } from "../services/favoritStorage";

export default function ModalTambahFavorit() {
  const { temaGelap } = useTema();
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();

  async function simpan() {
    await tambahFavorit({
      id: Number(id),
      nama,
      latitude: Number(lat),
      longitude: Number(lon),
    });

    router.back();
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
        backgroundColor: temaGelap ? "#191526" : "#F7F4FC",
      }}
    >
      <Text
        style={{
          color: temaGelap ? "#F3EEFF" : "#302747",
          fontSize: 16,
        }}
      >
        Tambahkan {nama} ke daftar favorit?
      </Text>

      <TouchableOpacity
        onPress={simpan}
        style={{
          backgroundColor: temaGelap ? "#B7A5F5" : "#8870C9",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: temaGelap ? "#191526" : "#FFFFFF",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Simpan
        </Text>
      </TouchableOpacity>
    </View>
  );
}
