import {
  Box,
  Button,
  Divider,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { ListFormParams, MergeParams } from "interfaces";
import React, { memo, VFC } from "react";
import { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form";

type Props = {
  isListOpen: boolean;
  onCloseList: () => void;
  readOnly: boolean;
  listRegister: UseFormRegister<MergeParams>;
  validationNumber: RegExp;
  listErrors: FieldErrors<MergeParams>;
  startDate: string | undefined;
  oneListModifyHandleSubmit: UseFormHandleSubmit<MergeParams>;
  // eslint-disable-next-line no-unused-vars
  onOneSubmit: (oneListFormData: MergeParams) => Promise<void>;
  purchaseNameValue?: string;
  setPurchaseNameSuggestions: React.Dispatch<React.SetStateAction<ListFormParams[]>>;
  listSetValue: UseFormSetValue<MergeParams>;
  purchaseNameSuggestions: ListFormParams[];
  // eslint-disable-next-line no-unused-vars
  onListChange: (event: React.ChangeEvent<HTMLInputElement>, newValue: string, index?: number) => void;
};

export const OkaimonoMemoUseListModal: VFC<Props> = memo((props) => {
  const {
    isListOpen,
    onCloseList,
    readOnly,
    listRegister,
    validationNumber,
    listErrors,
    startDate,
    oneListModifyHandleSubmit,
    onOneSubmit,
    purchaseNameValue,
    setPurchaseNameSuggestions,
    listSetValue,
    purchaseNameSuggestions,
    onListChange,
  } = props;

  const {
    ref,
    onChange: registerOnChange,
    ...rest
  } = listRegister("modifyPurchaseName", {
    required: { value: true, message: "商品名が入力されていません" },
    maxLength: { value: 30, message: "最大文字数は30文字までです。" },
  });

  const onClickSuggests = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, purchaseName: string) => {
    event.preventDefault();

    if (purchaseNameValue && setPurchaseNameSuggestions && purchaseName) {
      listSetValue("modifyPurchaseName", purchaseName);
      setPurchaseNameSuggestions([]);
    }
  };

  const customOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // React Hook Form の onChange ハンドラを実行
    if (registerOnChange) {
      registerOnChange(event);
    }

    // 入力が空の場合、候補リストをクリアする
    if (purchaseNameSuggestions && event.target.value === "") {
      setPurchaseNameSuggestions([]);
    }

    // 親コンポーネントから渡された onChange ハンドラを実行
    if (onListChange) {
      onListChange(event, event.target.value);
    }
  };
  return (
    <Modal isOpen={isListOpen} onClose={onCloseList}>
      <ModalOverlay />
      <ModalContent bg="gray.100" maxW="95vw">
        <ModalHeader>選択したリストの情報</ModalHeader>
        <ModalCloseButton _focus={{ boxShadow: "none" }} />
        <ModalBody>
          <VStack w="100%">
            <Box bg="white" p={3} rounded="md">
              <VStack>
                <HStack>
                  <Box w="100%">
                    <Input
                      onChange={customOnChange}
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      placeholder="商品名"
                      w="70%"
                      fontSize={{ base: "sm", md: "md" }}
                      ref={ref}
                      {...rest}
                    />
                    {purchaseNameSuggestions && purchaseNameSuggestions?.length > 0 && (
                      <Box w="100%" position="relative" zIndex="dropdown">
                        <VStack w="100%" position="absolute" bg="white" boxShadow="lg" align="start" px={5}>
                          {purchaseNameSuggestions.map((value) => (
                            <Box key={value.id} w="100%">
                              <Divider w="100%" />
                              <Text
                                w="100%"
                                // prettier-ignore
                                onClick={(event) =>
                                  (value.purchaseName ? onClickSuggests(event, value.purchaseName) : "")}
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
                  <InputGroup w="30%">
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      placeholder="個数"
                      type="number"
                      fontSize={{ base: "sm", md: "md" }}
                      {...listRegister(`modifyAmount`, {
                        max: { value: 99, message: "上限は99までです。" },
                        pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                      })}
                    />
                    <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                      個
                    </InputRightElement>
                  </InputGroup>
                </HStack>
                {listErrors.modifyPurchaseName && (
                  <Box color="red" fontSize="sm">
                    {listErrors.modifyPurchaseName?.types?.required}
                    {listErrors.modifyPurchaseName?.types?.maxLength}
                  </Box>
                )}
                {listErrors.modifyAmount && (
                  <Box color="red" fontSize="sm">
                    {listErrors.modifyAmount?.types?.max}
                    {listErrors.modifyAmount?.types?.pattern}
                  </Box>
                )}
                <Input
                  isReadOnly={readOnly}
                  bg={readOnly ? "blackAlpha.200" : "white"}
                  placeholder="メモ"
                  fontSize={{ base: "sm", md: "md" }}
                  {...listRegister(`modifyMemo`, {
                    maxLength: { value: 150, message: "最大文字数は150文字です。" },
                  })}
                />
                {listErrors.modifyMemo && (
                  <Box color="red" fontSize="sm">
                    {listErrors.modifyMemo?.types?.maxLength}
                  </Box>
                )}
              </VStack>
            </Box>
            <HStack w="100%" bg="white" p={3} rounded="md">
              <Box w="50%">
                <FormLabel mb="3px" fontSize={{ base: "sm", md: "md" }}>
                  消費期限 開始日
                </FormLabel>
                <Input
                  isReadOnly={readOnly}
                  bg={readOnly ? "blackAlpha.200" : "white"}
                  type="date"
                  placeholder="消費期限 開始"
                  {...listRegister(`modifyExpiryDateStart`)}
                />
              </Box>
              <Box w="50%">
                <FormLabel mb="3px" fontSize={{ base: "sm", md: "md" }}>
                  終了日
                </FormLabel>
                <Input
                  isReadOnly={readOnly}
                  bg={readOnly ? "blackAlpha.200" : "white"}
                  type="date"
                  placeholder="終了日"
                  {...listRegister(`modifyExpiryDateEnd`, {
                    validate: (value) =>
                      !startDate ||
                      !value ||
                      new Date(value) >= new Date(startDate) ||
                      "終了日は開始日以降の日付を選択してください。",
                  })}
                />
              </Box>
            </HStack>
            {listErrors.modifyExpiryDateEnd && (
              <Box color="red" fontSize="sm">
                {listErrors.modifyExpiryDateEnd?.message}
              </Box>
            )}
            <Input type="hidden" {...listRegister(`modifyId`)} />
            <Input type="hidden" {...listRegister(`modifyAsc`)} />
            <Input type="hidden" {...listRegister(`modifyShopId`)} />
            <Input type="hidden" {...listRegister(`modifyListShoppingDatumId`)} />
            <Input type="hidden" {...listRegister(`modifyListShoppingDate`)} />
            <Input type="hidden" {...listRegister(`indexNumber`)} />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button bg="gray.400" color="white" mr={3} onClick={onCloseList}>
              閉じる
            </Button>
            <PrimaryButtonForReactHookForm onClick={oneListModifyHandleSubmit(onOneSubmit)}>
              {readOnly ? "編集" : "保存"}{" "}
            </PrimaryButtonForReactHookForm>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
