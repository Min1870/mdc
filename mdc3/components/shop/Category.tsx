import { Card } from "@/components/ui/card";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import { memo } from "react";
import type { CategoryType } from "@/types";
import { IMG_URL } from "@/config";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface CategoryProps extends CategoryType {
  onSelect: (id: number) => void;
  select: number;
};

 function Category({
  id,
  name,
  image,
  onSelect,
  select,
}: CategoryProps) {
  return (
    <Pressable onPress={() => onSelect(id)}>
      <Card className="items-center">
        <Image
          style={[
            { width: 56, height: 56, marginBottom: 7 },
            select === id && {
              borderColor: "orange",
              borderWidth: 2,
              borderRadius: 28,
            },
          ]}
          source={IMG_URL + image}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <Text size="sm" bold>
          {name}
        </Text>
      </Card>
    </Pressable>
  );
}

export default memo(Category)
