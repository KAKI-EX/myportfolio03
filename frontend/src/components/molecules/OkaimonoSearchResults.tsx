import { Box, HStack, Icon, Text, useMediaQuery, VStack } from "@chakra-ui/react";
import { ListFormParams } from "interfaces";
import React, { memo, VFC } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { BiCube } from "react-icons/bi";
import { BsCartCheck } from "react-icons/bs";
import { CiMemoPad } from "react-icons/ci";

type Props = {
  okaimonoRecord: ListFormParams[];
  // eslint-disable-next-line no-unused-vars
  onClickList: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => void;
};

export const OkaimonoSearchResults: VFC<Props> = memo((props) => {
  const { okaimonoRecord, onClickList } = props;
  const [isLargerThan767] = useMediaQuery("(min-width: 767px)");
  return (
    <VStack w="100%">
      {okaimonoRecord?.map((record) => (
        <Box
          boxShadow="lg"
          bg="white"
          rounded="xl"
          p={5}
          mt={5}
          w={{ base: "95%", md: "70%", xl: "60%" }}
          key={record.id}
          onClick={(event) => (record.id ? onClickList(event, record.id) : undefined)}
        >
          <HStack _hover={{ fontWeight: "bold", cursor: "pointer" }}>
            <Text fontSize={{ base: "sm", md: "md" }} mr={2} w={{ base: "40%", md: "20%" }}>
              <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
              {record.shoppingDate}
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} mr={2} w={{ base: "20%", md: "10%" }}>
              <Icon as={BiCube} w={5} h={5} mb={-1} mr={1} />
              {record.memosCount}つ
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} mr={2} w={{ base: "30%", md: "20%" }}>
              <Icon as={AiOutlineMoneyCollect} w={5} h={5} mb={-1} mr={1} />
              {record.totalBudget}円
            </Text>
            {isLargerThan767 ? (
              <Text fontSize={{ base: "sm", md: "md" }} mr={2} w="50%">
                <Icon as={CiMemoPad} w={5} h={5} mb={-1} mr={1} />
                {record.shoppingMemo}円
              </Text>
            ) : null}
          </HStack>
        </Box>
      ))}
    </VStack>
  );
});
