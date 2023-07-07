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
  Button,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { PrimaryButton } from "components/atoms/PrimaryButton";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useMessage } from "hooks/useToast";
import { ListFormParams, MergeParams } from "interfaces";
import { shoppingDataIndexRecord } from "lib/api";

import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { BiCube } from "react-icons/bi";
import { BsCartCheck } from "react-icons/bs";

export const OkaimonoSearch: VFC = memo(() => {
  const { showMessage } = useMessage();

  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [okaimonoRecord, setOkaimonoRecord] = useState<ListFormParams[]>();
  const [totalPages, setTotalPages] = useState<number>();
  const defaultShoppingDate = new Date();
  const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
    locale: ja,
  });

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

  useEffect(() => {
    setLoading(true);
    const getOkaimonoRecordIndex = async () => {
      try {
        const OkaimonoRecordIndexRes = await shoppingDataIndexRecord(currentPage);
        if (OkaimonoRecordIndexRes?.status === 200 && OkaimonoRecordIndexRes) {
          console.log("OkaimonoRecordIndexRes", OkaimonoRecordIndexRes);
          setOkaimonoRecord(OkaimonoRecordIndexRes.data.records);
          setTotalPages(OkaimonoRecordIndexRes.data.totalPages);
          setLoading(false);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        showMessage({ title: axiosError.response?.data.error, status: "error" });
        setLoading(false);
      }
    };
    getOkaimonoRecordIndex();
  }, [currentPage]);

  const startDate = watch("startDate");

  const onSubmit = (formData: UseForm) => {
    if (formData.searchSelect === "shopName") {
      console.log("shopName");
    } else if (formData.searchSelect === "purchaseName") {
      console.log("purchaseName");
    }
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
                <option value="shopName">お店名</option>
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
          {okaimonoRecord?.map((record, index) => (
            <Box boxShadow="lg" bg="white" rounded="xl" p={5} mt={5} w="100%" key={record.id}>
              <HStack>
                <Text fontSize={{ base: "sm", md: "md" }} mr={2} w="40%">
                  <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
                  {record.shoppingDate}
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} mr={2} w="20%">
                  <Icon as={BiCube} w={5} h={5} mb={-1} mr={1} />
                  {record.memosCount}
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} mr={2} w="30%">
                  <Icon as={AiOutlineMoneyCollect} w={5} h={5} mb={-1} mr={1} />
                  {record.totalBudget}
                </Text>
              </HStack>
            </Box>
          ))}
        </VStack>
        <Box>
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>前のページ</Button>
          <Button onClick={() => setCurrentPage((prev) => prev + 1)}>次のページ</Button>
        </Box>
      </VStack>
    </Flex>
  );
});
