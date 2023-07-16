import {
  Box,
  Flex,
  VStack,
  Spinner,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { BottomPagination } from "components/molecules/BottomPagination";
import { OkaimonoSearchBoxes } from "components/molecules/OkaimonoSearchBoxes";
import { OkaimonoSearchResults } from "components/molecules/OkaimonoSearchResults";
import { useGetCustomSearchIndex } from "hooks/useGetCustomSearchIndex";
import { useGetSearchIndex } from "hooks/useGetSearchIndex";
import { useSuggestListCreate } from "hooks/useSuggestListCreate";
import { useSuggestShopCreate } from "hooks/useSuggestShopCreate";
import { ListFormParams, OkaimonoShopsIndexData, UseFormOnSearchPage } from "interfaces";

import React, { memo, useEffect, useState, VFC } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

export const OkaimonoSearch: VFC = memo(() => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState<number>(1);
  const [okaimonoRecord, setOkaimonoRecord] = useState<ListFormParams[]>([]);
  const [totalPages, setTotalPages] = useState<number>();
  const [clickOnSearch, setClickOnSearch] = useState<boolean>(false);

  const history = useHistory();
  const getSuggestionsShopName = useSuggestShopCreate();
  const getSuggestionsPurchaseName = useSuggestListCreate();
  const getOkaimonoRecordIndex = useGetSearchIndex();
  const getCustomSearchIndex = useGetCustomSearchIndex();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<UseFormOnSearchPage>({
    criteriaMode: "all",
    mode: "all",
  });

  const startDate = watch("startDate");

  const onClickList = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    event.preventDefault();
    history.push(`/okaimono/okaimono_show/${id}`);
  };

  // 初回読み込み時のindex取得
  useEffect(() => {
    const indexProps = {
      setLoading,
      setOkaimonoRecord,
      currentPage,
      setTotalPages,
    };
    getOkaimonoRecordIndex(indexProps);
  }, [currentPage]);

  // 検索欄で検索ボタンを押すと実行される関数
  const onSubmit = async (originFormData: UseFormOnSearchPage) => {
    const customSearchProps = {
      setLoading,
      setOkaimonoRecord,
      setTotalPages,
      setCurrentPage,
      originFormData,
      searchCurrentPage,
      setClickOnSearch,
    };
    getCustomSearchIndex(customSearchProps);
  };

  // 検索欄で検索ボタンを押した後、ページネーションの「次へ」を押した時に実行される関数
  useEffect(() => {
    const originFormData = getValues();
    const customSearchProps = {
      setLoading,
      setOkaimonoRecord,
      setTotalPages,
      setCurrentPage,
      originFormData,
      searchCurrentPage,
      setClickOnSearch,
    };
    getCustomSearchIndex(customSearchProps);
  }, [searchCurrentPage]);

  // ----------------------------------------------------------------------------------------------------------
  // 店名入力欄のsuggest機能
  const [searchWordValue, setSearchWordValue] = useState("");
  const [searchWordShopSuggestions, setSearchWordShopSuggestions] = useState<OkaimonoShopsIndexData[]>([]);

  const onShopChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => {
    event.preventDefault();

    setSearchWordValue(newValue);
  };

  useEffect(() => {
    const searchFlag = getValues("searchSelect");
    if (searchFlag === "shopName") {
      const searchWordProps = {
        shopNameValue: searchWordValue,
        setShopNameSuggestions: setSearchWordShopSuggestions,
      };

      getSuggestionsShopName(searchWordProps);
    }
  }, [searchWordValue]);

  // ---------------------------------------------------------------------------
  // 商品名のsuggest機能
  const [searchWordPurchaseSuggestions, setSearchWordPurchaseSuggestions] = useState<ListFormParams[]>([]);

  const onListChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => {
    event.preventDefault();

    setSearchWordValue(newValue);
  };

  useEffect(() => {
    const searchFlag = getValues("searchSelect");
    if (searchFlag === "purchaseName") {
      const purchaseProps = {
        purchaseNameValue: searchWordValue,
        setPurchaseNameSuggestions: setSearchWordPurchaseSuggestions,
      };

      getSuggestionsPurchaseName(purchaseProps);
    }
  }, [searchWordValue]);

  // ---------------------------------------------------------------------------
  // onChangeの競合を避けるための対策①
  const {
    ref,
    onChange: registerOnChange,
    ...rest
  } = register("searchWord", {
    required: { value: true, message: "検索語句が入力されていません" },
  });

  // ---------------------------------------------------------------------------
  // onChangeの競合を避けるための対策②
  const customOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchFlag = getValues("searchSelect");
    // React Hook Form の onChange ハンドラを実行
    if (registerOnChange) {
      registerOnChange(event);
    }

    // 入力が空の場合、候補リストをクリアする
    if ((setSearchWordShopSuggestions || setSearchWordPurchaseSuggestions) && event.target.value === "") {
      setSearchWordShopSuggestions([]);
      setSearchWordPurchaseSuggestions([]);
    }

    // shopNameのsuggestへ分岐
    if (searchFlag === "shopName" && onShopChange) {
      onShopChange(event, event.target.value);
    }

    if (searchFlag === "purchaseName" && onListChange) {
      onListChange(event, event.target.value);
    }
  };

  // ---------------------------------------------------------------------------
  // suggestionをクリックしたときの動作
  const onClickSuggests = (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>, value: string) => {
    event.preventDefault();
    if (setValue && (setSearchWordShopSuggestions || setSearchWordPurchaseSuggestions) && value) {
      setValue("searchWord", value);
      setSearchWordShopSuggestions([]);
      setSearchWordPurchaseSuggestions([]);
    }
  };

  useEffect(() => {}, [searchWordShopSuggestions, searchWordPurchaseSuggestions]);

  const isOkaimonoShopsIndexData = (
    value: OkaimonoShopsIndexData | ListFormParams
  ): value is OkaimonoShopsIndexData => {
    return (value as OkaimonoShopsIndexData).shopName !== undefined;
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
          <OkaimonoSearchBoxes
            register={register}
            errors={errors}
            customOnChange={customOnChange}
            rest={rest}
            searchWordShopSuggestions={searchWordShopSuggestions}
            searchWordPurchaseSuggestions={searchWordPurchaseSuggestions}
            onClickSuggests={onClickSuggests}
            isOkaimonoShopsIndexData={isOkaimonoShopsIndexData}
            startDate={startDate}
            isValid={isValid}
          />
        </form>
        <OkaimonoSearchResults okaimonoRecord={okaimonoRecord} onClickList={onClickList} />
        <BottomPagination
          currentPage={currentPage}
          searchCurrentPage={searchCurrentPage}
          setLoading={setLoading}
          clickOnSearch={clickOnSearch}
          setSearchCurrentPage={setSearchCurrentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </VStack>
    </Flex>
  );
});
