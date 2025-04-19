import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { ShoppingCart } from "lucide-react-native";
import { memo } from "react";
import useCartStore from "@/store/cartStore";

function Cart() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  return (
    <Box className="items-center">
      <VStack>
        <Badge
          className={`z-10 -mb-3.5 -mr-3.5 ${totalItems > 9 ? 'h-[28px] w-[28px]' :'h-[22px] w-[22px]'} self-end rounded-full bg-red-600`}
          variant="solid"
        >
          <BadgeText className="font-bold text-white">{totalItems}</BadgeText>
        </Badge>
        <Icon as={ShoppingCart} size="xl" />
      </VStack>
    </Box>
  );
}

export default memo(Cart);
