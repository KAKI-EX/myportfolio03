import { SmallCloseIcon } from "@chakra-ui/icons";
import { Box, Flex, VStack, Spinner, Heading, HStack, Icon, Text, Checkbox } from "@chakra-ui/react";

import { memo, useState, VFC } from "react";
import { TbAlertTriangle } from "react-icons/tb";
import { BsCartCheck } from "react-icons/bs";

export const OkaimonoAlert: VFC = memo(() => {
  const [loading, setLoading] = useState<boolean>(false);

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <Flex align="center" justify="center" px={2}>
      <Box w={{ base: "100%", md: "50%" }}>
        <Heading as="h1" size="lg" textAlign="center" my={5}>
          お買い物アラート
        </Heading>
        <VStack>
          <HStack w="100%" bg="white" py={4} px={2} rounded={10} boxShadow="md">
            <Checkbox size="lg" colorScheme="green" ml={1} />
            <Text w="21%" color="red.500">
              <Icon as={TbAlertTriangle} w={6} h={6} mb={-2} />
              +3日
            </Text>
            <Text w="39%" fontSize={{ base: "sm", md: "md" }}>
              豚ひき肉300G
            </Text>
            <Text>
              <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
              10月9日
            </Text>
          </HStack>
          <HStack w="100%" bg="white" py={4} px={2} rounded={10} boxShadow="md">
            <Checkbox size="lg" colorScheme="green" ml={1} />
            <Text w="21%" color="red.500">
              <Icon as={TbAlertTriangle} w={6} h={6} mb={-2} />
              +2日
            </Text>
            <Text w="39%" fontSize={{ base: "sm", md: "md" }}>
              豚ひき肉300G
            </Text>
            <Text>
              <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
              10月10日
            </Text>
          </HStack>
          <HStack w="100%" bg="white" py={4} px={2} rounded={10} boxShadow="md">
            <Checkbox size="lg" colorScheme="green" ml={1} />
            <Text w="21%" color="red.500">
              <Icon as={TbAlertTriangle} w={6} h={6} mb={-2} />
              +1日
            </Text>
            <Text w="39%" fontSize={{ base: "sm", md: "md" }}>
              豚ひき肉300G
            </Text>
            <Text>
              <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
              10月11日
            </Text>
          </HStack>
          <HStack w="100%" bg="white" py={4} px={2} rounded={10} boxShadow="md">
            <Checkbox size="lg" colorScheme="green" ml={1} />
            <Text w="21%" color="yellow.500">
              +0日
            </Text>
            <Text w="39%" fontSize={{ base: "sm", md: "md" }}>
              豚ひき肉300G
            </Text>
            <Text>
              <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
              10月12日
            </Text>
          </HStack>
          <HStack w="100%" bg="white" py={4} px={2} rounded={10} boxShadow="md">
            <Checkbox size="lg" colorScheme="green" ml={1} />
            <Text w="21%" color="yellow.500">
              -1日
            </Text>
            <Text w="39%" fontSize={{ base: "sm", md: "md" }}>
              豚ひき肉300G
            </Text>
            <Text>
              <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
              10月13日
            </Text>
          </HStack>
          <HStack w="100%" bg="white" py={4} px={2} rounded={10} boxShadow="md">
            <Checkbox size="lg" colorScheme="green" ml={1} />
            <Text w="21%" color="yellow.500">
              -2日
            </Text>
            <Text w="39%" fontSize={{ base: "sm", md: "md" }}>
              豚ひき肉300G
            </Text>
            <Text>
              <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
              10月14日
            </Text>
          </HStack>
          <HStack w="100%" bg="white" py={4} px={2} rounded={10} boxShadow="md">
            <Checkbox size="lg" colorScheme="green" ml={1} />
            <Text w="21%" color="teal.500">
              -3日
            </Text>
            <Text w="39%" fontSize={{ base: "sm", md: "md" }}>
              豚ひき肉300G
            </Text>
            <Text>
              <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
              10月15日
            </Text>
          </HStack>
          <HStack w="100%" bg="white" py={4} px={2} rounded={10} boxShadow="md">
            <Checkbox size="lg" colorScheme="green" ml={1} />
            <Text w="21%" color="teal.500">
              -4日
            </Text>
            <Text w="39%" fontSize={{ base: "sm", md: "md" }}>
              豚ひき肉300G
            </Text>
            <Text>
              <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
              10月16日
            </Text>
          </HStack>
          <HStack w="100%" bg="white" py={4} px={2} rounded={10} boxShadow="md">
            <Checkbox size="lg" colorScheme="green" ml={1} />
            <Text w="21%" color="teal.500">
              -5日
            </Text>
            <Text w="39%" fontSize={{ base: "sm", md: "md" }}>
              豚ひき肉300G
            </Text>
            <Text>
              <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
              10月17日
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  );
});
