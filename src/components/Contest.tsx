import React from "react";
import { Box, Text } from "../ui";

const Contest = () => {
  return (
    <Box flex={1} m={2} p={3} bg="lightblue">
      <Text as="h3">Contest</Text>
      <Box flexDirection="row">
        <Text p={2}>Distance</Text>
        <Text p={2}>20,000m</Text>
        <Text p={2}>40,000m</Text>
        <Text p={2}>60,000m</Text>
        <Text p={2}>80,000m</Text>
        <Text p={2}>100,000m</Text>
      </Box>
    </Box>
  );
};

export default Contest;
