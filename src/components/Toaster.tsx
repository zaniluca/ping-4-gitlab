import { BackgroundColorProps } from "@shopify/restyle";
import Toast, {
  ToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";
import { Theme } from "../utils/theme";
import { Box, Text } from "./restyle";
import {} from "react-native-feather";

type CustomToastParams = {
  icon?: React.ReactNode;
};

type CustomToastProps = ToastConfigParams<CustomToastParams> &
  BackgroundColorProps<Theme>;

const BaseToast: React.FC<CustomToastProps> = ({
  text1,
  text2,
  backgroundColor,
}) => (
  <Box
    backgroundColor={backgroundColor}
    paddingHorizontal="l"
    paddingVertical="m"
    borderRadius={4}
    flexDirection="row"
    alignItems="center"
    minHeight={48}
    width="95%"
  >
    <Box flexDirection="column">
      <Text variant="headline" color="white">
        {text1}
      </Text>
      {text2 && (
        <Text marginTop="xxs" variant="callout" color="white">
          {text2}
        </Text>
      )}
    </Box>
  </Box>
);

const toastConfig: ToastConfig = {
  info: (props) => BaseToast({ ...props, backgroundColor: "blue" }),
  success: (props) => BaseToast({ ...props, backgroundColor: "green" }),
  error: (props) => BaseToast({ ...props, backgroundColor: "red" }),
};

const Toaster = () => <Toast config={toastConfig} position="bottom" />;

export default Toaster;
