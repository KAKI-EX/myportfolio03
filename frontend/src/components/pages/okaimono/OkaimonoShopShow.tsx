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
  useToast,
  VStack,
  ModalFooter,
  Button,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { memo, useCallback, useEffect, useState, VFC } from "react";
import { useForm } from "react-hook-form";
import { useCookie } from "hooks/useCookie";
import { shopsShow } from "lib/api/show";
import { AxiosError } from "axios";
import { OkaimonoShopModifingData, OkaimonoShopsDataResponse, OkaimonoShopsIndexData } from "interfaces";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { shopUpdate } from "lib/api/update";

export const OkaimonoShopShow: VFC = memo(() => {
  const { separateCookies } = useCookie();
  const showMessage = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shopsindex, setShopsIndex] = useState<OkaimonoShopsDataResponse>();
  const [readOnly, setReadOnly] = useState<boolean>(true);

  useEffect(() => {
    const getShopsIndex = async () => {
      const userId = separateCookies("_user_id");
      try {
        if (userId) {
          const res = await shopsShow(userId);
          setShopsIndex(res);
          if (res?.data.length === 0) {
            showMessage({ title: "まだメモが登録されていません", status: "info" });
          }
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    };
    getShopsIndex();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
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
    onOpen();
  };

  const onSubmit = useCallback(
    (formData: OkaimonoShopModifingData) => {
      setReadOnly(!readOnly);
      const updateShopData = async () => {
        if (!readOnly) {
          try {
            const makeCustomData: OkaimonoShopModifingData = {
              shopName: formData.shopName,
              shopMemo: formData.shopMemo,
              userId: formData.userId,
              id: formData.shopId,
            };
            const res = await shopUpdate(makeCustomData);
            console.log("response", res.data.shopName);
            setValue("shopName", res.data.shopName);
            setValue("shopMemo", res.data.shopMemo);
            setValue("shopId", res.data.id);
            setValue("userId", res.data.userId);
            const setResIndexPage = await shopsShow(res.data.userId);
            setShopsIndex(setResIndexPage);
          } catch (err) {
            const axiosError = err as AxiosError;
            console.error(axiosError.response);
            showMessage({ title: "エラーが発生しました。", status: "error" });
          }
        }
      };
      updateShopData();
    },
    [readOnly]
  );
  const addActionOnClose = () => {
    setReadOnly(true);
    reset();
    onClose();
  };

  return (
    <Flex align="center" justify="center" px={3} rounded={10}>
      <VStack w="100rem" boxShadow="md">
        <Heading as="h2" size="lg" textAlign="center" pt={3}>
          登録したお店情報一覧
        </Heading>
        <Divider my={4} />
        <VStack w="100%" borderRadius="md">
          <Table variant="simple" w="100%" bg="white" rounded={10}>
            <Thead>
              <Tr>
                <Th
                  px={0}
                  color="white"
                  bg="teal.500"
                  w={{ base: "40%", md: "20%" }}
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
                  w={{ base: "55%", md: "10%" }}
                  borderBottomRadius="1px"
                  borderColor="gray.400"
                  textAlign="center"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  お店情報管理用メモ
                </Th>
                <Th bg="teal.500" px="0" w={{ base: "5%", md: "8%" }} borderBottomRadius="1px" borderColor="gray.400" />
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
                          <MenuItem>削除する</MenuItem>
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
                      <Icon as={DeleteIcon} bg="white" boxSize={4} mr="4" />
                      <Icon as={EditIcon} bg="white" boxSize={4} />
                    </Td>
                  </Tr>
                </Tbody>
              );
            })}
          </Table>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent bg="gray.100">
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
        </VStack>
      </VStack>
    </Flex>
  );
});
