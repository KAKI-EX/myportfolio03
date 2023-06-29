import {
  Box,
  Button,
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
  Stack,
} from "@chakra-ui/react";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { MergeParams } from "interfaces";
import { memo, VFC } from "react";
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

type Props = {
  isShoppingDatumOpen: boolean;
  closeShoppingDatum: () => void;
  readOnly: boolean;
  shoppingDatumRegister: UseFormRegister<MergeParams>;
  shoppingDatumErrors: FieldErrors<MergeParams>;
  validationNumber: RegExp;
  onCloseShoppingDatum: () => void;
  // eslint-disable-next-line no-unused-vars
  shoppingDatumSubmit: (formData: MergeParams) => void;
  shoppiingDatumModifyHandleSubmit: UseFormHandleSubmit<MergeParams>;
};

export const OkaimonoMemoUseMemoModal: VFC<Props> = memo((props) => {
  const {
    isShoppingDatumOpen,
    closeShoppingDatum,
    readOnly,
    shoppingDatumRegister,
    shoppingDatumErrors,
    validationNumber,
    onCloseShoppingDatum,
    shoppingDatumSubmit,
    shoppiingDatumModifyHandleSubmit,
  } = props;
  return (
    <Modal isOpen={isShoppingDatumOpen} onClose={closeShoppingDatum}>
      <ModalOverlay />
      <ModalContent bg="gray.100" maxW="95vw">
        <ModalHeader>選択したお買い物メモ情報</ModalHeader>
        <ModalCloseButton _focus={{ boxShadow: "none" }} />
        <ModalBody>
          <Box bg="white" rounded="xl">
            <Stack align="center" justify="center" py={6} spacing="3">
              <Input
                isReadOnly={readOnly}
                bg={readOnly ? "blackAlpha.200" : "white"}
                size="md"
                type="date"
                w="90%"
                fontSize={{ base: "sm", md: "md" }}
                {...shoppingDatumRegister("modifyShoppingDate")}
              />
              <Input
                isReadOnly={readOnly}
                bg={readOnly ? "blackAlpha.200" : "white"}
                placeholder={!readOnly ? "お店の名前" : ""}
                size="md"
                w="90%"
                fontSize={{ base: "sm", md: "md" }}
                {...shoppingDatumRegister("modifyShopName", {
                  maxLength: { value: 35, message: "最大文字数は35文字までです。" },
                })}
              />
              {shoppingDatumErrors.modifyShopName && shoppingDatumErrors.modifyShopName.types?.maxLength && (
                <Box color="red">{shoppingDatumErrors.modifyShopName.types.maxLength}</Box>
              )}
              <InputGroup w="90%">
                <Input
                  isReadOnly={readOnly}
                  bg={readOnly ? "blackAlpha.200" : "white"}
                  size="md"
                  placeholder={!readOnly ? "お買い物の予算" : ""}
                  type="number"
                  fontSize={{ base: "sm", md: "md" }}
                  {...shoppingDatumRegister("modifyEstimatedBudget", {
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
              {shoppingDatumErrors.modifyEstimatedBudget &&
                shoppingDatumErrors.modifyEstimatedBudget.types?.pattern && (
                  <Box color="red">{shoppingDatumErrors.modifyEstimatedBudget.types.pattern}</Box>
                )}
              <Input
                isReadOnly={readOnly}
                bg={readOnly ? "blackAlpha.200" : "white"}
                placeholder={!readOnly ? "一言メモ" : ""}
                size="md"
                w="90%"
                fontSize={{ base: "sm", md: "md" }}
                {...shoppingDatumRegister("modifyShoppingMemo", {
                  maxLength: { value: 150, message: "最大文字数は150文字です。" },
                })}
              />
              {shoppingDatumErrors.modifyShoppingMemo && shoppingDatumErrors.modifyShoppingMemo.types?.maxLength && (
                <Box color="red">{shoppingDatumErrors.modifyShoppingMemo.types.maxLength}</Box>
              )}
              <Input type="hidden" {...shoppingDatumRegister(`modyfyShoppingDatumId`)} />
            </Stack>
          </Box>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button bg="gray.400" color="white" mr={3} onClick={onCloseShoppingDatum}>
              閉じる
            </Button>
            <PrimaryButtonForReactHookForm onClick={shoppiingDatumModifyHandleSubmit(shoppingDatumSubmit)}>
              {readOnly ? "編集" : "保存"}{" "}
            </PrimaryButtonForReactHookForm>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
