import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

interface Props extends PressableProps {
  children: string;
}

const ThemedPressable = ({ children, style, ...rest }: Props) => {


  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        
        { opacity: pressed ? 0.8 : 1 },
        style as any
      ]}

      className={"bg-blue-500 py-5 px-20 rounded-xl m-10"}
    >
      <Text className="text-white text-md font-semibold">{children}</Text>
    </Pressable>
  );
};

export default ThemedPressable;
