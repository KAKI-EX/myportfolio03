import { ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  ModalFooter,
  Button,
  useDisclosure,
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { useForm } from "react-hook-form";
import { OkaimonoShopModifingData, OkaimonoShopsDataResponse, OkaimonoShopsIndexData } from "interfaces";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { shopDelete } from "lib/api/destroy";
import { useGetShopIndex } from "hooks/useGetShopIndex";
import { useUpdateShopData } from "hooks/useUpdateShopData";
import { useDeleteShopData } from "hooks/useDeleteShopData";

export const OkaimonoShopShow: VFC = memo(() => {
  const [shopsindex, setShopsIndex] = useState<OkaimonoShopsDataResponse>();
  const [shopFormData, setShopFormData] = useState<OkaimonoShopsIndexData>();
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const cancelRef = React.useRef(null);
  // modalを2つ使うため、競合防止のために記述。
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();
  const getShopsIndex = useGetShopIndex(setShopsIndex);

  // -------------------------------------------------------------
  // shop一覧の読み込み
  useEffect(() => {
    getShopsIndex();
  }, []);
  // -------------------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<OkaimonoShopModifingData>({
    criteriaMode: "all",
    mode: "all",
    reValidateMode: "onSubmit",
  });

  const openModal = (shopData: OkaimonoShopsIndexData) => {
    console.log("チェック", shopData.shopName);
    setValue("shopName", shopData.shopName);
    setValue("shopMemo", shopData.shopMemo);
    setValue("shopId", shopData.id);
    setValue("userId", shopData.userId);
    onEditModalOpen();
  };

  // -------------------------------------------------------------
  // shop情報のupdate処理を記述
  const updateShopData = useUpdateShopData({ readOnly, setValue, setShopsIndex });
  const onSubmit = useCallback(
    (formData: OkaimonoShopModifingData) => {
      updateShopData(formData);
      setReadOnly(!readOnly);
    },
    [readOnly]
  );
  // -------------------------------------------------------------

  const addActionOnClose = () => {
    setReadOnly(true);
    reset();
    onEditModalClose();
  };

  // -------------------------------------------------------------
  // shop情報のdelete処理の記述
  const deleteShopData = useDeleteShopData({ onDeleteDialogClose, setShopsIndex });

  const onClickDelete = useCallback(
    (formData: OkaimonoShopModifingData) => {
      deleteShopData(formData);
    },
    [shopDelete]
  );
  // -------------------------------------------------------------

  return (
    <Flex align="center" justify="center" px={3} rounded={10}>
      <VStack w="100rem">
        <Heading as="h2" size="lg" textAlign="center" pt={3}>
          登録したお店情報一覧
        </Heading>
        <Divider my={4} />
        <VStack w="100%" borderRadius="md">
          <Table variant="simple" w="100%" bg="white" rounded={10} boxShadow="md">
            <Thead>
              <Tr>
                <Th
                  px={0}
                  color="white"
                  bg="teal.500"
                  w={{ base: "40%", md: "40%" }}
                  borderBottomRadius="1px"
                  borderColor="gray.400"
                  textAlign="center"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  お店の名前
                </Th>
                <Th
                  color="white"
                  bg="teal.500"
                  w={{ base: "55%", md: "40%" }}
                  borderBottomRadius="1px"
                  borderColor="gray.400"
                  textAlign="center"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  お店情報管理用メモ
                </Th>
                <Th
                  bg="teal.500"
                  px="0"
                  w={{ base: "5%", md: "20%" }}
                  borderBottomRadius="1px"
                  borderColor="gray.400"
                />
              </Tr>
            </Thead>
            {shopsindex?.data.map((shopData: OkaimonoShopsIndexData) => {
              return (
                <Tbody _hover={{ fontWeight: "bold" }} key={shopData.id}>
                  <Tr>
                    <Td
                      borderTop="1px"
                      borderColor="gray.300"
                      fontSize={{ base: "sm", md: "md" }}
                      textAlign="left"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      maxWidth="100px"
                      px={2}
                      onClick={() => openModal(shopData)}
                    >
                      {shopData.shopName}
                    </Td>
                    <Td
                      borderTop="1px"
                      borderColor="gray.300"
                      fontSize={{ base: "sm", md: "md" }}
                      // display={{ base: "none", md: "table-cell" }}
                      textAlign="left"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      maxWidth="100px"
                      onClick={() => openModal(shopData)}
                    >
                      {shopData.shopMemo}
                    </Td>
                    <Td
                      px="0"
                      borderTop="1px"
                      borderColor="gray.300"
                      textAlign="center"
                      display={{ base: "table-cell", md: "none" }}
                    >
                      <Menu>
                        <MenuButton as={ChevronDownIcon}>Actions</MenuButton>
                        <MenuList borderRadius="md" shadow="md">
                          <MenuItem
                            onClick={() => {
                              openModal(shopData);
                            }}
                          >
                            確認する
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setShopFormData(shopData);
                              onDeleteDialogOpen();
                            }}
                          >
                            削除する
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                    <Td
                      px="0"
                      borderTop="1px"
                      borderColor="gray.300"
                      textAlign="center"
                      display={{ base: "none", md: "table-cell" }}
                    >
                      <Icon
                        as={DeleteIcon}
                        bg="white"
                        boxSize={4}
                        mr="4"
                        onClick={() => {
                          setShopFormData(shopData);
                          onDeleteDialogOpen();
                        }}
                      />
                      <Icon
                        as={EditIcon}
                        bg="white"
                        boxSize={4}
                        onClick={() => {
                          openModal(shopData);
                        }}
                      />
                    </Td>
                  </Tr>
                </Tbody>
              );
            })}
          </Table>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
              <ModalOverlay />
              <ModalContent bg="gray.100" maxW="95vw">
                <ModalHeader>お店の情報</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack>
                    <Input
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      isReadOnly={readOnly}
                      {...register("shopName", {
                        maxLength: { value: 35, message: "最大文字数は35文字までです" },
                      })}
                    />
                    {errors.shopName && errors.shopName.types?.maxLength && (
                      <Box color="red">{errors.shopName.types.maxLength}</Box>
                    )}
                    <Input bg={readOnly ? "blackAlpha.200" : "white"} isReadOnly={readOnly} {...register("shopMemo")} />
                    <Input type="hidden" {...register("shopId")} />
                    <Input type="hidden" {...register("userId")} />
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack>
                    <Button bg="gray.400" color="white" mr={3} onClick={addActionOnClose}>
                      閉じる
                    </Button>
                    <PrimaryButtonForReactHookForm onClick={handleSubmit(onSubmit)}>
                      {readOnly ? "編集" : "保存"}{" "}
                    </PrimaryButtonForReactHookForm>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </form>
          <AlertDialog isOpen={isDeleteDialogOpen} leastDestructiveRef={cancelRef} onClose={onDeleteDialogClose}>
            <AlertDialogOverlay>
              <AlertDialogContent maxW="95vw">
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  お店の情報を削除しますか？
                </AlertDialogHeader>
                <AlertDialogBody>
                  お店に紐づいている{shopFormData?.shoppingDataCount}件のお買い物記録も削除されます。
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onDeleteDialogClose}>
                    やっぱりやめる
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      if (shopFormData) {
                        onClickDelete(shopFormData);
                      }
                    }}
                    ml={3}
                  >
                    削除する
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </VStack>
      </VStack>
    </Flex>
  );
});
