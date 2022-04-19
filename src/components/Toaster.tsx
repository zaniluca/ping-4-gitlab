import Toast, { ToastConfig } from "react-native-toast-message";
import { Box, Text } from "./restyle";

const toastConfig: ToastConfig = {
  success: ({ text1, text2, props }) => (
    <Box
      backgroundColor="indigo"
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
  ),
};

const Toaster = () => {
  return <Toast config={toastConfig} position="bottom" />;
};

export default Toaster;
