import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import { OkaimonoShopsIndexData } from "interfaces";
import React, { memo, VFC } from "react";

type Props = {
  shopNameSuggestions: OkaimonoShopsIndexData[] | undefined;
  // eslint-disable-next-line no-unused-vars
  onClickSuggests: (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, shopName: string) => void;
  w?: string;
};

export const InputShopNameSuggest: VFC<Props> = memo((props) => {
  const { shopNameSuggestions, onClickSuggests, w } = props;
  return (
    <>
      {shopNameSuggestions && shopNameSuggestions?.length > 0 && (
        <Box w="100%" position="relative" zIndex="dropdown">
          <VStack w="100%" position="absolute" bg="white" boxShadow="lg" align="start" px={5}>
            {shopNameSuggestions.map((value) => (
              <Box key={value.id} w="100%">
                <Divider w="100%" />
                <Text
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  fontSize={{ base: "sm", md: "md" }}
                  w={w}
                  onClick={(event) => onClickSuggests(event, value.shopName)}
                  _hover={{ fontWeight: "bold", cursor: "pointer" }}
                >
                  {value.shopName}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </>
  );
});
