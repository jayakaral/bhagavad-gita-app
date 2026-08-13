import { Text, TouchableOpacity, View } from "react-native";

interface Segment<T extends string | number> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string | number> {
  value: T;
  options: Segment<T>[];
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string | number>({ value, options, onChange }: SegmentedControlProps<T>) {
  return (
    <View className="flex-row rounded-xl bg-[#EFE8DC] p-1 dark:bg-[#252B3B]">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <TouchableOpacity
            key={String(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            activeOpacity={0.72}
            style={{
              flex: 1,
              alignItems: "center",
              borderRadius: 9,
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: selected ? "#FFFFFF" : "transparent",
              shadowColor: selected ? "#17243C" : "transparent",
              shadowOpacity: selected ? 0.08 : 0,
              shadowRadius: 3,
            }}
          >
            <Text className={selected ? "text-sm font-semibold text-[#17243C] dark:text-[#17243C]" : "text-sm font-medium text-[#776F62] dark:text-[#A9A79F]"}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
