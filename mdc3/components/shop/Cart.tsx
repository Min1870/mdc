import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { ShoppingCart } from "lucide-react-native";
import { memo } from "react";

function Cart() {
  console.log("---------------- Rendering Cart Icon -------------------");
  return (
    <Box className="items-center">
      <VStack>
        <Badge
          className="z-10 -mb-3.5 -mr-3.5 h-[22px] w-[22px] self-end rounded-full bg-red-600"
          variant="solid"
        >
          <BadgeText className="font-bold text-white">2</BadgeText>
        </Badge>
        <Icon as={ShoppingCart} size="xl" />
      </VStack>
    </Box>
  );
}

export default memo(Cart);
