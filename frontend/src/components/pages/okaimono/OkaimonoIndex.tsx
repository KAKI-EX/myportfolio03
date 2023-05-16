import { ChevronDownIcon, DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  Table,
  TableCaption,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useGetOkaimonoIndex } from "hooks/useGetOkaimonoIndex";
import React, { memo, useEffect, useState, VFC } from "react";
import { useHistory } from "react-router-dom";

export const OkaimonoIndex: VFC = memo(() => {
  const history = useHistory();
  const [okaimonoMemo, setOkaimonoMemo] = useState<{ data: any } | null>();
  const getOkaimonoIndex = useGetOkaimonoIndex();
  useEffect(() => {
    const getIndex = async () => {
      try {
        const res = await getOkaimonoIndex();
        if (res) {
          setOkaimonoMemo(res);
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    getIndex();
  }, []);

  const onClickShowMemo = (id: any) => (event: React.MouseEvent) => {
    event.preventDefault();
    alert(id);
    history.push(`/okaimono/okaimono_show/${id}`);
  };

  return (
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
                  {okaimonoMemo?.data.map((i: any) => {
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
                                <MenuItem>修正する</MenuItem>
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
              </TabPanel>
              <TabPanel>
                <p>two!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {okaimonoMemo?.data?.length === 0 ? (
            <Flex align="center" justify="center">
              <Box p="5%" my="10%" bg="teal.500" rounded={10} color="white">
                お買い物メモがまだ登録されていないようです・・・。
              </Box>
            </Flex>
          ) : (
            ""
          )}
        </Box>
      </Box>
    </Flex>
  );
});
