import { BackgroundColorProps } from "@shopify/restyle";
import { Dimensions, TouchableOpacity } from "react-native";
import { CheckCircle, Info, CloudLightning } from "react-native-feather";
import { SvgProps } from "react-native-svg";
import Toast, {
  BaseToastProps,
  ToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";

import { Theme } from "../utils/theme";
import { Box, Text } from "./restyle";

type CustomToastParams = {
  Icon?: (_props: SvgProps) => JSX.Element;
};

type CustomToastProps = ToastConfigParams<BaseToastProps> &
  BackgroundColorProps<Theme> &
  CustomToastParams;

const BaseToast: React.FC<CustomToastProps> = ({
  text1,
  text2,
  onPress,
  backgroundColor,
  Icon,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
    <Box
      backgroundColor={backgroundColor}
      paddingHorizontal="xl"
      paddingVertical="l"
      borderRadius={4}
      flexDirection="row"
      alignItems="center"
      minHeight={48}
      width={Dimensions.get("screen").width * 0.95}
    >
      {Icon && (
        <Box paddingRight="l">
          <Icon stroke="white" />
        </Box>
      )}
      <Box flexDirection="column" flexShrink={1}>
        <Text variant="headline" color="white">
          {text1}
        </Text>
        {text2 && (
          <Text marginTop="2xs" variant="callout" color="white">
            {text2}
          </Text>
        )}
      </Box>
    </Box>
  </TouchableOpacity>
);

const toastConfig: ToastConfig = {
  info: (props) => BaseToast({ ...props, backgroundColor: "blue", Icon: Info }),
  success: (props) =>
    BaseToast({ ...props, backgroundColor: "green", Icon: CheckCircle }),
  error: (props) =>
    BaseToast({ ...props, backgroundColor: "red", Icon: CloudLightning }),
};

const Toaster = () => <Toast config={toastConfig} position="bottom" />;

export default Toaster;
