import {
  Box,
  Flex,
  VStack,
  Spinner,
  Heading,
  Text,
  Divider,
  Input,
  Select,
  HStack,
  Icon,
  Button,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { useMessage } from "hooks/useToast";
import { ListFormParams } from "interfaces";
import { shoppingDataIndexRecord, shoppingDataIndexRecordByPurchase, shoppingDataIndexRecordByShop } from "lib/api";

import React, { memo, useEffect, useState, VFC } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { BiCube } from "react-icons/bi";
import { BsCartCheck } from "react-icons/bs";
import { useHistory } from "react-router-dom";

export const OkaimonoSearch: VFC = memo(() => {
  const { showMessage } = useMessage();

  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
  const [okaimonoRecord, setOkaimonoRecord] = useState<ListFormParams[]>([]);
  const [totalPages, setTotalPages] = useState<number>();
  const [clickOnSearch, setClickOnSearch] = useState<boolean>(false);

  const history = useHistory();

  // const defaultShoppingDate = new Date();
  // const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
  //   locale: ja,
  // });

  type UseForm = {
    startDate: Date;
    endDate: Date;
    shoppingDate: string;
    searchSelect: string;
    searchWord: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<UseForm>({
    criteriaMode: "all",
    mode: "all",
  });

  useEffect(() => {
    setLoading(true);
    const getOkaimonoRecordIndex = async () => {
      try {
        const OkaimonoRecordIndexRes = await shoppingDataIndexRecord(currentPage);
        if (OkaimonoRecordIndexRes?.status === 200 && OkaimonoRecordIndexRes) {
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

  const onSubmit = async (originFormData: UseForm) => {
    setCurrentPage(1);
    const formData = { ...originFormData, searchCurrentPage };
    if (formData.searchSelect === "shopName") {
      try {
        setClickOnSearch(true);
        const shoppingSearchByShopRes = await shoppingDataIndexRecordByShop(formData);
        if (shoppingSearchByShopRes?.status === 200 && shoppingSearchByShopRes) {
          setOkaimonoRecord(shoppingSearchByShopRes.data.records);
          setTotalPages(shoppingSearchByShopRes.data.totalPages);
          setLoading(false);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        showMessage({ title: axiosError.response?.data.error, status: "error" });
        setLoading(false);
      }
    } else if (formData.searchSelect === "purchaseName") {
      try {
        setClickOnSearch(true);
        const shoppingSearchByPurchaseRes = await shoppingDataIndexRecordByPurchase(formData);
        if (shoppingSearchByPurchaseRes?.status === 200 && shoppingSearchByPurchaseRes) {
          setOkaimonoRecord(shoppingSearchByPurchaseRes.data.records);
          setTotalPages(shoppingSearchByPurchaseRes.data.totalPages);
          setLoading(false);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        showMessage({ title: axiosError.response?.data.error, status: "error" });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const onClickPagination = async (originFormData: UseForm) => {
      setCurrentPage(1);
      const formData = { ...originFormData, searchCurrentPage };
      if (formData.searchSelect === "shopName") {
        try {
          setClickOnSearch(true);
          const shoppingSearchByShopRes = await shoppingDataIndexRecordByShop(formData);
          if (shoppingSearchByShopRes?.status === 200 && shoppingSearchByShopRes) {
            setOkaimonoRecord(shoppingSearchByShopRes.data.records);
            setTotalPages(shoppingSearchByShopRes.data.totalPages);
            setLoading(false);
          }
        } catch (err) {
          const axiosError = err as AxiosError;
          // eslint-disable-next-line no-console
          console.error(axiosError.response);
          showMessage({ title: axiosError.response?.data.error, status: "error" });
          setLoading(false);
        }
      } else if (formData.searchSelect === "purchaseName") {
        try {
          setClickOnSearch(true);
          const shoppingSearchByPurchaseRes = await shoppingDataIndexRecordByPurchase(formData);
          if (shoppingSearchByPurchaseRes?.status === 200 && shoppingSearchByPurchaseRes) {
            setOkaimonoRecord(shoppingSearchByPurchaseRes.data.records);
            setTotalPages(shoppingSearchByPurchaseRes.data.totalPages);
            setLoading(false);
          }
        } catch (err) {
          const axiosError = err as AxiosError;
          // eslint-disable-next-line no-console
          console.error(axiosError.response);
          showMessage({ title: axiosError.response?.data.error, status: "error" });
          setLoading(false);
        }
      }
    };
    const props = getValues();
    onClickPagination(props);
  }, [searchCurrentPage]);

  const onClickList = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    event.preventDefault();
    history.push(`/okaimono/okaimono_show/${id}`);
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
        <Box>
          {!(currentPage === 1 && searchCurrentPage === 1) && (
            <Button
              onClick={() => {
                setLoading(true);
                if (clickOnSearch === true) {
                  setSearchCurrentPage((prev) => Math.max(prev - 1, 1));
                } else {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                }
              }}
            >
              前のページ
            </Button>
          )}

          {!(currentPage === totalPages || searchCurrentPage === totalPages) && (
            <Button
              onClick={() => {
                setLoading(true);
                if (clickOnSearch === true) {
                  setSearchCurrentPage((prev) => prev + 1);
                } else {
                  setCurrentPage((prev) => prev + 1);
                }
              }}
            >
              次のページ
            </Button>
          )}
        </Box>
      </VStack>
    </Flex>
  );
});
