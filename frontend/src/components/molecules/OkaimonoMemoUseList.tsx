import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import React, { memo, VFC } from "react";
import { FieldArrayWithId, FieldErrors, UseFieldArrayRemove, UseFormGetValues, UseFormRegister } from "react-hook-form";

type Props = {
  fields: FieldArrayWithId<MergeParams, "listForm", "key">[];
  register: UseFormRegister<MergeParams>;
  getValues: UseFormGetValues<MergeParams>;
  validationNumber: RegExp;
  // eslint-disable-next-line no-unused-vars
  onClickListModify: (index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  setDeleteIds: React.Dispatch<React.SetStateAction<string[]>>;
  remove: UseFieldArrayRemove;
  // eslint-disable-next-line no-unused-vars
  insertInputForm: (index: number) => void;
  errors: FieldErrors<MergeParams>;
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
  } = props;
  return (
    <>
      {fields.map((field, index) => {
        return (
          <Box w={{ base: "100%", md: "50%" }} key={field.key} bg="white" py={4} px={2} rounded={10} boxShadow="md">
            <HStack>
              <Checkbox size="lg" colorScheme="green" ml={1} {...register(`listForm.${index}.isBought`)} />
              <Input
                border={getValues(`listForm.${index}.id`) ? "none" : "1px solid black"}
                placeholder="商品名"
                w="50%"
                fontSize={{ base: "sm", md: "md" }}
                px={1}
                isReadOnly={!!getValues(`listForm.${index}.id`)}
                ml={0}
                {...register(`listForm.${index}.purchaseName`, {
                  required: { value: true, message: "商品名が入力されていません" },
                  maxLength: { value: 30, message: "最大文字数は30文字までです。" },
                })}
              />
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
          </Box>
        );
      })}
    </>
  );
});
