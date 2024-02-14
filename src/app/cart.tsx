import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { LinkButton } from "@/components/link-button";
import { Product } from "@/components/producty";
import { getCEP } from "@/services/gets";
import { ProductCartProps, useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, Alert, Linking } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function Cart() {
  const navigation = useNavigation();
  const cartStore = useCartStore();
  const [address, setAddress] = useState("");
  const [cep, setCep] = useState("");
  const [numberHouse, setNumberHouse] = useState("");
  const PHONE_NUMBER = "5548996084908";

  const total = formatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  useEffect(() => {
    if (cep.length !== 8) {
      setAddress("");
      return;
    }
    getCEP(cep).then((data) => {
      setAddress(
        `CEP-${data.cep} ${data.logradouro}, ${data.bairro}, ${data.localidade}`
      );
    });
  }, [cep]);

  function handleOrderSend() {
    if (address.trim() === "") {
      Alert.alert("Endereço de entrega", "Informe o endereço de entrega");
      return;
    }

    if (numberHouse.trim() === "") {
      Alert.alert("Número da casa", "Informe o número da casa");
      return;
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity} - ${product.title}x`)
      .join("");

    const message = `🍔 NOVO PEDIDO! 🧁
    \nEndereço: ${address} - ${numberHouse}

    \n${products}

    \nTotal: ${total}`;

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    );

    cartStore.clear();
    navigation.goBack();
  }

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert(
      "Remover produto",
      `Deseja remover ${product.title} do carrinho?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => cartStore.remove(product.id),
        },
      ]
    );
  }

  return (
    <View className="flex-1">
      <Header title="Seu carrinho" />
      <KeyboardAwareScrollView>
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-slate-700">
                {cartStore.products.map((product) => (
                  <Product
                    key={product.id}
                    data={product}
                    onPress={() => {
                      handleProductRemove(product);
                    }}
                  />
                ))}
              </View>
            ) : (
              <Text className="text-center text-slate-400 font-body my-8">
                Seu carrinho está vazio
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">Total:</Text>
              <Text className="text-lime-400 text-2xl font-heading">
                {total}
              </Text>
            </View>

            <View className="flex-row gap-2 mb-2">
              <Input
                placeholder="CEP"
                onChangeText={setCep}
                keyboardType="number-pad"
                value={cep}
                maxLength={8}
              />
              <Input
                placeholder="Número"
                onChangeText={setNumberHouse}
                value={numberHouse}
                keyboardType="number-pad"
              />
            </View>
            <Input placeholder="Endereço" value={address} editable={false} />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrderSend}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>
        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  );
}
