import {
  Box,
  ComponentWithAs,
  Divider,
  HStack,
  IconProps,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { AddIconButton } from "components/atoms/AddIconButton";
import { CloseIconButton } from "components/atoms/CloseIconButton";
import { InputPurchaseName } from "components/atoms/InputPurchaseName";
import { useSeparateFunctionPurchaseName } from "hooks/useSeparateFunctionPurchaseName";
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
import { PurchaseNameSuggestion } from "components/atoms/PurchaseNameSuggestion";
import { InputAmount } from "components/atoms/InputAmount";
import { InputShoppingDetailMemo } from "components/atoms/InputShoppingDetailMemo";
import { InputPrice } from "components/atoms/InputPrice";
// import { InputExpiryDateEnd } from "components/atoms/InputExpiryDateEnd";
import { TitleHeading } from "components/atoms/TitleHeading";
import { InputExpiryDateEnd } from "components/atoms/InputExpiryDateEnd";

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
  isFinished?: boolean | undefined
};

export const OkaimonoDetail: VFC<Props> = memo((props) => {
  const {
    fields,
    insertInputForm,
    remove,
    register,
    errors,
    validationNumber,
    readOnly = false,
    getValues,
    setDeleteIds,
    // expiryDate,
    onListChange,
    purchaseNameSuggestions,
    setValue,
    setPurchaseNameSuggestions,
    purchaseNameIndex,
    isFinished,
  } = props;

  const separeteFunction = useSeparateFunctionPurchaseName();

  return (
    <Box w={{ base: "100%", md: "70%", xl: "60%" }}>
      <TitleHeading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
        お買物リスト
      </TitleHeading>
      {fields.map((field, index) => {
        const customhookProps = {
          // eslint-disable-next-line no-unused-vars
          register,
          index,
          onListChange,
          setPurchaseNameSuggestions,
        };
        const { ref, onChange: customOnChange, ...rest } = separeteFunction(customhookProps);
        // const startDate = watch(`listForm.${index}.expiryDateStart`);
        return (
          <HStack key={field.key} px={2} py={3} w="100%" bg="white" rounded="xl" mb="2">
            <VStack spacing={1} w="5%">
              <Box
                display={fields.length < 20 || readOnly ? "block" : "none"}
                _hover={readOnly ? undefined : { cursor: "pointer" }}
              >
                <AddIconButton readOnly={readOnly} insertInputForm={insertInputForm} index={index} />
              </Box>
              <Box display={fields.length > 1 ? "block" : "none"} _hover={readOnly ? undefined : { cursor: "pointer" }}>
                <CloseIconButton
                  readOnly={readOnly}
                  getValues={getValues}
                  index={index}
                  setDeleteIds={setDeleteIds}
                  remove={remove}
                />
              </Box>
            </VStack>
            <VStack w="100%" pt={2} pr={3}>
              <HStack w="100%">
                <Box w="70%">
                  <InputPurchaseName readOnly={readOnly} customOnChange={customOnChange} inputRef={ref} rest={rest} />
                  <PurchaseNameSuggestion
                    index={index}
                    setValue={setValue}
                    setPurchaseNameSuggestions={setPurchaseNameSuggestions}
                    purchaseNameIndex={purchaseNameIndex}
                    purchaseNameSuggestions={purchaseNameSuggestions}
                  />
                </Box>
                <Box w="30%">
                  <InputAmount
                    readOnly={readOnly}
                    register={register}
                    index={index}
                    validationNumber={validationNumber}
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
                  <InputShoppingDetailMemo readOnly={readOnly} register={register} index={index} />
                </Box>
                <Box w="30%">
                  <InputGroup _hover={readOnly ? undefined : { fontWeight: "bold", cursor: "pointer" }}>
                    <InputPrice
                      readOnly={readOnly}
                      register={register}
                      index={index}
                      validationNumber={validationNumber}
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
              {isFinished && (
                <>
                  <Divider my={4} />
                  <HStack w="70%" py={2}>
                    {/* <Box w="50%">
                      <InputExpiryDateStart
                        readOnly={readOnly}
                        register={register}
                        index={index}
                        expiryDate={expiryDate}
                      />
                    </Box> */}
                    <Box w="100%">
                      <InputExpiryDateEnd
                        readOnly={readOnly}
                        register={register}
                        index={index}
                        // startDate={startDate}
                      />
                      {/* {errors.listForm && errors.listForm[index]?.expiryDateEnd && (
                        <Box color="red" fontSize="sm">
                          {errors.listForm[index]?.expiryDateEnd?.message}
                        </Box>
                      )} */}
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
