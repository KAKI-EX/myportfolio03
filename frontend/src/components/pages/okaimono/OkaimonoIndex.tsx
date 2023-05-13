import { ChevronDownIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
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
import { memo, VFC } from "react";

export const OkaimonoIndex: VFC = memo(() => {
  return (
    <Flex align="center" justify="center" px={3}>
      <Box w="100rem">
        <Heading as="h1" size="lg" textAlign="center" my={5}>
          お買い物リスト一覧
        </Heading>
        <Table variant="simple" w="100%">
          <Thead>
            <Tr>
              <Th
                w={{ base: "10%", md: "30%" }}
                borderBottomRadius="1px"
                borderColor="gray.400"
                textAlign="center"
                fontSize={{ base: "sm", md: "md" }}
              >
                お買い物日
              </Th>
              <Th
                w="25%"
                borderBottomRadius="1px"
                borderColor="gray.400"
                textAlign="center"
                fontSize={{ base: "sm", md: "md" }}
                display={{ base: "none", md: "table-cell" }}
              >
                メモ数
              </Th>
              <Th
                px="17px"
                w={{ base: "85%", md: "30%" }}
                borderBottomRadius="1px"
                borderColor="gray.400"
                textAlign="center"
                fontSize={{ base: "sm", md: "md" }}
              >
                一言メモ
              </Th>
              <Th px="0" w={{ base: "5%", md: "30%" }} borderBottomRadius="1px" borderColor="gray.400" />
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td borderTop="1px" borderColor="gray.300" fontSize={{ base: "sm", md: "md" }} textAlign="center">
                2023/11/03
              </Td>
              <Td
                borderTop="1px"
                borderColor="gray.300"
                fontSize={{ base: "sm", md: "md" }}
                display={{ base: "none", md: "table-cell" }}
                textAlign="center"
              >
                10
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
                特売日です！！！aaaaaaaaaaaaaaaaaaaaaaaaa
              </Td>
              <Td px="0" borderTop="1px" borderColor="gray.300" textAlign="center">
                <Menu>
                  <MenuButton as={ChevronDownIcon}>Actions</MenuButton>
                  <MenuList borderRadius="md" shadow="md">
                    <MenuItem>Download</MenuItem>
                    <MenuItem>Create a Copy</MenuItem>
                    <MenuItem>Mark as Draft</MenuItem>
                    <MenuItem>Delete</MenuItem>
                    <MenuItem>Attend a Workshop</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
});
