import { Th, Thead, Tr } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { TableThreadTitle } from "components/atoms/ThreadTitle";

type Props = {
  isFinished?: boolean | null | undefined;
};

export const TableThread: VFC<Props> = memo((props: Props) => {
  const { isFinished = true } = props;
  return (
    <Thead>
      <Tr>
        {isFinished === false ? (
          <TableThreadTitle
            p={0}
            color="white"
            bg="teal.500"
            w={{ base: "20%", md: "10%" }}
            borderBottom="1px"
            borderColor="gray.400"
            textAlign="center"
            fontSize={{ base: "sm", md: "md" }}
          >
            {null}
          </TableThreadTitle>
        ) : null}
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
        {isFinished === false ? null : (
          <TableThreadTitle
            p={0}
            color="white"
            bg="teal.500"
            w={{ base: "20%", md: "10%" }}
            borderBottom="1px"
            borderColor="gray.400"
            textAlign="center"
            fontSize={{ base: "sm", md: "md" }}
          >
            リスト数
          </TableThreadTitle>
        )}
        <TableThreadTitle
          color="white"
          bg="teal.500"
          w={{ base: "", md: "15%" }}
          borderBottom="1px"
          borderColor="gray.400"
          textAlign="center"
          fontSize={{ base: "sm", md: "md" }}
          display={{ base: "none", md: "table-cell" }}
        >
          {isFinished !== true ? "ゆるい予算" : "合計金額"}
        </TableThreadTitle>
        <TableThreadTitle
          color="white"
          bg="teal.500"
          px="17px"
          w={{ base: "45%", md: "45%" }}
          borderBottom="1px"
          borderColor="gray.400"
          textAlign="center"
          fontSize={{ base: "sm", md: "md" }}
        >
          一言メモ
        </TableThreadTitle>
        <Th bg="teal.500" px="0" w={{ base: "11%", md: "8%" }} borderBottom="1px" borderColor="gray.400" />
      </Tr>
    </Thead>
  );
});
