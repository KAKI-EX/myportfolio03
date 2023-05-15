/* eslint-disable */

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
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useGetOkaimonoIndex } from "lib/api/get";
import { memo, useEffect, useState, VFC } from "react";

export const OkaimonoIndex: VFC = memo(() => {
  const [memo, setMemo] = useState<{ data: any } | null>();
  const getOkaimonoIndex = useGetOkaimonoIndex();
  useEffect(() => {
    const getIndex = async () => {
      try {
        const res = await getOkaimonoIndex();
        console.log("ここもだよ", res);
        if (res) {
          console.log("げっと", res.data);
          setMemo(res);
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    getIndex();
  }, []);
  console.log("indexだよ", memo?.data);
  console.log(memo?.data?.length === 0);
  console.log("ここだよ", memo?.data?.[0]?.shoppingDate);
  // memo?.data.map((e) => {
  //   console.log(e.id)
  // })

  return (
    <Flex align="center" justify="center" px={3}>
      <Box w="100rem">
        <Heading as="h1" size="lg" textAlign="center" my={5}>
          お買い物リスト一覧
        </Heading>
        <Box borderRadius="lg" overflow="hidden" backgroundColor="white" boxShadow="md">
          <Table variant="simple" w="100%" bg="white" rounded={10}>
            <Thead>
              <Tr>
                <Th
                  color="white"
                  bg="teal.500"
                  w={{ base: "30%", md: "20%" }}
                  borderBottomRadius="1px"
                  borderColor="gray.400"
                  textAlign="center"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  お買い物予定日
                </Th>
                <Th
                  color="white"
                  bg="teal.500"
                  w={{ base: "20%", md: "10%" }}
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
                  w={{ base: "10%", md: "13%" }}
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
                  w={{ base: "30%", md: "22%" }}
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
                  w={{ base: "10%", md: "8%" }}
                  borderBottomRadius="1px"
                  borderColor="gray.400"
                />
              </Tr>
            </Thead>
            {memo?.data.map((i: any) => {
              return (
                <Tbody key={i.id}>
                  <Tr>
                    <>
                      <Td borderTop="1px" borderColor="gray.300" fontSize={{ base: "sm", md: "md" }} textAlign="center">
                        {i.shoppingDate}
                      </Td>
                      <Td
                        borderTop="1px"
                        borderColor="gray.300"
                        fontSize={{ base: "sm", md: "md" }}
                        // display={{ base: "none", md: "table-cell" }}
                        textAlign="center"
                      >
                        {i.memosCount}
                      </Td>
                      <Td
                        borderTop="1px"
                        borderColor="gray.300"
                        fontSize={{ base: "sm", md: "md" }}
                        display={{ base: "none", md: "table-cell" }}
                        textAlign="center"
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
                      >
                        {i.shoppingMemo}
                      </Td>
                    </>
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
                          <MenuItem>確認する</MenuItem>
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
          {memo?.data?.length === 0 ? (
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
