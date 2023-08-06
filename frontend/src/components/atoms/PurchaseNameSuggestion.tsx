import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import { ListFormParams, MergeParams } from "interfaces";
import React, { memo, VFC } from "react";
import { UseFormSetValue } from "react-hook-form";

type Props = {
  setValue?: UseFormSetValue<MergeParams>;
  index: number;
  setPurchaseNameSuggestions?: React.Dispatch<React.SetStateAction<ListFormParams[]>>;
  purchaseNameIndex?: number;
  purchaseNameSuggestions?: ListFormParams[];
};

export const PurchaseNameSuggestion: VFC<Props> = memo((props) => {
  const { index, setValue, setPurchaseNameSuggestions, purchaseNameIndex, purchaseNameSuggestions } = props;

  const onClickSuggests = (
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    purchaseName: string,
    suggestIndex: number
  ) => {
    event.preventDefault();
    if (setValue && setPurchaseNameSuggestions && purchaseName) {
      setValue(`listForm.${suggestIndex}.purchaseName`, purchaseName);
      setPurchaseNameSuggestions([]);
    }
  };

  return (
    <>
      {purchaseNameIndex === index && purchaseNameSuggestions && purchaseNameSuggestions?.length > 0 && (
        <Box w="100%" position="relative" zIndex="dropdown">
          <VStack w="100%" position="absolute" bg="white" boxShadow="lg" align="start" px={5}>
            {purchaseNameSuggestions.map((value) => (
              <Box key={value.id} w="100%">
                <Divider w="100%" />
                {/* prettier-ignore */}
                <Text
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  fontSize={{ base: "sm", md: "md" }}
                  w="100%"
                  onClick={(event) => (value.purchaseName ? onClickSuggests(event, value.purchaseName, index) : "")}
                  _hover={{ fontWeight: "bold" }}
                >
                  {value.purchaseName}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </>
  );
});
