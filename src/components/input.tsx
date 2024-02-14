import { TextInput, TextInputProps } from "react-native";
import colors from "tailwindcss/colors";

export function Input({ ...rest }: TextInputProps) {
  return (
    <TextInput
      textAlignVertical="top"
      placeholderTextColor={colors.slate[400]}
      className="h-12 flex-1 bg-slate-800 rounded-md px-4 py-3 text-white font-body text-sm"
      {...rest}
    />
  );
}
