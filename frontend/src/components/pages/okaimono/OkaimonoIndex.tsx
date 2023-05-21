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
import { OkaimonoMemoData, OkaimonoMemoResponse } from "interfaces";
import { memosUpdate } from "lib/api/update";
import { shoppingDataDelete } from "lib/api/destroy";

export const OkaimonoIndex: VFC = memo(() => {
  const history = useHistory();
  const [okaimonoMemo, setOkaimonoMemo] = useState<OkaimonoMemoResponse | null>();
  const getOkaimonoIndex = useGetOkaimonoIndex();
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const [deletePost, setDeletePost] = useState<string>("");

  useEffect(() => {
    const getIndex = async () => {
      try {
        setLoading(true);
        const res = await getOkaimonoIndex();
        if (res) {
          setOkaimonoMemo(res);
          setLoading(false);
        }
        if (res?.data.length === 0) {
          showMessage({ title: "まだメモが登録されていません", status: "info" });
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: "エラーが発生しました。", status: "error" });
        setLoading(false);
      }
    };
    getIndex();
  }, []);

  const onClickDelete = useCallback(
    async (shoppingDataId: string) => {
      onClose();
      try {
        if (okaimonoMemo) {
          const shoppingDataDeleteRes = await shoppingDataDelete(okaimonoMemo?.data[0].userId, shoppingDataId);
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

  const onClickShowMemo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    history.push(`/okaimono/okaimono_show/${id}`);
  };

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
              <Tab _focus={{ outline: "none" }}>新規リスト</Tab>
              <Tab _focus={{ outline: "none" }}>Two</Tab>
              <Tab _focus={{ outline: "none" }}>Theree</Tab>
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
                        borderBottomRadius="1px"
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
                        borderBottomRadius="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                        // display={{ base: "none", md: "table-cell" }}
                      >
                        メモ
                      </Th>
                      <Th
                        color="white"
                        bg="teal.500"
                        w={{ base: "", md: "13%" }}
                        borderBottomRadius="1px"
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
                        borderBottomRadius="1px"
                        borderColor="gray.400"
                        textAlign="center"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        一言メモ
                      </Th>
                      <Th
                        bg="teal.500"
                        px="0"
                        w={{ base: "7%", md: "8%" }}
                        borderBottomRadius="1px"
                        borderColor="gray.400"
                      />
                    </Tr>
                  </Thead>
                  {okaimonoMemo?.data.map((i: OkaimonoMemoData) => {
                    return (
                      <Tbody key={i.id} _hover={{ fontWeight: "bold" }}>
                        <Tr>
                          <Td
                            borderTop="1px"
                            borderColor="gray.300"
                            fontSize={{ base: "sm", md: "md" }}
                            textAlign="center"
                            onClick={onClickShowMemo(i.id)}
                          >
                            {i.shoppingDate}
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
                                <MenuItem>お買い物で使ってみる！</MenuItem>
                                <MenuItem onClick={onClickShowMemo(i.id)}>確認する</MenuItem>
                                <MenuItem onClick={onClickShowMemo(i.id)}>修正する</MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    setDeletePost(i.id);
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
              <TabPanel>
                <p>two!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {okaimonoMemo?.data.length === 0 ? (
            <Flex align="center" justify="center">
              <Box p="5%" my="10%" bg="teal.400" rounded={10} color="white">
                <Text as="b">メモが未登録です。</Text>
              </Box>
            </Flex>
          ) : (
            ""
          )}
        </Box>
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                メモを削除しますか？
              </AlertDialogHeader>
              <AlertDialogBody>削除したメモは元に戻せません。</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={() => onClickDelete(deletePost)} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Flex>
  );
});
