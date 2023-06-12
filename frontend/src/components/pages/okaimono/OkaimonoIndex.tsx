import { ChevronDownIcon, DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
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
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
} from "@chakra-ui/react";
import { useGetOkaimonoIndex } from "hooks/useGetOkaimonoIndex";
import { useMessage } from "hooks/useToast";
import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";
import { OkaimonoMemoData, OkaimonoMemoResponse, ListFormParams } from "interfaces";
import { shoppingDataDelete } from "lib/api/destroy";
import { useDateConversion } from "hooks/useDateConversion";

export const OkaimonoIndex: VFC = memo(() => {
  const history = useHistory();
  const [okaimonoMemo, setOkaimonoMemo] = useState<OkaimonoMemoResponse | null>();
  const [inCompleteMemo, setInCompleteMemo] = useState<OkaimonoMemoData[] | null>();
  const [readyShoppingMemo, setReadyShoppingMemo] = useState<OkaimonoMemoData[] | null>();
  const [finishedMemo, setFinishedMemo] = useState<OkaimonoMemoData[] | null>();
  const getOkaimonoIndex = useGetOkaimonoIndex();
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const [deletePost, setDeletePost] = useState<OkaimonoMemoData>();
  const { dateConversion } = useDateConversion();

  useEffect(() => {
    const getIndex = async () => {
      try {
        setLoading(true);
        const indexRes = await getOkaimonoIndex();
        console.log("resdayo", indexRes);
        if (indexRes) {
          const isFinishNull = indexRes.data // 一時保存中のメモリストデータ
            .filter((resData: ListFormParams) => resData.isFinish === null)
            .map((nullList: ListFormParams) => {
              const inCompleteData = { ...nullList };
              return inCompleteData;
            });

          const isFinishFalse = indexRes.data // 買い物予定のメモリストデータ
            .filter((resData: ListFormParams) => resData.isFinish === false)
            .map((falseList: ListFormParams) => {
              const readyShopping = { ...falseList };
              return readyShopping;
            });

          const isFinishTrue = indexRes.data // 買い物が終了したメモリストデータ
            .filter((resData: ListFormParams) => resData.isFinish === true)
            .map((trueList: ListFormParams) => {
              const finishedShopping = { ...trueList };
              return finishedShopping;
            });

          setInCompleteMemo(isFinishNull);
          setOkaimonoMemo(indexRes);
          setReadyShoppingMemo(isFinishFalse);
          setFinishedMemo(isFinishTrue);
          setLoading(false);
        }
        if (indexRes?.data.length === 0) {
          showMessage({ title: "まだメモが登録されていません", status: "info" });
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: axiosError.response?.data.errors, status: "error" });
        setLoading(false);
      }
    };
    getIndex();
  }, []);

  const onClickDelete = useCallback(
    async (props: OkaimonoMemoData) => {
      onClose();
      const { id } = props;
      try {
        if (okaimonoMemo) {
          const shoppingDataDeleteRes = await shoppingDataDelete(okaimonoMemo?.data[0].userId, id);
          console.log(shoppingDataDeleteRes);
          const res = await getOkaimonoIndex();
          setOkaimonoMemo(res);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: "エラーが発生しました。", status: "error" });
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

  console.log("inCompleteMemo", inCompleteMemo);
  console.log("readyShoppingMemo", readyShoppingMemo);
  console.log("finishedMemo", finishedMemo);

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <Flex align="center" justify="center" px={2}>
      <Box w="100rem">
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
                  <Thead>
                    <Tr>
                      <Th
                        p={0}
                        color="white"
                        bg="teal.500"
                        w={{ base: "35%", md: "20%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        お買い物予定日
                      </Th>
                      <Th
                        p={0}
                        color="white"
                        bg="teal.500"
                        w={{ base: "15%", md: "10%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                        // display={{ base: "none", md: "table-cell" }}
                      >
                        リスト数
                      </Th>
                      <Th
                        color="white"
                        bg="teal.500"
                        w={{ base: "", md: "13%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                        display={{ base: "none", md: "table-cell" }}
                      >
                        ゆるい予算
                      </Th>
                      <Th
                        color="white"
                        bg="teal.500"
                        px="17px"
                        w={{ base: "43%", md: "22%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        一言メモ
                      </Th>
                      <Th bg="teal.500" px="0" w={{ base: "7%", md: "8%" }} borderBottom="1px" borderColor="gray.400" />
                    </Tr>
                  </Thead>
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
                            display={{ base: "table-cell", md: "none" }}
                          >
                            <Menu>
                              <MenuButton as={ChevronDownIcon}>Actions</MenuButton>
                              <MenuList borderRadius="md" shadow="md">
                                <MenuItem onClick={onClickShowMemo(i.id)}>確認する</MenuItem>
                                <MenuItem onClick={onClickShowMemo(i.id)}>修正する</MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setDeletePost(i);
                                    onOpen();
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
                            <Icon as={DeleteIcon} bg="white" boxSize={4} mr="4" />
                            <Icon as={EditIcon} bg="white" boxSize={4} />
                          </Td>
                        </Tr>
                      </Tbody>
                    );
                  })}
                </Table>
              </TabPanel>
              <TabPanel p={1}>
                <Table variant="simple" w="100%" bg="white" rounded={10}>
                  <Thead>
                    <Tr>
                      <Th
                        p={0}
                        color="white"
                        bg="teal.500"
                        w={{ base: "35%", md: "20%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        お買い物予定日
                      </Th>
                      <Th
                        p={0}
                        color="white"
                        bg="teal.500"
                        w={{ base: "15%", md: "10%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                        // display={{ base: "none", md: "table-cell" }}
                      >
                        リスト数
                      </Th>
                      <Th
                        color="white"
                        bg="teal.500"
                        w={{ base: "", md: "13%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                        display={{ base: "none", md: "table-cell" }}
                      >
                        ゆるい予算
                      </Th>
                      <Th
                        color="white"
                        bg="teal.500"
                        px="17px"
                        w={{ base: "43%", md: "22%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        一言メモ
                      </Th>
                      <Th bg="teal.500" px="0" w={{ base: "7%", md: "8%" }} borderBottom="1px" borderColor="gray.400" />
                    </Tr>
                  </Thead>
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
                            display={{ base: "table-cell", md: "none" }}
                          >
                            <Menu>
                              <MenuButton as={ChevronDownIcon}>Actions</MenuButton>
                              <MenuList borderRadius="md" shadow="md">
                                <MenuItem onClick={onClickMemoUse(i.id)}>お買い物で使ってみる！</MenuItem>
                                <MenuItem onClick={onClickShowMemo(i.id)}>確認する</MenuItem>
                                <MenuItem onClick={onClickShowMemo(i.id)}>修正する</MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setDeletePost(i);
                                    onOpen();
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
                            <Icon as={DeleteIcon} bg="white" boxSize={4} mr="4" />
                            <Icon as={EditIcon} bg="white" boxSize={4} />
                          </Td>
                        </Tr>
                      </Tbody>
                    );
                  })}
                </Table>
              </TabPanel>
              <TabPanel p={1}>
                <Table variant="simple" w="100%" bg="white" rounded={10}>
                  <Thead>
                    <Tr>
                      <Th
                        p={0}
                        color="white"
                        bg="teal.500"
                        w={{ base: "35%", md: "20%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        お買い物予定日
                      </Th>
                      <Th
                        p={0}
                        color="white"
                        bg="teal.500"
                        w={{ base: "15%", md: "10%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                        // display={{ base: "none", md: "table-cell" }}
                      >
                        リスト数
                      </Th>
                      <Th
                        color="white"
                        bg="teal.500"
                        w={{ base: "", md: "13%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                        display={{ base: "none", md: "table-cell" }}
                      >
                        ゆるい予算
                      </Th>
                      <Th
                        color="white"
                        bg="teal.500"
                        px="17px"
                        w={{ base: "43%", md: "22%" }}
                        borderBottom="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        一言メモ
                      </Th>
                      <Th bg="teal.500" px="0" w={{ base: "7%", md: "8%" }} borderBottom="1px" borderColor="gray.400" />
                    </Tr>
                  </Thead>
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
                            display={{ base: "table-cell", md: "none" }}
                          >
                            <Menu>
                              <MenuButton as={ChevronDownIcon}>Actions</MenuButton>
                              <MenuList borderRadius="md" shadow="md">
                                <MenuItem onClick={onClickShowMemo(i.id)}>確認する</MenuItem>
                                <MenuItem onClick={onClickShowMemo(i.id)}>修正する</MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setDeletePost(i);
                                    onOpen();
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
                            <Icon as={DeleteIcon} bg="white" boxSize={4} mr="4" />
                            <Icon as={EditIcon} bg="white" boxSize={4} />
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
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {dateConversion(deletePost?.shoppingDate)} のメモを削除しますか？
              </AlertDialogHeader>
              <AlertDialogBody>メモに保存されているリストも削除されます。</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  やっぱりやめる
                </Button>
                <Button colorScheme="red" onClick={() => (deletePost ? onClickDelete(deletePost) : undefined)} ml={3}>
                  削除する
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Flex>
  );
});
