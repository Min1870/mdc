import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

interface MyButtonProps {
  title: string;
}

const MyButton = ({ title }: MyButtonProps) => {
  return (
    <Pressable onPress={() => {}} style={styles.btn}>
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
};

export default MyButton;

const styles = StyleSheet.create({
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: 700,
  },
  btn: {
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 21,
    paddingVertical: 11,
    borderRadius: 7,
  },
});
