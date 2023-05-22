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
} from "@chakra-ui/react";
import { memo, useEffect, useState, VFC } from "react";
import { useForm } from "react-hook-form";
import { useCookie } from "hooks/useCookie";
import { shopsShow } from "lib/api/show";
import { AxiosError } from "axios";
import { OkaimonoShopsDataResponse, OkaimonoShopsIndexData } from "interfaces";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";

export const OkaimonoShopShow: VFC = memo(() => {
  const { separateCookies } = useCookie();
  const showMessage = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shopsindex, setShopsIndex] = useState<OkaimonoShopsDataResponse>();

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
                          <MenuItem onClick={onOpen}>確認する</MenuItem>
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
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="gray.100">
              <ModalHeader>お店の情報</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack>
                  <Input bg="white" />
                  <Input bg="white" />
                </VStack>
              </ModalBody>
              <ModalFooter>
                <HStack>
                  <Button bg="gray.400" color="white" mr={3} onClick={onClose}>
                    閉じる
                  </Button>
                  <PrimaryButtonForReactHookForm> 保 存 </PrimaryButtonForReactHookForm>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </VStack>
    </Flex>
  );
});
