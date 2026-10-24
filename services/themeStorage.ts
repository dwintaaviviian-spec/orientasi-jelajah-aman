
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PilihanTema = "terang" | "gelap" | "sistem";

const KUNCI_TEMA = "@jelajah_aman/pilihan_tema";

export async function ambilPilihanTema(): Promise<PilihanTema> {
  const tema = await AsyncStorage.getItem(KUNCI_TEMA);

  if (tema === "terang" || tema === "gelap" || tema === "sistem") {
    return tema;
  }

  return "sistem";
}

export async function simpanPilihanTema(
  tema: PilihanTema
): Promise<void> {
  await AsyncStorage.setItem(KUNCI_TEMA, tema);
}
