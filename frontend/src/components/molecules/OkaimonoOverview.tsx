import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { memo, VFC } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<MergeParams>;
  validationNumber: RegExp;
  errors: FieldErrors<MergeParams>;
  readOnly?: boolean;
};

export const OkaimonoOverview: VFC<Props> = memo((props) => {
  const { register, validationNumber, errors, readOnly = false } = props;
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
        <Input
          isReadOnly={readOnly}
          bg={readOnly ? "blackAlpha.200" : "white"}
          placeholder={!readOnly ? "お店の名前" : ""}
          size="md"
          w="90%"
          fontSize={{ base: "sm", md: "md" }}
          {...register("shopName", {
            maxLength: { value: 35, message: "最大文字数は35文字までです。" },
          })}
        />
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
        </HStack>
        <Input type="hidden" {...register(`shoppingDatumId`)} />
        <Input type="hidden" {...register(`isFinish`)} />
      </Stack>
    </Box>
  );
});
