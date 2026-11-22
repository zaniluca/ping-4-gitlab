import React from "react";

import { Box, Text } from "./restyle";

type Props = {
  errors: Record<string, string>;
};

const ErrorsList: React.FC<Props> = ({ errors }) => {
  return (
    <Box>
      <Text color="red">Some errors occurred:</Text>
      {Object.entries(errors).map(([key, value]) => (
        <Box key={key} flexDirection="row">
          <Text color="red">{"\u2022"}</Text>
          <Text color="red" paddingLeft="xs">
            {value}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default ErrorsList;
