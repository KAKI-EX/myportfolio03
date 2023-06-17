import { Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Th, Thead, Tr } from "@chakra-ui/react";
import { AuthContext } from "App";
import { Children, memo, useContext, VFC } from "react";
import { TableThreadTitle } from "components/atoms/ThreadTitle";

type Props = {};

export const TableThread: VFC<Props> = memo((props) => {
  return (
    <Thead>
      <Tr>
        <TableThreadTitle
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
        </TableThreadTitle>
        <TableThreadTitle
          p={0}
          color="white"
          bg="teal.500"
          w={{ base: "15%", md: "10%" }}
          borderBottom="1px"
          borderColor="gray.400"
          textAlign="center"
          fontSize={{ base: "sm", md: "md" }}
        >
          リスト数
        </TableThreadTitle>
        <TableThreadTitle
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
        </TableThreadTitle>
        <TableThreadTitle
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
        </TableThreadTitle>
        <Th bg="teal.500" px="0" w={{ base: "7%", md: "8%" }} borderBottom="1px" borderColor="gray.400" />
      </Tr>
    </Thead>
  );
});
