
 // components/SearchBox.tsx
import { useState } from "react";
import { View, TextInput } from "react-native";
import { useTema } from "../context/ThemeContext";

interface SearchBoxProps {
  onCari: (teks: string) => void;
}

export default function SearchBox({ onCari }: SearchBoxProps) {
  const { temaGelap } = useTema();
  const [teks, setTeks] = useState("");

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru); // kirim setiap perubahan, debounce di pemanggilnya
  }

  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: 1,
          borderColor: temaGelap ? "#403653" : "#E6DFF2",
          backgroundColor: temaGelap ? "#29233B" : "#FFFFFF",
          color: temaGelap ? "#F3EEFF" : "#302747",
          padding: 12,
          borderRadius: 10,
          fontSize: 16,
        }}
        placeholderTextColor={
          temaGelap ? "#C0B6D6" : "#766D88"
        }
      />
    </View>
  );
}
