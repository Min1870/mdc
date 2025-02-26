import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { API_URL } from "@/config";
interface CardProps {
  id: number;
  name: string;
  image: string;
}

const { width, height } = Dimensions.get("screen");

const Card = ({ id, name, image }: CardProps) => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <Pressable
      onPress={() => setIsClicked(!isClicked)}
      style={[styles.card, isClicked && { backgroundColor: "#0a7ea4" }]}
    >
      {/* <Text style={styles.text}>{name}</Text> */}
      <Image source={`${API_URL}/${image}`} style={styles.image} />
    </Pressable>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    width: width / 2 - 24,
    height: 200,
    backgroundColor: "#607076",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 27,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
