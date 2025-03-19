import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Cart from "@/components/shop/Cart";
import Title from "@/components/shop/Title";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Dimensions, ScrollView } from "react-native";
import apiClient from "@/api/axios";
import Category from "@/components/shop/Category";
import Product from "@/components/shop/Product";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import type { CategoryType, ProductType } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { ArrowUpRight } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
interface ProductApiResponse {
  products: ProductType[];
  [key: string]: any;
}

const fetchCategories = async (): Promise<CategoryType[]> => {
  console.log("Fetching Categories ---");

  const response = await apiClient.get("/users/categories");
  return response.data;
};

const fetchProducts = async (select = 1): Promise<ProductApiResponse> => {
  console.log("Fetching Products ---", select);

  const response = await apiClient.get(`/users/products?limit=8&category=${select}`);
  return response.data;
};

const toggleFavourite = async ({
  productId,
  favourite,
}: {
  productId: number;
  favourite: boolean;
}) => {
  console.log("Favourite api ----", productId);

  const response = await apiClient.patch("/users/products/favourite-toggle", {
    productId,
    favourite,
  });
  return response.data;
};

const Home = () => {
  // console.log("Rendering Home ----");

  const [select, setSelect] = useState(1);
  const width = Dimensions.get("screen").width;
  const numColumns = width < 600 ? 2 : width < 768 ? 3 : 4;
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading: isCategoryLoading,
    error: categoryError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (categories) {
      setSelect(categories[0].id);
    }
  }, [categories]);

  const {
    data,
    isLoading: isProductLoading,
    error: productError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products", select],
    queryFn: () => fetchProducts(select),
    staleTime: 5 * 60 * 1000, // 5 mins
  });

  const { mutate } = useMutation({
    mutationFn: toggleFavourite,
    onMutate: async ({ productId, favourite }) => {
      await queryClient.cancelQueries({ queryKey: ["products", select] });

      const previousProducts = queryClient.getQueryData(["products", select]);

      queryClient.setQueryData(["products", select], (oldData: any) => {
        if (oldData) return oldData;
        const favouriteData = favourite ? [{ id: 1 }] : [];

        return {
          ...oldData,
          products: oldData.products.map((product: any) =>
            product.id === productId
              ? { ...product, users: favouriteData }
              : product,
          ),
        };
      });

      return { previousProducts };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["products", select], context?.previousProducts);
      handleToast("An error occurs", error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", select] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  const handleToggleFavourite = (productId: number, favourite: boolean) => {
    mutate({ productId, favourite });
  };

  const onSelectHandler = useCallback((id: number) => {
    setSelect(id);
  }, []);

  const goDetail = (id: number) => {
    router.navigate({ pathname: "/detail", params: { id } });
  };

  const toast = useToast();
  const [toastId, setToastId] = React.useState(0);
  const handleToast = (title: string, description: string) => {
    if (!toast.isActive(toastId.toString())) {
      showNewToast(title, description);
    }
  };
  const showNewToast = useCallback((title: string, description: string) => {
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
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        );
      },
    });
  }, []);

  // if (isCategoryLoading || isProductLoading) {
  //   return <Text>Loading...</Text>;
  // }

  if (categoryError || productError) {
    return (
      <VStack className="flex-1 items-center justify-center">
        <Text className="mb-4">
          Error : {categoryError?.message || productError?.message}
        </Text>
        <Button
          size="md"
          variant="solid"
          action="primary"
          onPress={() => {
            refetchCategories();
            refetchProducts();
          }}
        >
          <ButtonText>Retry</ButtonText>
        </Button>
      </VStack>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HStack className="my-2 items-center justify-between px-5">
        <Pressable>
          <Image
            style={{ width: 50, height: 25 }}
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
          style={{
            width: "100%",
            aspectRatio: 20 / 9,
          }}
          source={require("@/assets/images/banner6.png")}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <Box className="mt-4 px-5 pb-40">
          <Title title="Shop By Category" actionText="See All" />
          {!isCategoryLoading ? (
            <FlashList
              data={categories}
              extraData={select}
              renderItem={({ item }) => (
                <Category
                  {...item}
                  onSelect={onSelectHandler}
                  select={select}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={80}
              contentContainerStyle={{ paddingBottom: 7 }}
            />
          ) : (
            <HStack className="my-4 gap-4 align-middle">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="circular"
                  className="mr-2 h-[56px] w-[56px]"
                />
              ))}
            </HStack>
          )}
          <Title title="Recommended for You" actionText="See All" />
          {!isProductLoading && (
            <FlashList
              data={data?.products}
              numColumns={numColumns}
              renderItem={({ item }) => (
                <Product
                  {...item}
                  onCallRoute={goDetail}
                  toggleFavourite={handleToggleFavourite}
                />
              )}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={200}
              contentContainerStyle={{ paddingTop: 4 }}
            />
          )}
          {!isProductLoading && data?.products.length == 0 && (
            <Box className="mt-4 h-52 w-full items-center justify-center rounded-lg bg-slate-100 p-5">
              <Text>Empty Product</Text>
            </Box>
          )}
          {!isProductLoading && (
            <Button className="mx-auto mt-8 h-14 w-[200px] rounded-lg bg-blue-500 text-white">
              <ButtonText size="lg" className="font-bold">
                Explore More
              </ButtonText>
              <ButtonIcon as={ArrowUpRight} className="ml-2" />
            </Button>
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
