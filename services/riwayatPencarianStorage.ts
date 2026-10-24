
// services/riwayatPencarianStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { HasilGeocoding } from "../types/geocoding";

const KUNCI_RIWAYAT = "@jelajah_aman/riwayat_pencarian";
const MAKSIMAL_RIWAYAT = 10;

export async function ambilRiwayatPencarian(): Promise<HasilGeocoding[]> {
  const data = await AsyncStorage.getItem(KUNCI_RIWAYAT);

  if (!data) return [];

  try {
    return JSON.parse(data) as HasilGeocoding[];
  } catch {
    return [];
  }
}

export async function simpanRiwayatPencarian(
  kota: HasilGeocoding
): Promise<void> {
  const riwayat = await ambilRiwayatPencarian();

  const riwayatBaru = [
    kota,
    ...riwayat.filter((item) => item.id !== kota.id),
  ].slice(0, MAKSIMAL_RIWAYAT);

  await AsyncStorage.setItem(
    KUNCI_RIWAYAT,
    JSON.stringify(riwayatBaru)
  );
}

export async function hapusRiwayatPencarian(
  id: number
): Promise<void> {
  const riwayat = await ambilRiwayatPencarian();

  const riwayatBaru = riwayat.filter(
    (item) => item.id !== id
  );

  await AsyncStorage.setItem(
    KUNCI_RIWAYAT,
    JSON.stringify(riwayatBaru)
  );
}
