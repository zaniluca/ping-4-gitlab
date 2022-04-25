import React from "react";
import { openUrl } from "../utils/open-url";
import { Text } from "./restyle";

const Disclaimer = () => {
  return (
    <Text marginTop="m" textAlign="center">
      By using the app you're agree to our{"\n"}
      {/* <Text color="purpleDark" onPress={() => openUrl("https://google.com")}>
        Terms of Use{" "}
      </Text>
      and */}
      <Text
        color="purpleDark"
        onPress={() => openUrl(process.env.PRIVACY_POLICY_URL ?? "")}
      >
        {/* {" "} */}
        Privacy Policy
      </Text>
    </Text>
  );
};

export default Disclaimer;
