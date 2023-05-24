import { Box, Divider, Heading, Input, InputGroup, InputRightElement, Stack } from "@chakra-ui/react";
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
          {...register("shopping_date")}
        />
        <Input
          isReadOnly={readOnly}
          bg={readOnly ? "blackAlpha.200" : "white"}
          placeholder={!readOnly ? "お店の名前" : ""}
          size="md"
          w="90%"
          fontSize={{ base: "sm", md: "md" }}
          {...register("shop_name", {
            maxLength: { value: 35, message: "最大文字数は35文字までです。" },
          })}
        />
        {errors.shop_name && errors.shop_name.types?.maxLength && (
          <Box color="red">{errors.shop_name.types.maxLength}</Box>
        )}
        <InputGroup w="90%">
          <Input
            isReadOnly={readOnly}
            bg={readOnly ? "blackAlpha.200" : "white"}
            size="md"
            placeholder={!readOnly ? "お買い物の予算" : ""}
            type="number"
            fontSize={{ base: "sm", md: "md" }}
            {...register("estimated_budget", {
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
        {errors.estimated_budget && errors.estimated_budget.types?.pattern && (
          <Box color="red">{errors.estimated_budget.types.pattern}</Box>
        )}
        <Input
          isReadOnly={readOnly}
          bg={readOnly ? "blackAlpha.200" : "white"}
          placeholder={!readOnly ? "一言メモ" : ""}
          size="md"
          w="90%"
          fontSize={{ base: "sm", md: "md" }}
          {...register("shopping_memo", {
            maxLength: { value: 150, message: "最大文字数は150文字です。" },
          })}
        />
        <Input type="hidden" {...register(`shopping_datum_id`)} />
      </Stack>
    </Box>
  );
});
