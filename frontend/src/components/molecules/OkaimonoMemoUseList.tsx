import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { InputExpiryDateEnd } from "components/atoms/InputExpiryDateEnd";
import { ListFormParams, MergeParams } from "interfaces";
import React, { memo, VFC } from "react";
import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

type Props = {
  fields: FieldArrayWithId<MergeParams, "listForm", "key">[];
  register: UseFormRegister<MergeParams>;
  getValues: UseFormGetValues<MergeParams>;
  validationNumber: RegExp;
  // eslint-disable-next-line no-unused-vars
  onClickListModify: (index: number, event: React.MouseEvent) => void;
  setDeleteIds: React.Dispatch<React.SetStateAction<string[]>>;
  remove: UseFieldArrayRemove;
  // eslint-disable-next-line no-unused-vars
  insertInputForm: (index: number) => void;
  errors: FieldErrors<MergeParams>;
  purchaseNameIndex?: number | undefined;
  purchaseNameSuggestions?: ListFormParams[];
  setValue?: UseFormSetValue<MergeParams>;
  setPurchaseNameSuggestions?: React.Dispatch<React.SetStateAction<ListFormParams[]>>;
  // eslint-disable-next-line no-unused-vars
  onListChange?: (event: React.ChangeEvent<HTMLInputElement>, newValue: string, index?: number) => void;
};

export const OkaimonoMemoUseList: VFC<Props> = memo((props) => {
  const {
    fields,
    register,
    getValues,
    validationNumber,
    onClickListModify,
    setDeleteIds,
    remove,
    insertInputForm,
    errors,
    purchaseNameIndex,
    purchaseNameSuggestions,
    setValue,
    setPurchaseNameSuggestions,
    onListChange,
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
    <>
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
            onListChange(event, event.target.value, index);
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
        return (
          <Box w={{ base: "100%", md: "50%" }} key={field.key} bg="white" py={4} px={2} rounded={10} boxShadow="md">
            <VStack>
              <HStack>
                <Checkbox size="lg" colorScheme="green" ml={1} {...register(`listForm.${index}.isBought`)} />
                <Box w="50%">
                  <Input
                    onChange={(event) => customOnChange(event)}
                    border={getValues(`listForm.${index}.id`) ? "none" : "1px solid black"}
                    placeholder="商品名"
                    w="100%"
                    fontSize={{ base: "sm", md: "md" }}
                    px={1}
                    isReadOnly={!!getValues(`listForm.${index}.id`)}
                    ml={0}
                    ref={ref}
                    {...rest}
                    onClick={(event) => {
                      if (getValues(`listForm.${index}.id`)) {
                        onClickListModify(index, event);
                      }
                    }}
                  />
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
                </Box>
                <InputGroup w="20%">
                  <Input
                    textAlign="center"
                    px={1}
                    border={getValues(`listForm.${index}.id`) ? "none" : "1px solid black"}
                    isReadOnly={!!getValues(`listForm.${index}.id`)}
                    fontSize={{ base: "sm", md: "md" }}
                    size="md"
                    type="number"
                    {...register(`listForm.${index}.amount`, {
                      max: { value: 99, message: "上限は99までです。" },
                      pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                    })}
                    onClick={(event) => {
                      if (getValues(`listForm.${index}.id`)) {
                        onClickListModify(index, event);
                      }
                    }}
                  />
                  <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                    個
                  </InputRightElement>
                </InputGroup>
                <InputGroup w="30%">
                  <Input
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
                {errors.listForm && errors.listForm[index]?.price && (
                  <Box color="red" fontSize="sm">
                    {errors.listForm[index]?.price?.types?.pattern}
                  </Box>
                )}
                <Input type="hidden" {...register(`listForm.${index}.id`)} />
                <Input type="hidden" {...register(`listForm.${index}.asc`)} />
                <Menu>
                  <MenuButton as={ChevronDownIcon} />
                  <MenuList borderRadius="md" shadow="md" zIndex="dropdown">
                    {getValues(`listForm.${index}.id`) ? (
                      <MenuItem onClick={(event) => onClickListModify(index, event)}>編集する</MenuItem>
                    ) : null}
                    <MenuItem
                      onClick={() => {
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
                    >
                      削除する
                    </MenuItem>
                    <MenuItem onClick={() => insertInputForm(index)}>フォームを下に追加</MenuItem>
                  </MenuList>
                </Menu>
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
              {!getValues(`listForm.${index}.id`) && (
                <>
                  <Divider pt={5} />
                  <HStack w="100%" justifyContent="center">
                    <Box w="70%">
                      <InputExpiryDateEnd readOnly={false} register={register} index={index} />
                    </Box>
                  </HStack>
                </>
              )}
            </VStack>
          </Box>
        );
      })}
    </>
  );
});
