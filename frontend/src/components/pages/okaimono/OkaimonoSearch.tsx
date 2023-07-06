import {
  Box,
  Flex,
  VStack,
  Spinner,
  Heading,
  useDisclosure,
  Text,
  Divider,
  Input,
  Select,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { PrimaryButton } from "components/atoms/PrimaryButton";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { MergeParams } from "interfaces";

import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { BiCube } from "react-icons/bi";
import { BsCartCheck } from "react-icons/bs";

export const OkaimonoSearch: VFC = memo(() => {
  const [loading, setLoading] = useState<boolean>(false);
  const defaultShoppingDate = new Date();
  const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
    locale: ja,
  });

  const test = () => {
    console.log("test");
  };

  type UseForm = {
    startDate: string;
    endDate: string;
    shoppingDate: string;
    searchSelect: string;
    searchWord: string;
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<UseForm>({
    defaultValues: {
      shoppingDate: formattedDefaultShoppingDate,
    },
    criteriaMode: "all",
    mode: "all",
  });

  const startDate = watch("startDate");

  const onSubmit = (formData: UseForm) => {
    console.log("formData", formData);
  };

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <Flex align="center" justify="center" px={3}>
      <VStack w="95rem">
        <Heading as="h2" size="lg" textAlign="center" pt={3}>
          お買い物サーチ
        </Heading>
        <Divider my={4} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box boxShadow="lg" bg="white" rounded="xl" p={6}>
            <HStack>
              <Select
                placeholder="検索"
                size="md"
                w="40%"
                fontSize={{ base: "sm", md: "md" }}
                {...register("searchSelect", {
                  required: { value: true, message: "検索タイプが入力されていません" },
                })}
              >
                <option value="shopName">店名前</option>
                <option value="purchaseName">商品名</option>
              </Select>
              <Input
                placeholder="検索語句"
                size="md"
                fontSize={{ base: "sm", md: "md" }}
                {...register("searchWord", {
                  required: { value: true, message: "検索語句が入力されていません" },
                })}
              />
            </HStack>
            {errors.searchWord && (
              <Box color="red" fontSize="sm">
                <Text>{errors.searchSelect?.types?.required}</Text>
                <Text>{errors.searchWord?.types?.required}</Text>
              </Box>
            )}
            <Heading as="h3" size="sm" textAlign="center" pt={5} pb={3}>
              更にお買い物日で絞り込む
            </Heading>
            <HStack>
              <Input type="date" size="md" fontSize={{ base: "sm", md: "md" }} {...register("startDate")} />
              <Text>〜</Text>
              <Input
                type="date"
                size="md"
                fontSize={{ base: "sm", md: "md" }}
                {...register("endDate", {
                  validate: (value) =>
                    !startDate ||
                    !value ||
                    new Date(value) >= new Date(startDate) ||
                    "終了日は開始日以降の日付を選択してください。",
                })}
              />
            </HStack>
            {errors.endDate && (
              <Box color="red" fontSize="sm">
                {errors.endDate.message}
              </Box>
            )}
            <Box display="flex" justifyContent="center" mt={4}>
              <PrimaryButtonForReactHookForm w="100%" disabled={!isValid}>
                検索
              </PrimaryButtonForReactHookForm>
            </Box>
          </Box>
        </form>
        <VStack w="100%">
          <Box boxShadow="lg" bg="white" rounded="xl" p={5} mt={5} w="100%">
            <HStack>
              <Text fontSize={{ base: "sm", md: "md" }} mr={2} w="40%">
                <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
                2023年10月10日
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} mr={2} w="20%">
                <Icon as={BiCube} w={5} h={5} mb={-1} mr={1} />
                12個
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} mr={2} w="30%">
                <Icon as={AiOutlineMoneyCollect} w={5} h={5} mb={-1} mr={1} />
                75785円
              </Text>
            </HStack>
          </Box>
        </VStack>
      </VStack>
    </Flex>
  );
});
