
import { useTema } from "../../context/ThemeContext";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ambilSemuaFavorit,
  hapusFavorit,
} from "../../services/favoritStorage";

import { KotaFavorit } from "../../types/favorit";
import {
  ambilRiwayatPencarian,
  hapusRiwayatPencarian,
} from "../../services/riwayatPencarianStorage";
import { HasilGeocoding } from "../../types/geocoding";

export default function TabRiwayat() {
  const { temaGelap } = useTema();

  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [riwayat, setRiwayat] = useState<HasilGeocoding[]>([]);
  const [popupHapus, setPopupHapus] = useState<{
    id: number;
    nama: string;
  } | null>(null);

  const warna = {
    latar: temaGelap ? "#191526" : "#F7F4FC",
    kartu: temaGelap ? "#29233B" : "#FFFFFF",
    teks: temaGelap ? "#F3EEFF" : "#302747",
    teksSekunder: temaGelap ? "#C0B6D6" : "#766D88",
    border: temaGelap ? "#403653" : "#E6DFF2",
    hapusLatar: temaGelap ? "#633544" : "#FBE7EF",
    hapusTeks: temaGelap ? "#FFB8C7" : "#B8325B",
    aksen: temaGelap ? "#B7A5F5" : "#8870C9",
  };

  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
      ambilRiwayatPencarian().then(setRiwayat);
    }, [])
  );

  async function prosesHapus(id: number) {
    await hapusFavorit(id);
    setDaftarFavorit((prev) => prev.filter((k) => k.id !== id));
  }

  function hapus(id: number, nama: string) {
    if (Platform.OS === "web") {
      const yakin = window.confirm(`Yakin hapus ${nama}?`);
      if (yakin) void prosesHapus(id);
      return;
    }

    setPopupHapus({ id, nama });
  }

  async function prosesHapusRiwayat(id: number) {
    await hapusRiwayatPencarian(id);
    const dataTerbaru = await ambilRiwayatPencarian();
    setRiwayat(dataTerbaru);
  }

  function konfirmasiHapusRiwayat(id: number, nama: string) {
    if (Platform.OS === "web") {
      if (window.confirm(`Yakin hapus riwayat ${nama}?`)) {
        void prosesHapusRiwayat(id);
      }
      return;
    }

    setPopupHapus({ id, nama });
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: warna.latar,
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          gap: 12,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator
      >
        {riwayat.length === 0 && (
          <Text style={{ color: warna.teks }}>
            Belum ada riwayat pencarian.
          </Text>
        )}

        {riwayat.map((kota) => (
          <View
            key={`${kota.id}-${kota.latitude}-${kota.longitude}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: warna.kartu,
              borderWidth: 1,
              borderColor: warna.border,
              borderRadius: 14,
              padding: 14,
              marginBottom: 10,
              elevation: temaGelap ? 2 : 1,
              shadowColor: temaGelap ? "#000000" : "#8870C9",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: temaGelap ? 0.15 : 0.08,
              shadowRadius: 4,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/",
                  params: {
                    riwayatId: String(kota.id),
                    riwayatNama: kota.name,
                    riwayatLat: String(kota.latitude),
                    riwayatLon: String(kota.longitude),
                    riwayatCountry: kota.country ?? "",
                    riwayatWaktu: String(Date.now()),
                  },
                })
              }
              style={{ flex: 1 }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: warna.teks,
                }}
              >
                {kota.name}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: warna.teksSekunder,
                  marginTop: 4,
                }}
              >
                Ketuk untuk melihat cuaca
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                konfirmasiHapusRiwayat(kota.id, kota.name)
              }
              style={{
                backgroundColor: warna.hapusLatar,
                paddingHorizontal: 12,
                paddingVertical: 9,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: warna.hapusTeks,
                  fontWeight: "bold",
                }}
              >
                HAPUS
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: warna.teks,
            marginTop: 8,
          }}
        >
          Kota Favorit
        </Text>

        <Text style={{ color: warna.teksSekunder }}>
          Tersimpan {daftarFavorit.length} kota
        </Text>

        {daftarFavorit.length === 0 && (
          <Text
            style={{
              fontSize: 12,
              color: warna.teksSekunder,
            }}
          >
            Belum ada kota favorit
          </Text>
        )}

        {daftarFavorit.map((kota) => (
          <View
            key={kota.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              backgroundColor: warna.kartu,
              borderWidth: 1,
              borderColor: warna.border,
              borderRadius: 12,
              padding: 14,
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: warna.teks,
                fontSize: 15,
                flex: 1,
              }}
            >
              {kota.nama}
            </Text>

            <TouchableOpacity
              onPress={() => hapus(kota.id, kota.nama)}
              style={{
                backgroundColor: warna.hapusLatar,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: warna.hapusTeks,
                  fontWeight: "bold",
                }}
              >
                HAPUS
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={popupHapus !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupHapus(null)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
            backgroundColor: "rgba(25,21,38,0.6)",
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 420,
              padding: 24,
              borderRadius: 16,
              backgroundColor: warna.kartu,
              borderWidth: 1,
              borderColor: warna.border,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: warna.teks,
                marginBottom: 16,
              }}
            >
              Konfirmasi Hapus
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: warna.teksSekunder,
                marginBottom: 24,
              }}
            >
              Yakin hapus {popupHapus?.nama}?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 24,
              }}
            >
              <Pressable onPress={() => setPopupHapus(null)}>
                <Text
                  style={{
                    color: warna.teksSekunder,
                    fontWeight: "600",
                  }}
                >
                  BATAL
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (!popupHapus) return;

                  const { id, nama } = popupHapus;
                  setPopupHapus(null);

                  if (
                    riwayat.some(
                      (kota) => kota.id === id && kota.name === nama
                    )
                  ) {
                    void prosesHapusRiwayat(id);
                  } else {
                    void prosesHapus(id);
                  }
                }}
              >
                <Text
                  style={{
                    color: warna.hapusTeks,
                    fontWeight: "bold",
                  }}
                >
                  HAPUS
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
