import Cart from "@/components/shop/Cart";
import Category from "@/components/shop/Category";
import Product from "@/components/shop/Product";
import Title from "@/components/shop/Title";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { categories, products } from "@/data";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ArrowUpRight } from "lucide-react-native";
import React, { useState } from "react";
import { Dimensions } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function HomeScreen() {
  const [selected, setSelected] = useState(1);

  const width = Dimensions.get("screen").width

  const onSelectedHandler = (id: number) => {
    setSelected(id);
  };

  const goDetail = (id: number) => {
    router.navigate({ pathname: "/detail", params: { id } });
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <HStack className="my-2 items-center justify-between px-5">
        <Pressable>
          <Image
            style={{ width: 50, height: 50 }}
            source={require("@/assets/images/n.png")}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
        </Pressable>
        <Pressable className="mr-4">
          <Cart />
        </Pressable>
      </HStack>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          style={{ width: "100%", aspectRatio: 20 / 9 }}
          source={require("@/assets/images/banner6.png")}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <Box className="mt-4 px-5 pb-40">
          <Title title="Shop By Category" actionText="See all" />
          <FlashList
            data={categories}
            extraData={selected}
            renderItem={({ item }) => (
              <Category
                {...item}
                onSelect={onSelectedHandler}
                select={selected}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={80}
            contentContainerStyle={{ paddingBottom: 7 }}
          />
          <Title title="Recommended for You" actionText="See all" />
          <FlashList
            data={products}
            numColumns={width < 600 ? 2 : width < 768 ? 3 : 4}
            renderItem={({ item }) => (
              <Product {...item} onCallRoute={goDetail} />
            )}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={200}
            contentContainerStyle={{ paddingTop: 4 }}
          />
          <Button className="mt-8 w-[200px] h-14 rounded-lg bg-blue-500 text-white mx-auto">
            <ButtonText size="lg" className="font-bold">Explore More</ButtonText>
            <ButtonIcon as={ArrowUpRight} className="ml-2" />
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
