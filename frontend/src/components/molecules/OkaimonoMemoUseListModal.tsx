import {
  Box,
  Button,
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
  VStack,
} from "@chakra-ui/react";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { MergeParams } from "interfaces";
import { memo, VFC } from "react";
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

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
  } = props;
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
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder="商品名"
                    w="70%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...listRegister(`modifyPurchaseName`, {
                      required: { value: true, message: "商品名が入力されていません" },
                      maxLength: { value: 30, message: "最大文字数は30文字までです。" },
                    })}
                  />
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
