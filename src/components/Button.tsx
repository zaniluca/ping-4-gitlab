import {
  composeRestyleFunctions,
  createBox,
  createVariant,
  spacing,
  SpacingProps,
  useRestyle,
  VariantProps,
} from "@shopify/restyle";
import React, { PropsWithChildren } from "react";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

import { Text } from "./restyle";
import { Theme } from "../utils/theme";

const BaseButton = createBox<Theme, TouchableOpacityProps>(TouchableOpacity);

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  createVariant({ themeKey: "buttonVariants" }),
]);

type RestyleProps = SpacingProps<Theme> & VariantProps<Theme, "buttonVariants">;

type Props = PropsWithChildren &
  RestyleProps & {
    onPress: () => void;
    label?: string;
  };

const Button: React.FC<Props> = ({ onPress, label, children, ...rest }) => {
  const props = useRestyle(restyleFunctions, rest);

  return (
    <BaseButton
      activeOpacity={0.9}
      onPress={onPress}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="xl"
      borderRadius={4}
      backgroundColor="accent"
      {...props}
    >
      {/* TODO: remove and integrate 12 in the padding */}
      <View style={{ paddingVertical: 12 }}>
        <Text
          fontWeight="600"
          color={rest.variant === "outline" ? "primary" : "white"}
          fontSize={18}
          letterSpacing={0.25}
          lineHeight={21}
        >
          {label ? label : children}
        </Text>
      </View>
    </BaseButton>
  );
};

export default Button;
