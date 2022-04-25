import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const Logo = (props: SvgProps) => (
  <Svg {...props}>
    <Path d="m77.51 44.81-4.27-13.14-8.46-26.04a1.46 1.46 0 0 0-2.22-.75c-.24.17-.44.52-.55.85l-8.46 26.15h-28.1l-5.6-17.36-2.86-8.84a1.67 1.67 0 0 0-.23-.47l-.16-.17a1.45 1.45 0 0 0-2.38.59L5.76 31.67l-1.8 5.5-2.47 7.64a2.9 2.9 0 0 0 1.05 3.26L39.5 74.92l36.96-26.85a2.9 2.9 0 0 0 1.05-3.26Z" />
  </Svg>
);

export default Logo;
