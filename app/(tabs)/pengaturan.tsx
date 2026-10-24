
// app/(tabs)/pengaturan.tsx

import { useTema } from "../../context/ThemeContext";
import { useState } from "react";
import {
  Text,
  View,
  Modal,
  Pressable,
  TouchableOpacity,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { hapusSemuaCache } from "../../services/cacheRepository";

export default function TabPengaturan() {
  const [pesan, setPesan] = useState<string | null>(null);
  const [konfirmasiHapus, setKonfirmasiHapus] = useState(false);
  const { tema, temaGelap, ubahTema } = useTema();

  const warna = {
    latar: temaGelap ? "#191526" : "#F7F4FC",
    kartu: temaGelap ? "#29233B" : "#FFFFFF",
    teks: temaGelap ? "#F3EEFF" : "#302747",
    teksSekunder: temaGelap ? "#C0B6D6" : "#766D88",
    border: temaGelap ? "#403653" : "#E6DFF2",
    aksen: temaGelap ? "#B7A5F5" : "#8870C9",
    aksenLembut: temaGelap ? "#332A4B" : "#EAE3F8",
    hapusLatar: temaGelap ? "#633544" : "#FBE7EF",
    hapusTeks: temaGelap ? "#FFB8C7" : "#B8325B",
  };

  async function hapusDataTersimpan() {
    if (Platform.OS === "web") {
      if (window.confirm("Yakin ingin menghapus semua cache cuaca?")) {
        try {
          await hapusSemuaCache();
          setPesan("Cache data sudah dihapus.");
        } catch {
          setPesan("Gagal menghapus cache data.");
        }
      }
      return;
    }

    setKonfirmasiHapus(true);
  }

  async function konfirmasiHapusSemua() {
    setKonfirmasiHapus(false);

    try {
      await hapusSemuaCache();
      setPesan("Data cuaca tersimpan sudah dihapus.");
    } catch {
      setPesan("Gagal menghapus data cuaca tersimpan.");
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
        backgroundColor: warna.latar,
      }}
    >
      <View
        style={{
          backgroundColor: warna.kartu,
          borderColor: warna.border,
          borderWidth: 1,
          borderRadius: 16,
          padding: 18,
          gap: 6,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: warna.teks,
          }}
        >
          Jelajah Aman
        </Text>

        <Text style={{ color: warna.teksSekunder }}>
          Versi 1.0.0
        </Text>
      </View>

      <View
        style={{
          backgroundColor: warna.kartu,
          borderColor: warna.border,
          borderWidth: 1,
          borderRadius: 16,
          padding: 18,
          gap: 12,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: warna.teks,
          }}
        >
          Tema Tampilan
        </Text>

        <Text style={{ color: warna.teksSekunder }}>
          Pilih tampilan aplikasi sesuai keinginanmu.
        </Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => void ubahTema("terang")}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              alignItems: "center",
              backgroundColor:
                tema === "terang" ? warna.aksen : warna.aksenLembut,
              borderWidth: 1,
              borderColor: warna.aksen,
            }}
          >
            <Text
              style={{
                color:
                  tema === "terang" ? "#FFFFFF" : warna.teks,
                fontWeight: "bold",
              }}
            >
              {tema === "terang" ? "✓ Terang" : "☀ Terang"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => void ubahTema("gelap")}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              alignItems: "center",
              backgroundColor:
                tema === "gelap" ? warna.aksen : warna.aksenLembut,
              borderWidth: 1,
              borderColor: warna.aksen,
            }}
          >
            <Text
              style={{
                color:
                  tema === "gelap" ? "#FFFFFF" : warna.teks,
                fontWeight: "bold",
              }}
            >
              {tema === "gelap" ? "✓ Gelap" : "☾ Gelap"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: warna.teksSekunder }}>
          Tema aktif: {temaGelap ? "Gelap" : "Terang"}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: warna.kartu,
          borderColor: warna.border,
          borderWidth: 1,
          borderRadius: 16,
          padding: 18,
          gap: 12,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: warna.teks,
          }}
        >
          Penyimpanan Data
        </Text>

        <Text style={{ color: warna.teksSekunder }}>
          Hapus cache cuaca yang tersimpan di aplikasi.
        </Text>

        <TouchableOpacity
          onPress={hapusDataTersimpan}
          style={{
            backgroundColor: warna.hapusLatar,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: warna.hapusTeks,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            HAPUS SEMUA CACHE DATA KOTA
          </Text>
        </TouchableOpacity>

        {pesan && (
          <Text
            accessibilityLabel={pesan}
            style={{
              color: warna.teksSekunder,
              fontSize: 13,
            }}
          >
            {pesan}
          </Text>
        )}
      </View>

      <Modal
        visible={konfirmasiHapus}
        transparent
        animationType="fade"
        onRequestClose={() => setKonfirmasiHapus(false)}
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
              Hapus Semua Cache
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: warna.teksSekunder,
                marginBottom: 24,
              }}
            >
              Apakah kamu yakin ingin menghapus seluruh data cuaca
              tersimpan?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 24,
              }}
            >
              <Pressable
                onPress={() => setKonfirmasiHapus(false)}
              >
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
                onPress={() => void konfirmasiHapusSemua()}
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
