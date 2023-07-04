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
  Text,
  VStack,
} from "@chakra-ui/react";
import { ListFormParams, MergeParams } from "interfaces";
import React, { Dispatch, memo, SetStateAction, VFC } from "react";
import {
  FieldArrayWithId,
  FieldErrors,
  FieldValues,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type Props = {
  fields: FieldArrayWithId<MergeParams, "listForm", "key">[];
  // eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-unused-vars
  onListChange?: (event: React.ChangeEvent<HTMLInputElement>, index: number, newValue: string) => void;
  purchaseNameSuggestions?: ListFormParams[];
  setValue?: UseFormSetValue<MergeParams>;
  setPurchaseNameSuggestions?: React.Dispatch<React.SetStateAction<ListFormParams[]>>;
  purchaseNameIndex?: number;
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
    onListChange,
    purchaseNameSuggestions,
    setValue,
    setPurchaseNameSuggestions,
    purchaseNameIndex
  } = props;

  const onClickSuggests = (
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    purchaseName: string,
    index: number
  ) => {
    event.preventDefault();
    if (setValue && setPurchaseNameSuggestions && purchaseName) {
      setValue(`listForm.${index}.purchaseName`, purchaseName);
      setPurchaseNameSuggestions([]);
    }
  };
  return (
    <Box>
      <Heading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
        お買い物リスト
      </Heading>
      {fields.map((field, index) => {
        const {
          ref,
          onChange: registerOnChange,
          ...rest
        } = register(`listForm.${index}.purchaseName`, {
          required: { value: true, message: "商品名が入力されていません" },
          maxLength: { value: 35, message: "最大文字数は35文字までです。" },
        });

        const customOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          // 親コンポーネントから渡された onChange ハンドラを実行
          if (onListChange) {
            onListChange(event, index, event.target.value);
          }

          // 入力が空の場合、候補リストをクリアする
          if (setPurchaseNameSuggestions && event.target.value === "") {
            setPurchaseNameSuggestions([]);
          }

          // React Hook Form の onChange ハンドラを実行
          if (registerOnChange) {
            registerOnChange(event);
          }
        };

        const startDate = watch(`listForm.${index}.expiryDateStart`);
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
                      // eslint-disable-next-line no-alert
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
                      // eslint-disable-next-line no-alert
                      alert("確認画面では使用できません。");
                      return;
                    }
                    if (getValues) {
                      const listId = getValues(`listForm.${index}.id`);
                      if (listId) {
                        if (setDeleteIds) {
                          setDeleteIds((prevIds) => [...(prevIds || []), listId]);
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
                    onChange={(event) => customOnChange(event)}
                    ref={ref}
                    {...rest}
                  />
                  {purchaseNameIndex === index && purchaseNameSuggestions && purchaseNameSuggestions?.length > 0 && (
                    <Box w="100%" position="relative" zIndex="dropdown">
                      <VStack w="100%" position="absolute" bg="white" boxShadow="lg" align="start" px={5}>
                        {purchaseNameSuggestions.map((value) => (
                          <Box key={value.id} w="100%">
                            <Divider w="100%" />
                            <Text
                              w="100%"
                              onClick={(event) => (
                                value.purchaseName ? onClickSuggests(event, value.purchaseName, index) : ""
                              )}
                              _hover={{ fontWeight: "bold" }}
                            >
                              {value.purchaseName}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
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
                </Box>
              </HStack>
              {errors.listForm && errors.listForm[index]?.purchaseName && (
                <Box color="red" fontSize="sm">
                  {errors.listForm[index]?.purchaseName?.types?.required}
                  {errors.listForm[index]?.purchaseName?.types?.maxLength}
                </Box>
              )}
              {errors.listForm && errors.listForm[index]?.amount && (
                <Box color="red" fontSize="sm">
                  {errors.listForm[index]?.amount?.types?.max}
                  {errors.listForm[index]?.amount?.types?.pattern}
                </Box>
              )}
              <HStack w="100%" pb={2}>
                <Box w="70%">
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={!readOnly ? "メモ" : ""}
                    fontSize={{ base: "sm", md: "md" }}
                    size="md"
                    {...register(`listForm.${index}.shoppingDetailMemo`, {
                      maxLength: { value: 150, message: "最大文字数は150文字です。" },
                    })}
                  />
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
              </HStack>
              {errors.listForm && errors.listForm[index]?.shoppingDetailMemo && (
                <Box color="red" fontSize="sm">
                  {errors.listForm[index]?.shoppingDetailMemo?.types?.maxLength}
                </Box>
              )}
              {errors.listForm && errors.listForm[index]?.price && (
                <Box color="red" fontSize="sm">
                  {errors.listForm[index]?.price?.types?.pattern}
                </Box>
              )}
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
                        {...register(`listForm.${index}.expiryDateStart`)}
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
                        {...register(`listForm.${index}.expiryDateEnd`, {
                          validate: (value) =>
                            !startDate ||
                            !value ||
                            new Date(value) >= new Date(startDate) ||
                            "終了日は開始日以降の日付を選択してください。",
                        })}
                      />
                      {errors.listForm && errors.listForm[index]?.expiryDateEnd && (
                        <Box color="red" fontSize="sm">
                          {errors.listForm[index]?.expiryDateEnd?.message}
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
