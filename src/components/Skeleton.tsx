import { Animated } from "react-native";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { BoxProps } from "@shopify/restyle";
import { Theme } from "../utils/theme";
import { Box } from "./restyle";

type Props = BoxProps<Theme> & {
  children?: JSX.Element | JSX.Element[];
};

const Skeleton: React.FC<Props> = ({ children, ...rest }) => {
  const opacity = useRef(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          useNativeDriver: true,
          duration: 800,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={{ opacity: opacity.current, flex: 1 }}>
      <Box {...rest}>{children}</Box>
    </Animated.View>
  );
};

export default Skeleton;
