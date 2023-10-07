import { Box, Input, Stack } from "@chakra-ui/react";
import { InputEstimatedBudget } from "components/atoms/InputEstimatedBudget";
import { InputEstimatedBudgetErrors } from "components/atoms/InputEstimatedBudgetErrors";
import { InputShopName } from "components/atoms/InputshopName";
import { InputShopNameErrors } from "components/atoms/InputShopNameErrors";
import { InputShopNameSuggest } from "components/atoms/InputShopNameSuggest";
import { InputShoppingDate } from "components/atoms/InputShoppingDate";
import { InputShoppingMemo } from "components/atoms/InputShoppingMemo";
import { InputShoppingMemoErrors } from "components/atoms/InputShoppingMemoErrors";
import { MergeParams, OkaimonoShopsIndexData } from "interfaces";
import React, { memo, VFC } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

type Props = {
  // readOnly: boolean;
  register: UseFormRegister<MergeParams>;
  errors: FieldErrors<MergeParams>;
  // eslint-disable-next-line no-unused-vars
  // onClickShoppingDatumModify: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  setShopNameSuggestions?: React.Dispatch<React.SetStateAction<OkaimonoShopsIndexData[]>>;
  // eslint-disable-next-line no-unused-vars
  onShopChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void;
  shopNameSuggestions?: OkaimonoShopsIndexData[];
  setValue?: UseFormSetValue<MergeParams>;
};

export const OkaimonoMemoUseMemo: VFC<Props> = memo((props) => {
  const {
    register,
    errors,
    // onClickShoppingDatumModify,
    setShopNameSuggestions,
    onShopChange,
    shopNameSuggestions,
    setValue,
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
    <Box bg="white" rounded="xl" w={{ base: "100%", md: "50%" }} boxShadow="md">
      {/* <HStack> */}
      <Stack align="center" justify="center" py={6} spacing="3">
        <InputShoppingDate register={register} w="90%" />
        <InputShopName customOnChange={customOnChange} w="90%" ref={ref} rest={rest} />
        <InputShopNameSuggest shopNameSuggestions={shopNameSuggestions} onClickSuggests={onClickSuggests} w="90%" />
        <InputShopNameErrors errors={errors} />
        <InputEstimatedBudget register={register} w="90%" />
        <InputEstimatedBudgetErrors errors={errors} />
        <InputShoppingMemo register={register} w="90%" />
        <InputShoppingMemoErrors errors={errors} />
        <Input type="hidden" {...register(`shoppingDatumId`)} />
        <Input type="hidden" {...register(`isFinish`)} />
      </Stack>
      {/* <Box w="5%">
          <Menu>
            <MenuButton as={ChevronDownIcon} _hover={{ cursor: "pointer" }} />
            <MenuList borderRadius="md" shadow="md">
              <MenuItem onClick={(event) => onClickShoppingDatumModify(event)}>編集する</MenuItem>
            </MenuList>
          </Menu>
        </Box> */}
      {/* </HStack> */}
    </Box>
  );
});
