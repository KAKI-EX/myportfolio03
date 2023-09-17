import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MergeParams, OkaimonoShopsIndexData } from "interfaces";
import React, { memo, VFC } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

type Props = {
  register: UseFormRegister<MergeParams>;
  validationNumber: RegExp;
  errors: FieldErrors<MergeParams>;
  readOnly?: boolean;
  shopNameSuggestions?: OkaimonoShopsIndexData[];
  setValue?: UseFormSetValue<MergeParams>;
  setShopNameSuggestions?: React.Dispatch<React.SetStateAction<OkaimonoShopsIndexData[]>>;
  // eslint-disable-next-line no-unused-vars
  onShopChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void;
};

export const OkaimonoOverview: VFC<Props> = memo((props) => {
  const {
    register,
    validationNumber,
    errors,
    readOnly = false,
    onShopChange,
    shopNameSuggestions,
    setValue,
    setShopNameSuggestions,
  } = props;

  const {
    ref,
    onChange: registerOnChange,
    ...rest
  } = register("shopName", {
    maxLength: { value: 35, message: "最大文字数は35文字までです。" },
  });

  const customOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // React Hook Form の onChange ハンドラを実行
    if (registerOnChange) {
      registerOnChange(event);
    }

    // 入力が空の場合、候補リストをクリアする
    if (setShopNameSuggestions && event.target.value === "") {
      setShopNameSuggestions([]);
    }

    // 親コンポーネントから渡された onChange ハンドラを実行
    if (onShopChange) {
      onShopChange(event, event.target.value);
    }
  };

  const onClickSuggests = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, shopName: string) => {
    event.preventDefault();
    if (setValue && setShopNameSuggestions && shopName) {
      setValue("shopName", shopName);
      setShopNameSuggestions([]);
    }
  };

  return (
    <Box bg="white" rounded="xl">
      <Stack align="center" justify="center" py={6} spacing="3">
        <Input
          isReadOnly={readOnly}
          bg={readOnly ? "blackAlpha.200" : "white"}
          size="md"
          type="date"
          w="90%"
          fontSize={{ base: "sm", md: "md" }}
          {...register("shoppingDate")}
        />
        <Box w="90%">
          <Input
            onChange={customOnChange}
            isReadOnly={readOnly}
            bg={readOnly ? "blackAlpha.200" : "white"}
            placeholder={!readOnly ? "お店の名前" : ""}
            size="md"
            w="100%"
            fontSize={{ base: "sm", md: "md" }}
            ref={ref}
            {...rest}
          />
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
                      w="100%"
                      onClick={(event) => onClickSuggests(event, value.shopName)}
                      _hover={{ fontWeight: "bold" }}
                    >
                      {value.shopName}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
        {errors.shopName && errors.shopName.types?.maxLength && (
          <Box color="red">{errors.shopName.types.maxLength}</Box>
        )}
        <InputGroup w="90%">
          <Input
            isReadOnly={readOnly}
            bg={readOnly ? "blackAlpha.200" : "white"}
            size="md"
            placeholder={!readOnly ? "お買い物の予算" : ""}
            type="number"
            fontSize={{ base: "sm", md: "md" }}
            {...register("estimatedBudget", {
              pattern: {
                value: validationNumber,
                message: "半角整数で入力してください。",
              },
            })}
          />
          <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
            円
          </InputRightElement>
        </InputGroup>
        {errors.estimatedBudget && errors.estimatedBudget.types?.pattern && (
          <Box color="red">{errors.estimatedBudget.types.pattern}</Box>
        )}
        <Input
          isReadOnly={readOnly}
          bg={readOnly ? "blackAlpha.200" : "white"}
          placeholder={!readOnly ? "一言メモ" : ""}
          size="md"
          w="90%"
          fontSize={{ base: "sm", md: "md" }}
          {...register("shoppingMemo", {
            maxLength: { value: 150, message: "最大文字数は150文字です。" },
          })}
        />
        {errors.shoppingMemo && errors.shoppingMemo.types?.maxLength && (
          <Box color="red">{errors.shoppingMemo.types.maxLength}</Box>
        )}
        <HStack>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="email-alerts" mb="0">
              おつかい機能をオン
            </FormLabel>
            <Switch isReadOnly={readOnly} fontSize={{ base: "sm", md: "lg" }} {...register("isOpen")} />
          </FormControl>
          <Popover>
            <PopoverTrigger>
              <QuestionOutlineIcon w={5} h={5} mb={-2} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" />
            </PopoverTrigger>
            <PopoverContent _focus={{ outline: "none" }}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>おつかい機能？</PopoverHeader>
              <PopoverBody>オンにすると、URLを送ることでお買い物メモを共有できます！</PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
        <Input type="hidden" {...register(`shoppingDatumId`)} />
        <Input type="hidden" {...register(`isFinish`)} />
      </Stack>
    </Box>
  );
});
