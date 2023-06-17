import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useMessage } from "hooks/useToast";
import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import { OkaimonoMemoData, OkaimonoMemoResponse } from "interfaces";
import { shoppingDataDelete } from "lib/api/destroy";
import { useDateConversion } from "hooks/useDateConversion";
import { shoppingDataIndex } from "lib/api/show";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "components/atoms/PrimaryButton";
import { useGetOkaimonoIndex } from "hooks/useGetOkaimonoIndex";
import { useGetOpenUrl } from "hooks/useGetOpenUrl";
import { TableThread } from "components/molecules/TableThread";

export const OkaimonoIndex: VFC = memo(() => {
  const [okaimonoMemo, setOkaimonoMemo] = useState<OkaimonoMemoResponse | null>();
  const [inCompleteMemo, setInCompleteMemo] = useState<OkaimonoMemoData[] | null>();
  const [readyShoppingMemo, setReadyShoppingMemo] = useState<OkaimonoMemoData[] | null>();
  const [finishedMemo, setFinishedMemo] = useState<OkaimonoMemoData[] | null>();
  const [openMessage, setOpenMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [deletePost, setDeletePost] = useState<OkaimonoMemoData>();

  const { showMessage } = useMessage();
  const getIndex = useGetOkaimonoIndex();
  const getOpenUrl = useGetOpenUrl(readyShoppingMemo);
  const { dateConversion } = useDateConversion();

  const history = useHistory();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onCloseAlert } = useDisclosure();
  const { isOpen: isOpenUrl, onOpen: onOpenUrl, onClose: onCloseUrl } = useDisclosure();
  const cancelRef = React.useRef(null);
  const { register, getValues, setValue } = useForm();

  //------------------------------------------------------------------------
  // indexページのリスト読み込み
  useEffect(() => {
    const props = { setLoading, setInCompleteMemo, setOkaimonoMemo, setReadyShoppingMemo, setFinishedMemo };
    getIndex(props);
  }, []);
  //------------------------------------------------------------------------
  // indexページの特定のメモ削除機能
  const onClickDelete = useCallback(
    async (props: OkaimonoMemoData) => {
      onCloseAlert();
      const { id } = props;
      try {
        if (okaimonoMemo) {
          await shoppingDataDelete(id);
          const res = await shoppingDataIndex();
          setOkaimonoMemo(res);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: axiosError.response?.data.errors, status: "error" });
      }
    },
    [okaimonoMemo]
  );
  // ---------------------------------------------------------------------------------
  // paramsを使用してidを渡すリンク
  const onClickShowMemo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    history.push(`/okaimono/okaimono_show/${id}`);
  };

  const onClickMemoUse = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    history.push(`/okaimono/okaimono_memo_use/${id}`);
  };
  // ---------------------------------------------------------------------------------
  // 公開用ページのopenModalとコピー機能(コピー機能はhttps環境下出ないと動作しないため注意)
  const onClickShowOpenUrl = (shoppingDataId: string, event: React.MouseEvent) => {
    const openUrlProps = { setOpenMessage, setValue, onOpenUrl, setLoading, shoppingDataId, event };
    getOpenUrl(openUrlProps);
  };

  const onClickUrlCopy = () => {
    navigator.clipboard.writeText(getValues("openMemoUrl"));
  };
  // ---------------------------------------------------------------------------------

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <Flex align="center" justify="center" px={2}>
      <Box w={{ base: "100rem", md: "60rem" }}>
        <Heading as="h1" size="lg" textAlign="center" my={5}>
          お買い物リスト一覧
        </Heading>
        <Box borderRadius="lg" overflow="hidden" backgroundColor="white" boxShadow="md">
          <Tabs isFitted>
            <TabList>
              <Tab _focus={{ outline: "none" }} fontSize={{ base: "sm", md: "md" }}>
                一時保存中メモ
              </Tab>
              <Tab _focus={{ outline: "none" }} fontSize={{ base: "sm", md: "md" }}>
                買い物予定メモ
              </Tab>
              <Tab _focus={{ outline: "none" }} fontSize={{ base: "sm", md: "md" }}>
                完了メモ
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={1}>
                <Table variant="simple" w="100%" bg="white" rounded={10}>
                  <TableThread />
                  {inCompleteMemo?.map((i: OkaimonoMemoData) => {
                    return (
                      <Tbody key={i.id} _hover={{ fontWeight: "bold" }}>
                        <Tr>
                          <Td
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            textAlign="center"
                            onClick={onClickShowMemo(i.id)}
                            px={0}
                          >
                            {dateConversion(i.shoppingDate)}
                          </Td>
                          <Td
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            // display={{ base: "none", md: "table-cell" }}
                            textAlign="center"
                            onClick={onClickShowMemo(i.id)}
                          >
                            {i.memosCount}
                          </Td>
                          <Td
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            display={{ base: "none", md: "table-cell" }}
                            textAlign="center"
                            onClick={onClickShowMemo(i.id)}
                          >
                            {i.totalBudget}円
                          </Td>
                          <Td
                            px="17px"
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            textAlign="left"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxWidth="100px"
                            onClick={onClickShowMemo(i.id)}
                          >
                            {i.shoppingMemo}
                          </Td>
                          <Td
                            px="0"
                            borderTop="1px"
                            borderColor="gray.300"
                            textAlign="center"
                            display={{ base: "table-cell" }}
                          >
                            <Menu>
                              <MenuButton as={ChevronDownIcon}>Actions</MenuButton>
                              <MenuList borderRadius="md" shadow="md">
                                <MenuItem onClick={onClickShowMemo(i.id)}>確認する</MenuItem>
                                <MenuItem onClick={onClickShowMemo(i.id)}>修正する</MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setDeletePost(i);
                                    onAlertOpen();
                                  }}
                                >
                                  削除する
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      </Tbody>
                    );
                  })}
                </Table>
              </TabPanel>
              <TabPanel p={1}>
                <Table variant="simple" w="100%" bg="white" rounded={10}>
                  <TableThread />
                  {readyShoppingMemo?.map((i: OkaimonoMemoData) => {
                    return (
                      <Tbody key={i.id} _hover={{ fontWeight: "bold" }}>
                        <Tr>
                          <Td
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            textAlign="center"
                            onClick={onClickMemoUse(i.id)}
                            px={0}
                          >
                            {dateConversion(i.shoppingDate)}
                          </Td>
                          <Td
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            // display={{ base: "none", md: "table-cell" }}
                            textAlign="center"
                            onClick={onClickMemoUse(i.id)}
                          >
                            {i.memosCount}
                          </Td>
                          <Td
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            display={{ base: "none", md: "table-cell" }}
                            textAlign="center"
                            onClick={onClickMemoUse(i.id)}
                          >
                            {i.totalBudget}円
                          </Td>
                          <Td
                            px="17px"
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            textAlign="left"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxWidth="100px"
                            onClick={onClickMemoUse(i.id)}
                          >
                            {i.shoppingMemo}
                          </Td>
                          <Td
                            px="0"
                            borderTop="1px"
                            borderColor="gray.300"
                            textAlign="center"
                            display={{ base: "table-cell" }}
                          >
                            <Menu>
                              <MenuButton as={ChevronDownIcon}>Actions</MenuButton>
                              <MenuList borderRadius="md" shadow="md">
                                <MenuItem onClick={onClickMemoUse(i.id)}>お買い物で使ってみる！</MenuItem>
                                <MenuItem onClick={onClickShowMemo(i.id)}>確認する</MenuItem>
                                <MenuItem onClick={(event) => onClickShowOpenUrl(i.id, event)}>
                                  公開用URLを確認する
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setDeletePost(i);
                                    onAlertOpen();
                                  }}
                                >
                                  削除する
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      </Tbody>
                    );
                  })}
                </Table>
              </TabPanel>
              <TabPanel p={1}>
                <Table variant="simple" w="100%" bg="white" rounded={10}>
                  <TableThread />
                  {finishedMemo?.map((i: OkaimonoMemoData) => {
                    return (
                      <Tbody key={i.id} _hover={{ fontWeight: "bold" }}>
                        <Tr>
                          <Td
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            textAlign="center"
                            onClick={onClickShowMemo(i.id)}
                            px={0}
                          >
                            {dateConversion(i.shoppingDate)}
                          </Td>
                          <Td
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            // display={{ base: "none", md: "table-cell" }}
                            textAlign="center"
                            onClick={onClickShowMemo(i.id)}
                          >
                            {i.memosCount}
                          </Td>
                          <Td
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            display={{ base: "none", md: "table-cell" }}
                            textAlign="center"
                            onClick={onClickShowMemo(i.id)}
                          >
                            {i.totalBudget}円
                          </Td>
                          <Td
                            px="17px"
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            textAlign="left"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxWidth="100px"
                            onClick={onClickShowMemo(i.id)}
                          >
                            {i.shoppingMemo}
                          </Td>
                          <Td
                            px="0"
                            borderTop="1px"
                            borderColor="gray.300"
                            textAlign="center"
                            display={{ base: "table-cell" }}
                          >
                            <Menu>
                              <MenuButton as={ChevronDownIcon}>Actions</MenuButton>
                              <MenuList borderRadius="md" shadow="md">
                                <MenuItem onClick={onClickShowMemo(i.id)}>確認する</MenuItem>
                                <MenuItem onClick={onClickShowMemo(i.id)}>修正する</MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setDeletePost(i);
                                    onAlertOpen();
                                  }}
                                >
                                  削除する
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      </Tbody>
                    );
                  })}
                </Table>
              </TabPanel>
            </TabPanels>
          </Tabs>
          {okaimonoMemo?.data.length === 0 ? (
            <Flex align="center" justify="center">
              <Box p="5%" my="10%" bg="teal.400" rounded={10} color="white">
                <Text as="b">メモが未登録です。</Text>
              </Box>
            </Flex>
          ) : null}
        </Box>
        <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onAlertOpen}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {dateConversion(deletePost?.shoppingDate)} のメモを削除しますか？
              </AlertDialogHeader>
              <AlertDialogBody>メモに保存されているリストも削除されます。</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onAlertOpen}>
                  やっぱりやめる
                </Button>
                <Button colorScheme="red" onClick={() => (deletePost ? onClickDelete(deletePost) : undefined)} ml={3}>
                  削除する
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Modal isOpen={isOpenUrl} onClose={onCloseUrl}>
          <ModalOverlay />
          <ModalContent maxW="95vw">
            <ModalHeader>公開用URL</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack>
                <Text fontSize={{ base: "sm", md: "md" }}>{openMessage}</Text>
                <InputGroup>
                  <Input pr="4.5rem" {...register("openMemoUrl")} />
                  <InputRightElement width="3.5rem">
                    <Button colorScheme="blue" h="1.75rem" size="sm" color="white" onClick={onClickUrlCopy}>
                      コピー
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <PrimaryButton onClick={onCloseUrl}>閉じる</PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
});
