import { SmallAddIcon } from "@chakra-ui/icons";
import {
  Box,
  ComponentWithAs,
  Heading,
  HStack,
  Icon,
  IconProps,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { memo, VFC } from "react";
import { FieldArrayWithId, FieldErrors, UseFieldArrayRemove, UseFormRegister } from "react-hook-form";

type Props = {
  fields: FieldArrayWithId<MergeParams, "listForm", "key">[];
  insertInputForm: (index: number) => void;
  SmallCloseIcon: ComponentWithAs<"svg", IconProps>;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<MergeParams>;
  errors: FieldErrors<MergeParams>;
  validationNumber: RegExp;
};

export const OkaimonoDetail: VFC<Props> = memo((props) => {
  const { fields, insertInputForm, SmallCloseIcon, remove, register, errors, validationNumber } = props;
  return (
    <Box>
      <Heading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
        お買い物リスト
      </Heading>
      {fields.map((field, index) => (
        <HStack key={field.key} px={2} py={3} w="100%" bg="white" rounded="xl" mb="2">
          <VStack spacing={1} w="5%">
            <Box display={fields.length < 20 ? "block" : "none"}>
              <SmallAddIcon
                bg="teal.500"
                rounded="full"
                color="white"
                onClick={(event) => {
                  event.preventDefault();
                  insertInputForm(index);
                }}
              />
            </Box>
            <Box display={fields.length > 1 ? "block" : "none"}>
              <Icon
                as={SmallCloseIcon}
                bg="red.500"
                color="white"
                rounded="full"
                boxSize={4}
                onClick={() => remove(index)}
              />
            </Box>
          </VStack>
          <VStack w="60%">
            <Box w="100%">
              <Input
                autoFocus={false}
                placeholder="買う商品のなまえ"
                fontSize={{ base: "sm", md: "md" }}
                size="md"
                w="100%"
                {...register(`listForm.${index}.purchase_name`, {
                  required: { value: true, message: "商品名が入力されていません" },
                  maxLength: { value: 50, message: "最大文字数は50文字までです。" },
                })}
              />
              {errors.listForm && errors.listForm[index]?.purchase_name && (
                <Box color="red" fontSize="sm">
                  {errors.listForm[index]?.purchase_name?.types?.required}
                  {errors.listForm[index]?.purchase_name?.types?.maxLength}
                </Box>
              )}
            </Box>
            <Box w="100%">
              <Input
                placeholder="メモ"
                fontSize={{ base: "sm", md: "md" }}
                size="md"
                {...register(`listForm.${index}.shopping_detail_memo`, {
                  maxLength: { value: 150, message: "最大文字数は150文字です。" },
                })}
              />
              {errors.listForm && errors.listForm[index]?.shopping_detail_memo && (
                <Box color="red" fontSize="sm">
                  {errors.listForm[index]?.shopping_detail_memo?.types?.maxLength}
                </Box>
              )}
            </Box>
          </VStack>
          <VStack w="30%">
            <Input
              placeholder="個数"
              fontSize={{ base: "sm", md: "md" }}
              size="md"
              w="100%"
              type="number"
              min="1"
              {...register(`listForm.${index}.amount`, {
                max: { value: 99, message: "上限は99までです。" },
                pattern: { value: validationNumber, message: "半角整数で入力してください。" },
              })}
            />
            {errors.listForm && errors.listForm[index]?.amount && (
              <Box color="red" fontSize="sm">
                {errors.listForm[index]?.amount?.types?.max}
                {errors.listForm[index]?.amount?.types?.pattern}
              </Box>
            )}
            <Box w="100%">
              <InputGroup>
                <Input
                  placeholder="いくら？"
                  // type="number"
                  fontSize={{ base: "sm", md: "md" }}
                  {...register(`listForm.${index}.price`, {
                    pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                  })}
                />
                <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                  円
                </InputRightElement>
              </InputGroup>
            </Box>
            {errors.listForm && errors.listForm[index]?.price && (
              <Box color="red" fontSize="sm">
                {errors.listForm[index]?.price?.types?.pattern}
              </Box>
            )}
          </VStack>
        </HStack>
      ))}
    </Box>
  );
});
