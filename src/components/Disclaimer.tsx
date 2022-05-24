import React from "react";
import { openUrl } from "../utils/open-url";
import { Text } from "./restyle";

const Disclaimer = () => {
  return (
    <Text marginTop="m" textAlign="center" color="primary">
      By using the app you're agree to our{"\n"}
      {/* <Text color="purpleDark" onPress={() => openUrl("https://google.com")}>
        Terms of Use{" "}
      </Text>
      and */}
      <Text
        color="purpleDark"
        onPress={() =>
          openUrl(
            "https://www.privacypolicies.com/live/91cf1154-e54c-45d8-90e9-fe94a46013f6"
          )
        }
      >
        {/* {" "} */}
        Privacy Policy
      </Text>
    </Text>
  );
};

export default Disclaimer;
