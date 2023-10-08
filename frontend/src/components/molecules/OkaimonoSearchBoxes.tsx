import { Box, Divider, Heading, HStack, Input, Select, Text, VStack } from "@chakra-ui/react";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { ListFormParams, OkaimonoShopsIndexData, UseFormOnSearchPage } from "interfaces";
import React, { memo, VFC } from "react";
import { ChangeHandler, FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<UseFormOnSearchPage>;
  errors: FieldErrors<UseFormOnSearchPage>;
  // eslint-disable-next-line no-unused-vars
  customOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rest: {
    onBlur: ChangeHandler;
    name: "searchWord";
    min?: string | number | undefined;
    max?: string | number | undefined;
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;
    required?: boolean | undefined;
    disabled?: boolean | undefined;
  };
  searchWordShopSuggestions: OkaimonoShopsIndexData[];
  searchWordPurchaseSuggestions: ListFormParams[];
  // eslint-disable-next-line no-unused-vars
  onClickSuggests: (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, value: string) => void;
  isOkaimonoShopsIndexData: (value: OkaimonoShopsIndexData | ListFormParams) => value is OkaimonoShopsIndexData;
  startDate: Date;
  isValid: boolean;
};

export const OkaimonoSearchBoxes: VFC<Props> = memo((props) => {
  const {
    register,
    errors,
    customOnChange,
    searchWordShopSuggestions,
    searchWordPurchaseSuggestions,
    onClickSuggests,
    isOkaimonoShopsIndexData,
    startDate,
    isValid,
  } = props;

  const {
    ref,
    onChange: registerOnChange,
    ...rest
  } = register("searchWord", {
    required: { value: true, message: "検索語句が入力されていません" },
  });

  return (
    <Box boxShadow="lg" bg="white" rounded="xl" p={6}>
      <HStack>
        <Select
          _hover={{ fontWeight: "bold", cursor: "pointer" }}
          placeholder="検索"
          size="md"
          w="40%"
          fontSize={{ base: "sm", md: "md" }}
          {...register("searchSelect", {
            required: { value: true, message: "検索タイプが入力されていません" },
          })}
        >
          <option value="shopName">お店名</option>
          <option value="purchaseName">商品名</option>
        </Select>
        <Box>
          <Input
            _hover={{ fontWeight: "bold", cursor: "pointer" }}
            onChange={customOnChange}
            placeholder="検索語句"
            size="md"
            fontSize={{ base: "sm", md: "md" }}
            ref={ref}
            {...rest}
          />
          {((searchWordShopSuggestions && searchWordShopSuggestions?.length > 0) ||
            (searchWordPurchaseSuggestions && searchWordPurchaseSuggestions?.length > 0)) && (
            <Box w="100%" position="relative" zIndex="dropdown">
              <VStack w="100%" position="absolute" bg="white" boxShadow="lg" align="start" px={5}>
                {(searchWordShopSuggestions.length > 0 ? searchWordShopSuggestions : searchWordPurchaseSuggestions).map(
                  (value) => (
                    <Box key={value.id} w="100%">
                      <Divider w="100%" />
                      <Text
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        fontSize={{ base: "sm", md: "md" }}
                        w="100%"
                        // prettier-ignore
                        onClick={(event) =>
                              onClickSuggests(
                                event,
                                isOkaimonoShopsIndexData(value) ? value.shopName || "" : value.purchaseName || ""
                              )}
                        _hover={{ fontWeight: "bold", cursor: "pointer" }}
                      >
                        {isOkaimonoShopsIndexData(value) ? value.shopName || "" : value.purchaseName || ""}
                      </Text>
                    </Box>
                  )
                )}
              </VStack>
            </Box>
          )}
        </Box>
      </HStack>
      {errors.searchWord && (
        <Box color="red" fontSize="sm">
          <Text>{errors.searchSelect?.types?.required}</Text>
          <Text>{errors.searchWord?.types?.required}</Text>
        </Box>
      )}
      <Heading as="h3" size="sm" textAlign="center" pt={5} pb={3}>
        更にお買い物日で絞り込む
      </Heading>
      <HStack>
        <Input
          type="date"
          size="md"
          fontSize={{ base: "sm", md: "md" }}
          {...register("startDate")}
          _hover={{ fontWeight: "bold", cursor: "pointer" }}
        />
        <Text>〜</Text>
        <Input
          type="date"
          size="md"
          fontSize={{ base: "sm", md: "md" }}
          _hover={{ fontWeight: "bold", cursor: "pointer" }}
          {...register("endDate", {
            validate: (value) =>
              !startDate ||
              !value ||
              new Date(value) >= new Date(startDate) ||
              "終了日は開始日以降の日付を選択してください。",
          })}
        />
      </HStack>
      {errors.endDate && (
        <Box color="red" fontSize="sm">
          {errors.endDate.message}
        </Box>
      )}
      <Box display="flex" justifyContent="center" mt={4}>
        <PrimaryButtonForReactHookForm w="100%" disabled={!isValid}>
          検索
        </PrimaryButtonForReactHookForm>
      </Box>
    </Box>
  );
});
