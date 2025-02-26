import Cart from "@/components/shop/Cart";
import PagerViewScreen from "@/components/shop/PagerView";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { HStack } from "@/components/ui/hstack";
import {
  AddIcon,
  CloseCircleIcon,
  Icon,
  RemoveIcon,
} from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { products } from "@/data";
import { Stack, useLocalSearchParams } from "expo-router";
import { CheckIcon, Heart, StarIcon } from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";

type CartProps = {
  id: number;
  color: string;
  size: string;
  quantity: number;
};

const Detail = () => {
  const { id } = useLocalSearchParams();
  const product = products.find((p) => p.id === +id);
  const [colors, setColors] = React.useState([]);
  const [size, setSize] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [cart, setCart] = React.useState<CartProps[]>([]);
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => {
    setShowActionsheet(false);
    if (quantity === 0) {
      return;
    }
    // Add to cart
    colors.forEach((color) => {
      size.forEach((size) => {
        setCart((prev) => [
          { id: Math.random(), color, size, quantity },
          ...prev,
        ]);
      });
    });
    // Reset
    setColors([]);
    setSize([]);
    setQuantity(1);
  };

  const toast = useToast();
  const [toastId, setToastId] = React.useState(0);
  const handleToast = () => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast();
    }
  };
  const showNewToast = () => {
    const newId = Math.random();
    setToastId(newId);
    toast.show({
      id: newId.toString(),
      placement: "bottom",
      duration: 2000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action="info" variant="solid">
            <ToastTitle>{`Please choose ${colors.length == 0 ? "color - " : ""} ${size.length == 0 ? "sizes - " : ""}`}</ToastTitle>
            <ToastDescription>
              Please set quantity after choosing colors and sizes
            </ToastDescription>
          </Toast>
        );
      },
    });
  };

  return (
    <VStack className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: "Product Details",
          headerBackTitle: "Home",
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "black",
          headerRight: () => (
            <Pressable className="mr-4">
              <Cart />
            </Pressable>
          ),
        }}
      />
      <PagerViewScreen />
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space="sm" className="mt-4 px-5">
          <HStack space="sm" className="justify-between">
            <HStack space="sm" className="items-center">
              <Text className="font-semibold text-gray-500">
                {product?.brand}
              </Text>
              <Icon as={StarIcon} size="xs" className="text-orange-500" />
              <Text size="sm">{product?.star}</Text>
              <Text size="xs" className="text-gray-500">
                ({product?.quantity})
              </Text>
            </HStack>
            <Pressable>
              <Icon
                as={Heart}
                className={`m-1 h-5 w-5 text-red-400 ${true && "fill-red-400"}`}
              />
            </Pressable>
          </HStack>
          <Text className="line-clamp-1 font-medium">{product?.title}</Text>
          <HStack space="sm" className="items-center">
            <Text className="font-medium text-green-700">
              ${product?.price.toFixed(2)}
            </Text>
            {product?.discount! > 0 && (
              <Text className="text-gray-500 line-through">
                ${product?.discount.toFixed(2)}
              </Text>
            )}
          </HStack>
          <Text>{product?.description}</Text>
          <Text className="mb-1 mt-2 font-medium">Choose Colors</Text>
          <CheckboxGroup
            value={colors}
            onChange={(keys) => {
              setColors(keys);
            }}
          >
            <HStack space="xl" className="flex-wrap">
              {product?.colors.map((color) => {
                if (!color.stock) {
                  return null;
                }
                return (
                  <Checkbox value={color.name} key={color.id}>
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel>{color.name}</CheckboxLabel>
                  </Checkbox>
                );
              })}
            </HStack>
          </CheckboxGroup>
          <Text className="mb-1 mt-2 font-medium">Choose Sizes</Text>
          <CheckboxGroup
            value={size}
            onChange={(keys) => {
              setSize(keys);
            }}
          >
            <HStack space="xl" className="flex-wrap">
              {product?.sizes.map((size) => {
                if (!size.stock) {
                  return null;
                }
                return (
                  <Checkbox value={size.name} key={size.id}>
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel>{size.name}</CheckboxLabel>
                  </Checkbox>
                );
              })}
            </HStack>
          </CheckboxGroup>
          <Box className="mt-6 self-start">
            <Button
              size="lg"
              className="rounded-lg bg-sky-500"
              onPress={() => {
                if (colors.length > 0 && size.length > 0) {
                  setShowActionsheet(true);
                  return;
                }
                handleToast();
              }}
            >
              <ButtonText>Set Quantity</ButtonText>
            </Button>
          </Box>
          {cart.length > 0 && (
            <VStack space="sm">
              {cart.map((c) => (
                <HStack
                  key={c.id}
                  className="items-center justify-between rounded-md bg-slate-100 px-2 py-1"
                >
                  <HStack className="items-center" space="md">
                    <Icon as={AddIcon} size="sm" />
                    <Text>
                      {c.color} - {c.size} ( {c.quantity} )
                    </Text>
                  </HStack>
                  <Button
                    size="md"
                    className="mr-4"
                    variant="link"
                    onPress={() =>
                      setCart((prev) => prev.filter((item) => item.id !== c.id))
                    }
                  >
                    <ButtonIcon as={CloseCircleIcon} />
                  </Button>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>
        <Box className="mb-48"/>
      </ScrollView>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full items-center justify-center pt-5">
            <Text bold>You Choose colors and size</Text>
            <Text>
              {colors.join(", ")} - {size.join(", ")}
            </Text>
            <Text bold className="mt-8">
              Please set quantity
            </Text>
            <Text bold className="my-8 text-5xl">
              {quantity}
            </Text>
            <HStack className="w-full" space="lg">
              <Button
                size="lg"
                className="flex-1 bg-sky-500"
                onPress={() => setQuantity((q) => q + 1)}
              >
                <ButtonText>Increase</ButtonText>
                <ButtonIcon as={AddIcon} />
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-sky-500"
                onPress={() => {
                  if (quantity == 0) {
                    return;
                  }
                  setQuantity((q) => q - 1);
                }}
              >
                <ButtonText>Decrease</ButtonText>
                <ButtonIcon as={RemoveIcon} />
              </Button>
            </HStack>
            <Button
              size="lg"
              className={`mb-12 mt-6 w-full bg-gray-500 ${quantity > 0 ? "bg-green-500" : "bg-gray-500"}`}
              onPress={handleClose}
            >
              <ButtonText className="font-bold">
                {quantity == 0 ? "Close" : "Confirm"}
              </ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
      <Box className="self-end">
        <Fab size="md" className="bottom-8 bg-green-500">
          <FabIcon size="md" as={AddIcon} />
          <FabLabel bold>Add To Cart</FabLabel>
        </Fab>
      </Box>
    </VStack>
  );
};

export default Detail;
