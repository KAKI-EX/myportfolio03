import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { ListFormParams } from "interfaces";
import React, { memo, VFC } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { BiCube } from "react-icons/bi";
import { BsCartCheck } from "react-icons/bs";

type Props = {
  okaimonoRecord: ListFormParams[];
  // eslint-disable-next-line no-unused-vars
  onClickList: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => void;
};

export const OkaimonoSearchResults: VFC<Props> = memo((props) => {
  const { okaimonoRecord, onClickList } = props;

  return (
    <VStack w="100%">
      {okaimonoRecord?.map((record) => (
        <Box
          boxShadow="lg"
          bg="white"
          rounded="xl"
          p={5}
          mt={5}
          w="100%"
          key={record.id}
          onClick={(event) => (record.id ? onClickList(event, record.id) : undefined)}
        >
          <HStack>
            <Text fontSize={{ base: "sm", md: "md" }} mr={2} w="40%">
              <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
              {record.shoppingDate}
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} mr={2} w="20%">
              <Icon as={BiCube} w={5} h={5} mb={-1} mr={1} />
              {record.memosCount}つ
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} mr={2} w="30%">
              <Icon as={AiOutlineMoneyCollect} w={5} h={5} mb={-1} mr={1} />
              {record.totalBudget}円
            </Text>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
});
