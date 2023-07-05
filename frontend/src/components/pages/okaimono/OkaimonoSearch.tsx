import {
  Box,
  Flex,
  VStack,
  Spinner,
  Heading,
  useDisclosure,
  Text,
} from "@chakra-ui/react";

import React, { memo, useCallback, useEffect, useState, VFC } from "react";

export const OkaimonoSearch: VFC = memo(() => {
  const [loading, setLoading] = useState<boolean>(false);

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <Text>test</Text>
  );
});
