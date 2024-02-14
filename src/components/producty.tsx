import {
  Image,
  ImageProps,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { forwardRef } from "react";

interface ProductDataProps extends TouchableOpacityProps {
  title: string;
  description: string;
  price: number;
  thumbnail: ImageProps;
  quantity?: number;
}

interface ProductProps extends TouchableOpacityProps {
  data: ProductDataProps;
}

export const Product = forwardRef<TouchableOpacity, ProductProps>(
  ({ data, ...rest }, ref) => {
    return (
      <TouchableOpacity
        className="w-full flex-row items-center pb-4"
        ref={ref}
        {...rest}
      >
        <Image source={data.thumbnail} className="h-20 w-20 rounded-md" />
        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-slate-100 font-subtitle text-base flex-1">
              {data.title}
            </Text>

            {data.quantity && (
              <Text className="text-slate-400 font-subtitle text-sm">
                {data.quantity}x
              </Text>
            )}
          </View>

          <Text className="text-slate-400 text-xs leading-5 mt-0.5">
            {data.description}
          </Text>
          <Text className="text-white font-bold text-lg mt-2">
            R$ {data.price.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);