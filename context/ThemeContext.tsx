
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import {
  ambilPilihanTema,
  simpanPilihanTema,
  PilihanTema,
} from "../services/themeStorage";

export const themeColors = {
  terang: {
    background: "#F7F4FC",
    card: "#FFFFFF",
    primary: "#8870C9",
    primarySoft: "#EAE3F8",
    text: "#302747",
    textSecondary: "#766D88",
    border: "#E6DFF2",
    input: "#FFFFFF",
    tabBar: "#FFFFFF",
    success: "#2E8B57",
    danger: "#E5484D",
  },
  gelap: {
    background: "#191526",
    card: "#29233B",
    primary: "#B7A5F5",
    primarySoft: "#332A4B",
    text: "#F3EEFF",
    textSecondary: "#C0B6D6",
    border: "#403653",
    input: "#29233B",
    tabBar: "#211B30",
    success: "#65C995",
    danger: "#FF777C",
  },
};

type ThemeContextType = {
  tema: PilihanTema;
  temaGelap: boolean;
  ubahTema: (tema: PilihanTema) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const skemaSistem = useColorScheme();
  const [tema, setTema] = useState<PilihanTema>("sistem");

  useEffect(() => {
    ambilPilihanTema().then(setTema);
  }, []);

  async function ubahTema(pilihan: PilihanTema) {
    setTema(pilihan);
    await simpanPilihanTema(pilihan);
  }

  const temaGelap =
    tema === "gelap" ||
    (tema === "sistem" && skemaSistem === "dark");

  return (
    <ThemeContext.Provider value={{ tema, temaGelap, ubahTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTema() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTema harus digunakan di dalam ThemeProvider");
  }

  return context;
}
