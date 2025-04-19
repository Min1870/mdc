import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import {
  Bell,
  ChevronRight,
  Clipboard,
  CreditCard,
  Mail,
  MapPin,
  MessageCircleQuestion,
  User,
} from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Switch } from "@/components/ui/switch";
import { useSession } from "@/provider/ctx";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const profile = () => {
  const { signOut } = useSession();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card className="mb-6 mt-6 items-center">
          <Box className="relative">
            <Center className="absolute z-10 h-[86px] w-[86px]">
              <Text className="font-bold text-white">MK</Text>
            </Center>
            <Image
              style={[
                {
                  width: 86,
                  height: 86,
                  marginBottom: 7,
                  borderRadius: 43,
                  backgroundColor: "orange",
                },
              ]}
              source={require("@/assets/images/profile.jpg")}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
          </Box>
          <Text className="mt-2 text-xl font-bold text-blue-500">
            Min Khant
          </Text>
        </Card>
        <VStack className="px-5">
          <HStack className="items-center justify-between border-b border-gray-200 pb-6">
            <HStack>
              <Icon as={Clipboard} size="xl" color="gray" />
              <Text className="ml-4 font-semibold">My Orders</Text>
            </HStack>
            <Icon as={ChevronRight} size="lg" color="gray" />
          </HStack>
        </VStack>
        <Text className="mb-6 mt-4 px-5 text-xl font-bold">SETTINGS</Text>
        <VStack className="px-5" space="sm">
          <HStack className="items-center justify-between pb-6">
            <HStack>
              <Icon as={User} size="xl" color="gray" />
              <Text className="ml-4 font-semibold">Users Profile</Text>
            </HStack>
            <Icon as={ChevronRight} size="lg" color="gray" />
          </HStack>
          <HStack className="items-center justify-between pb-6">
            <HStack>
              <Icon as={Bell} size="xl" color="gray" />
              <VStack>
                <Text className="mb-2 ml-4 font-semibold">
                  Allow push notifications
                </Text>
                <Text className="ml-4 max-w-[90%] text-gray-400">
                  Get updates on your sales, purchases and key activities
                </Text>
              </VStack>
            </HStack>
            <Switch className="mb-10" size="md" isDisabled={false} />
          </HStack>
          <HStack className="items-center justify-between pb-6">
            <HStack>
              <Icon as={CreditCard} size="xl" color="gray" />
              <Text className="ml-4 font-semibold">Payment methods</Text>
            </HStack>
            <Icon as={ChevronRight} size="lg" color="gray" />
          </HStack>
          <HStack className="items-center justify-between border-b border-gray-200 pb-6">
            <HStack>
              <Icon as={MapPin} size="xl" color="gray" />
              <Text className="ml-4 font-semibold">Delivery address</Text>
            </HStack>
            <Icon as={ChevronRight} size="lg" color="gray" />
          </HStack>
        </VStack>
        <VStack className="mt-5 px-5" space="md">
          <Text className="mb-6 font-bold">HELP</Text>
          <VStack space="2xl">
            <HStack>
              <Icon as={MessageCircleQuestion} size="lg" color="gray" />
              <Text className="ml-4 font-semibold">FAQ</Text>
            </HStack>
            <HStack>
              <Icon as={Mail} size="lg" color="gray" />
              <Text className="ml-4 font-semibold">Support</Text>
            </HStack>
          </VStack>
          <VStack className="mt-4" space="md">
            <Text
              className="text-blue-400"
              onPress={() => {
                signOut();
              }}
            >
              Log out
            </Text>
            <Text className="text-blue-400">
              Privacy Policy | Terms & Conditions
            </Text>
            <Text className="text-blue-400">1.0.0</Text>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
