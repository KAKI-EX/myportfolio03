import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { InputEstimatedBudget } from "components/atoms/InputEstimatedBudget";
import { InputEstimatedBudgetErrors } from "components/atoms/InputEstimatedBudgetErrors";
import { InputShopName } from "components/atoms/InputshopName";
import { InputShopNameErrors } from "components/atoms/InputShopNameErrors";
import { InputShopNameSuggest } from "components/atoms/InputShopNameSuggest";
import { InputShoppingDate } from "components/atoms/InputShoppingDate";
import { InputShoppingMemo } from "components/atoms/InputShoppingMemo";
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
  isFinished?: boolean;
};

export const OkaimonoOverview: VFC<Props> = memo((props) => {
  const {
    register,
    errors,
    readOnly = false,
    onShopChange,
    shopNameSuggestions,
    setValue,
    setShopNameSuggestions,
    isFinished,
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
    <Box bg="white" rounded="xl" w={{ base: "100%", md: "70%", xl: "60%" }}>
      <Stack align="center" justify="center" py={6} spacing="3">
        <InputShoppingDate readOnly={readOnly} register={register} w="90%" />
        <Box w="90%">
          <InputShopName readOnly={readOnly} customOnChange={customOnChange} w="100%" ref={ref} rest={rest} />
          <InputShopNameSuggest shopNameSuggestions={shopNameSuggestions} onClickSuggests={onClickSuggests} w="100%" />
        </Box>
        <InputShopNameErrors errors={errors} />
        <InputEstimatedBudget readOnly={readOnly} register={register} w="90%" />
        <InputEstimatedBudgetErrors errors={errors} />
        <InputShoppingMemo readOnly={readOnly} register={register} w="90%" />
        {errors.shoppingMemo && errors.shoppingMemo.types?.maxLength && (
          <Box color="red">{errors.shoppingMemo.types.maxLength}</Box>
        )}
        {isFinished ? null : (
          <HStack>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0">
                おつかい機能をオン
              </FormLabel>
              <Switch isReadOnly={readOnly} fontSize={{ base: "sm", md: "lg" }} {...register("isOpen")} />
            </FormControl>
            <Popover>
              <PopoverTrigger>
                <QuestionOutlineIcon
                  w={5}
                  h={5}
                  mb={-2}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                />
              </PopoverTrigger>
              <PopoverContent _focus={{ outline: "none" }}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>おつかい機能？</PopoverHeader>
                <PopoverBody>確定後に発行される指定のURLを送ることでお買い物メモを共有できます！</PopoverBody>
              </PopoverContent>
            </Popover>
          </HStack>
        )}
        <Input type="hidden" {...register(`shoppingDatumId`)} />
        <Input type="hidden" {...register(`isFinish`)} />
      </Stack>
    </Box>
  );
});
