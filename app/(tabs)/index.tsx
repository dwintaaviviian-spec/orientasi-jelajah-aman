
// app/(tabs)/index.tsx
import { useTema } from "../../context/ThemeContext";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Button,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  router,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import StatusData from "../../components/StatusData";

import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
  hapusCacheKota,
} from "../../services/cacheRepository";
import {
  mintaIzinLokasi,
  ambilKoordinatSaatIni,
} from "../../services/locationService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca } from "../../constants/weatherCodes";

import { HasilGeocoding } from "../../types/geocoding";
import {
  HasilCuacaOffline,
  RingkasanKotaTersimpan,
} from "../../types/cache";
import { ambilSemuaFavorit } from "../../services/favoritStorage";
import { simpanRiwayatPencarian } from "../../services/riwayatPencarianStorage";

export default function HalamanUtama() {
  const { temaGelap } = useTema();
  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] =
    useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] =
    useState<RingkasanKotaTersimpan[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const [sudahFavorit, setSudahFavorit] = useState(false);

  const [popupHapus, setPopupHapus] = useState<{
  nama: string;
  latitude: number;
  longitude: number;
} | null>(null);

  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0); // Pencegah race condition
  
const params = useLocalSearchParams<{
  riwayatId?: string;
  riwayatNama?: string;
  riwayatLat?: string;
  riwayatLon?: string;
  riwayatCountry?: string;
  riwayatWaktu?: string;
}>();

async function cekStatusFavorit(id: number) {
  try {
    const favorit = await ambilSemuaFavorit();

    setSudahFavorit(
      favorit.some((item) => item.id === id)
    );
  } catch (err) {
    console.warn("Gagal memeriksa favorit:", err);
  }
}
  async function muatKotaTersimpan() {
    setKotaTersimpan(await daftarKotaTersimpan());
  }

  async function prosesHapusCache(
  latitude: number,
  longitude: number
) {
  await hapusCacheKota(latitude, longitude);
  await muatKotaTersimpan();

  // Bersihkan tampilan cuaca jika sedang menampilkan kota yang dihapus
  if (
    kotaTerpilih &&
    kotaTerpilih.latitude.toFixed(2) === latitude.toFixed(2) &&
    kotaTerpilih.longitude.toFixed(2) === longitude.toFixed(2)
  ) {
    setHasil(null);
    setKotaTerpilih(null);
  }
}

function konfirmasiHapusCache(
  nama: string,
  latitude: number,
  longitude: number
) {
  if (Platform.OS === "web") {
    if (window.confirm(`Yakin ingin menghapus cache ${nama}?`)) {
      void prosesHapusCache(latitude, longitude).catch((err) => {
        console.warn("Gagal menghapus cache kota:", err);
      });
    }
    return;
  }

  setPopupHapus({ nama, latitude, longitude });
}
  // Hapus cache lebih dari 7 hari saat aplikasi dibuka
  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []);

  // Pencarian kota dengan debounce
  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }

    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);

  async function pilihKota(
    kota: HasilGeocoding,
    paksaPerbarui = false
  ) {
    setKotaTerpilih(kota);
    void cekStatusFavorit(kota.id);

    const idSaatIni = ++requestIdRef.current;

    setSedangMemuat(true);
    setPesanError(null);

    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui }
      );

      if (idSaatIni !== requestIdRef.current) return;

      setHasil(data);

try {
  await simpanRiwayatPencarian(kota);
} catch (err) {
  console.warn("Gagal menyimpan riwayat pencarian:", err);
}

muatKotaTersimpan();
    } catch (err) {
      if (idSaatIni !== requestIdRef.current) return;

      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi."
      );
    } finally {
      if (idSaatIni === requestIdRef.current) {
        setSedangMemuat(false);
      }
    }
  }

  
useFocusEffect(
  useCallback(() => {
    void muatKotaTersimpan();

    if (kotaTerpilih) {
      void cekStatusFavorit(kotaTerpilih.id);
    }
  }, [kotaTerpilih])
);

  // Membuka kembali kota yang dipilih dari tab Riwayat
  useEffect(() => {
    if (
      !params.riwayatWaktu ||
      !params.riwayatNama ||
      !params.riwayatLat ||
      !params.riwayatLon
    ) {
      return;
    }

    const kota: HasilGeocoding = {
      id: Number(params.riwayatId),
      name: params.riwayatNama,
      latitude: Number(params.riwayatLat),
      longitude: Number(params.riwayatLon),
      country: params.riwayatCountry ?? "",
    };

    void pilihKota(kota);
  }, [params.riwayatWaktu]);


  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();

    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas."
      );
      return;
    }

    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual."
      );
      return;
    }

    setPesanLokasi(null);

    const koordinat = await ambilKoordinatSaatIni();

    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }

  return (
    <SafeAreaView
  style={{
    flex: 1,
    backgroundColor: temaGelap ? "#191526" : "#F7F4FC",
  }}
>
      <ScrollView
  style={{
    backgroundColor: temaGelap ? "#191526" : "#F7F4FC",
  }}
  contentContainerStyle={{ padding: 16, gap: 16 }}
  keyboardShouldPersistTaps="handled"
>
        <SearchBox onCari={setTeksCari} />

        <Button
  title="Gunakan Lokasi Saat Ini"
  color={temaGelap ? "#B7A5F5" : "#8870C9"}
  onPress={gunakanLokasiSaatIni}
/>

        {pesanLokasi && (
          <Text accessibilityLabel={pesanLokasi}>{pesanLokasi}</Text>
        )}

      
{hasilPencarian.map((kota) => (
  <TouchableOpacity
    key={kota.id}
    onPress={() => pilihKota(kota)}
   style={{
  backgroundColor: temaGelap ? "#29233B" : "#FFFFFF",
  borderWidth: 1,
  borderColor: temaGelap ? "#403653" : "#E6DFF2",
  borderRadius: 8,
  padding: 10,
}}
  >
    <Text
      style={{
        color: temaGelap ? "#C0B6D6" : "#766D88",
        fontSize: 16,
      }}
    >
      {kota.name}
    </Text>
  </TouchableOpacity>
))}


        {kotaTersimpan.length > 0 && (
          <View style={{ gap: 6 }}>
            <Text
  style={{
    fontWeight: "bold",
    color: temaGelap ? "#C0B6D6" : "#302747",
  }}
>
  Tersimpan di perangkat (bisa dibuka offline)
</Text>

            {kotaTersimpan.map((k) => (
  <View
    key={k.kunci}
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      padding: 10,
      borderWidth: 1,
      backgroundColor: temaGelap ? "#29233B" : "#FFFFFF",
borderColor: temaGelap ? "#403653" : "#E6DFF2",
      borderRadius: 10,
    }}
  >
    <TouchableOpacity
      style={{ flex: 1, paddingVertical: 6 }}
      onPress={() =>
        pilihKota({
          id: k.id,
          name: k.nama,
          latitude: k.latitude,
          longitude: k.longitude,
          country: "",
        })
      }
    >
      <Text
  style={{
    color: temaGelap ? "#B7A5F5" : "#8870C9",
    fontWeight: "600",
  }}
>
  {k.nama}
</Text>
      <Text style={{ fontSize: 12, color: "#777" }}>
        Ketuk untuk membuka cuaca
      </Text>
    </TouchableOpacity>

    <Button
      title="Hapus Cache"
      color="#D9534F"
      onPress={() =>
        konfirmasiHapusCache(
          k.nama,
          k.latitude,
          k.longitude
        )
      }
    />
  </View>
))}
          </View>
        )}

        {sedangMemuat && <ActivityIndicator />}

        {pesanError && (
          <View>
            <Text accessibilityLabel={pesanError}>{pesanError}</Text>

            <Button
              title="Coba Lagi"
              onPress={() =>
                kotaTerpilih && pilihKota(kotaTerpilih, true)
              }
            />
          </View>
        )}

        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />

            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(
                hasil.kualitasUdara.indeksAQI
              )}
            />

            <Text style={{ fontSize: 12, color: "#888888" }}>
              Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}{" "}
              {"\u2022"} Angin {hasil.cuaca.saatIni.kecepatanAngin} km/j
            </Text>

           <Button
  title="Perbarui Sekarang"
  color={temaGelap ? "#B7A5F5" : "#8870C9"}
  onPress={() => pilihKota(kotaTerpilih, true)}
/>

           <Button
  title={
    sudahFavorit
      ? "✓ Sudah Ditambahkan"
      : "Tambahkan ke Favorit"
  }
  color={
  sudahFavorit
    ? (temaGelap ? "#65C995" : "#2E8B57")
    : (temaGelap ? "#B7A5F5" : "#8870C9")
}
  disabled={sudahFavorit}
  onPress={() =>
    router.push({
      pathname: "/tambah-favorit",
      params: {
        id: String(kotaTerpilih.id),
        nama: kotaTerpilih.name,
        lat: String(kotaTerpilih.latitude),
        lon: String(kotaTerpilih.longitude),
      },
    })
  }
/>
          </>
        )}

       
        <AtribusiCuaca />
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
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 420,
              padding: 24,
              borderRadius: 12,
              backgroundColor: temaGelap ? "#29233B" : "#FFFFFF",
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: temaGelap ? "#F3EEFF" : "#302747",
                marginBottom: 16,
              }}
            >
              Hapus Cache Kota
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: temaGelap ? "#C0B6D6" : "#766D88",
                marginBottom: 24,
              }}
            >
              Yakin ingin menghapus cache {popupHapus?.nama} dari perangkat?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 20,
              }}
            >
              <Pressable onPress={() => setPopupHapus(null)}>
                <Text style={{ color: temaGelap ? "#BBBBBB" : "#555555" }}>
                  BATAL
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  if (!popupHapus) return;

                  const { latitude, longitude } = popupHapus;
                  setPopupHapus(null);

                  void prosesHapusCache(latitude, longitude).catch((err) => {
                    console.warn("Gagal menghapus cache kota:", err);
                  });
                }}
              >
                <Text style={{ color: "#EF5350", fontWeight: "bold" }}>
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
