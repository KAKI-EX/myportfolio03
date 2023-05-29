import { SmallAddIcon } from "@chakra-ui/icons";
import {
  Box,
  ComponentWithAs,
  Divider,
  FormLabel,
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
import { Dispatch, memo, SetStateAction, VFC } from "react";
import {
  FieldArrayWithId,
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

type Props = {
  fields: FieldArrayWithId<MergeParams, "listForm", "key">[];
  insertInputForm: (index: number) => void;
  SmallCloseIcon: ComponentWithAs<"svg", IconProps>;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<MergeParams>;
  errors: FieldErrors<MergeParams>;
  validationNumber: RegExp;
  readOnly?: boolean;
  getValues?: UseFormGetValues<MergeParams>;
  deleteIds?: string[];
  setDeleteIds?: Dispatch<SetStateAction<string[]>>;
  watch: UseFormWatch<FieldValues>;
  expiryDate?: boolean;
};

export const OkaimonoDetail: VFC<Props> = memo((props) => {
  const {
    fields,
    insertInputForm,
    SmallCloseIcon,
    remove,
    register,
    errors,
    validationNumber,
    readOnly = false,
    getValues,
    setDeleteIds,
    watch,
    expiryDate,
  } = props;

  return (
    <Box>
      <Heading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
        お買い物リスト
      </Heading>
      {fields.map((field, index) => {
        const startDate = watch(`listForm.${index}.expiry_date_start`);
        return (
          <HStack key={field.key} px={2} py={3} w="100%" bg="white" rounded="xl" mb="2">
            <VStack spacing={1} w="5%">
              <Box display={fields.length < 20 || readOnly ? "block" : "none"}>
                <SmallAddIcon
                  bg="teal.500"
                  rounded="full"
                  color="white"
                  onClick={(event) => {
                    if (readOnly) {
                      event.preventDefault();
                      alert("確認画面では使用できません。");
                      return;
                    }
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
                  onClick={() => {
                    if (readOnly) {
                      alert("確認画面では使用できません。");
                      return;
                    }
                    if (getValues) {
                      const memoId = getValues(`listForm.${index}.id`);
                      if (memoId) {
                        if (setDeleteIds) {
                          setDeleteIds((prevIds) => [...(prevIds || []), memoId]);
                        }
                      }
                    }
                    remove(index);
                  }}
                />
              </Box>
            </VStack>
            <VStack>
              <HStack w="100%">
                <Box w="70%">
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    autoFocus={false}
                    placeholder={!readOnly ? "買う商品のなまえ" : ""}
                    fontSize={{ base: "sm", md: "md" }}
                    size="md"
                    w="100%"
                    {...register(`listForm.${index}.purchase_name`, {
                      required: { value: true, message: "商品名が入力されていません" },
                      maxLength: { value: 30, message: "最大文字数は30文字までです。" },
                    })}
                  />
                  {errors.listForm && errors.listForm[index]?.purchase_name && (
                    <Box color="red" fontSize="sm">
                      {errors.listForm[index]?.purchase_name?.types?.required}
                      {errors.listForm[index]?.purchase_name?.types?.maxLength}
                    </Box>
                  )}
                </Box>
                <Box w="30%">
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={!readOnly ? "個数" : ""}
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
                </Box>
              </HStack>
              <HStack w="100%" pb={2}>
                <Box w="70%">
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={!readOnly ? "メモ" : ""}
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
                <Box w="30%">
                  <InputGroup>
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      placeholder={!readOnly ? "いくら？" : ""}
                      type="number"
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
              </HStack>
              {expiryDate && (
                <>
                  <Divider my={4} />
                  <HStack w="100%" py={2}>
                    <Box w="50%">
                      <FormLabel mb="3px" fontSize={{ base: "sm", md: "md" }}>
                        消費期限 開始日
                      </FormLabel>
                      <Input
                        isReadOnly={readOnly}
                        type={expiryDate ? "date" : "hidden"}
                        placeholder="test"
                        bg={readOnly ? "blackAlpha.200" : "white"}
                        fontSize={{ base: "sm", md: "md" }}
                        size="md"
                        {...register(`listForm.${index}.expiry_date_start`)}
                      />
                    </Box>
                    <Box w="50%">
                      <FormLabel mb="3px" fontSize={{ base: "sm", md: "md" }}>
                        終了日
                      </FormLabel>
                      <Input
                        isReadOnly={readOnly}
                        type="date"
                        bg={readOnly ? "blackAlpha.200" : "white"}
                        fontSize={{ base: "sm", md: "md" }}
                        size="md"
                        {...register(`listForm.${index}.expiry_date_end`, {
                          validate: (value) =>
                            !startDate || // eslint-disable-line
                            !value ||
                            new Date(value) >= new Date(startDate) ||
                            "終了日は開始日以降の日付を選択してください。",
                        })}
                      />
                      {errors.listForm && errors.listForm[index]?.expiry_date_end && (
                        <Box color="red" fontSize="sm">
                          {errors.listForm[index]?.expiry_date_end?.message}
                        </Box>
                      )}
                    </Box>
                    <Input type="hidden" {...register(`listForm.${index}.id`)} />
                    <Input type="hidden" {...register(`listForm.${index}.asc`)} />
                  </HStack>
                  <Divider my={4} />
                </>
              )}
            </VStack>
          </HStack>
        );
      })}
    </Box>
  );
});
