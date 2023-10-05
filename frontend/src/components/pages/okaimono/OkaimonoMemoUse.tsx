import { Box, Divider, Flex, Heading, Spinner, useDisclosure, VStack } from "@chakra-ui/react";
import { format } from "date-fns";
import {
  ListFormParams,
  MergeParams,
  // OkaimonoMemoDataShow,
  OkaimonoMemosData,
  // OkaimonoShopModifingData,
  OkaimonoShopsIndexData,
} from "interfaces";
import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ja } from "date-fns/locale";
import { useHistory, useParams } from "react-router-dom";
// import { useUpdateUseMemoData } from "hooks/useUpdateUseMemoData";
import { useUpdateUseSingleListData } from "hooks/useUpdateUseSingleListData";
import { useGetUseMemoListData } from "hooks/useGetUseMemoListData";
import { useGetUseSingleListData } from "hooks/useGetUseSingleListData";
import { useUpdateUseMemoListData } from "hooks/useUpdateUseMemoListData";
import { OkaimonoMemoUseMemo } from "components/molecules/OkaimonoMemoUseMemo";
import { OkaimonoMemoUseList } from "components/molecules/OkaimonoMemoUseList";
import { OkaimonoMemoUseCalculate } from "components/molecules/OkaimonoMemoUseCalculate";
// import { OkaimonoMemoUseMemoModal } from "components/molecules/OkaimonoMemoUseMemoModal";
import { OkaimonoMemoUseListModal } from "components/molecules/OkaimonoMemoUseListModal";
import { useSuggestShopCreate } from "hooks/useSuggestShopCreate";
import { useSuggestListCreate } from "hooks/useSuggestListCreate";
import { useMessage } from "hooks/useToast";

export const OkaimonoMemoUse: VFC = memo(() => {
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listValues, setListValues] = useState<OkaimonoMemosData[]>();
  // const [shoppingDatumValues, setShoppingDatumValues] = useState<OkaimonoMemoDataShow>();
  // const [shopDataValue, setShopDataValues] = useState<OkaimonoShopModifingData>();
  const [deleteIds, setDeleteIds] = useState<string[]>([]);

  const { showMessage } = useMessage();
  // const updateShoppingData = useUpdateUseMemoData();
  const updateListData = useUpdateUseSingleListData();
  const getShoppingMemoList = useGetUseMemoListData();
  const getSingleListData = useGetUseSingleListData();
  const getSuggestionsShopName = useSuggestShopCreate();
  const getSuggestionsPurchaseName = useSuggestListCreate();

  // const { isOpen: isShoppingDatumOpen, onOpen: onShoppingDatumOpen, onClose: closeShoppingDatum } = useDisclosure();
  const { isOpen: isListOpen, onOpen: onListOpen, onClose: closeList } = useDisclosure();

  const defaultShoppingDate = new Date();
  const history = useHistory();
  const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
    locale: ja,
  });
  // const validationNumber = /^[0-9]+$/;

  const { shoppingDatumId } = useParams<{ shoppingDatumId: string }>();

  // ----------------------------------------------------------------------------------------------------------
  // okaimono_memo_useのランディングページ用useForm呼び出し
  const {
    setValue,
    register,
    control,
    watch,
    getValues,
    handleSubmit: allListHandleSubmit,
    formState: { errors },
  } = useForm<MergeParams>({
    defaultValues: {
      shoppingDate: formattedDefaultShoppingDate,
      listForm: [{ price: "", id: "", amount: "", purchaseName: "", asc: "", isBought: false, isFinish: false }],
    },
    criteriaMode: "all",
    mode: "all",
  });

  // ----------------------------------------------------------------------------------------------------------
  // shoppingDatum-編集用のuseForm呼び出し
  // const {
  //   setValue: shoppingDatumSetValue,
  //   register: shoppingDatumRegister,
  //   handleSubmit: shoppiingDatumModifyHandleSubmit,
  //   formState: { errors: shoppingDatumErrors },
  // } = useForm<MergeParams>({
  //   criteriaMode: "all",
  //   mode: "all",
  // });
  // ----------------------------------------------------------------------------------------------------------
  // list-編集用のuseForm呼び出し
  const {
    watch: listWatch,
    setValue: listSetValue,
    register: listRegister,
    handleSubmit: oneListModifyHandleSubmit,
    formState: { errors: listErrors },
  } = useForm<MergeParams>({
    criteriaMode: "all",
    mode: "all",
  });

  const startDate = listWatch(`modifyExpiryDateStart`);
  // ----------------------------------------------------------------------------------------------------------

  // ReactHookFormの機能呼び出し、デフォルト値の設定。
  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: "listForm",
    keyName: "key", // デフォルトではidだが、keyに変更。
  });

  // ----------------------------------------------------------------------------------------------------------
  // 商品数と価格の計算部分
  const shoppingBudgetField = watch("estimatedBudget");
  const watchedPriceFields = fields.map((field, index) => ({
    price: watch(`listForm.${index}.price`),
    amount: watch(`listForm.${index}.amount`),
  }));

  const totalBudget = watchedPriceFields.reduce(
    (acc, { price, amount }) => acc + Number(price || "") * Number(amount || "1"),
    0
  );
  // ----------------------------------------------------------------------------------------------------------
  // shoppingDatumの更新部分。
  // const shoppingDatumSubmit = useCallback(
  //   (formData: MergeParams) => {
  //     const updateProps = {
  //       setReadOnly,
  //       readOnly,
  //       setLoading,
  //       shoppingDatumFormData: formData,
  //       setValue,
  //       setShoppingDatumValues,
  //       setShopDataValues,
  //     };
  //     updateShoppingData(updateProps);
  //   },
  //   [setReadOnly, readOnly, setLoading]
  // );

  // const onCloseShoppingDatum = () => {
  //   setReadOnly(true);
  //   closeShoppingDatum();
  // };
  // ----------------------------------------------------------------------------------------------------------
  // リスト情報の単一修正論理式。(右の下矢印から編集を選び、編集する際に呼び出される論理式。)
  const onOneSubmit = async (oneListFormData: MergeParams) => {
    const listProps = { setReadOnly, readOnly, setLoading, oneListFormData, setValue };
    updateListData(listProps);
    closeList();
  };

  const onCloseList = () => {
    setReadOnly(true);
    closeList();
  };
  // ----------------------------------------------------------------------------------------------------------

  const insertInputForm = (index: number) => {
    insert(index + 1, {
      purchaseName: "",
      price: "",
      shoppingDetailMemo: "",
      amount: "",
      id: "",
      asc: "",
      expiryDateEnd: "",
    });
  };

  const onClickBack = useCallback(() => history.push("/okaimono"), [history]);

  useEffect(() => {
    fields.forEach((field, index) => {
      setValue(`listForm.${index}.asc`, index.toString());
    });
  }, [fields]);

  // ----------------------------------------------------------------------------------------------------------
  // ページ情報の初回読み込み
  useEffect(() => {
    const memoListProps = {
      setLoading,
      fields,
      shoppingDatumId,
      // setShoppingDatumValues,
      setValue,
      // setShopDataValues,
      setListValues,
      append,
    };

    getShoppingMemoList(memoListProps);
  }, []);

  // ----------------------------------------------------------------------------------------------------------
  // shoppingList単一の表示部分。(リスト部分で下矢印を押して編集)
  const onClickListModify = async (index: number, event: React.MouseEvent) => {
    const listDataProps = {
      index,
      event,
      setLoading,
      getValues,
      listValues,
      listSetValue,
      onListOpen,
    };
    getSingleListData(listDataProps);
  };

  // const onClickShoppingDatumModify = (event: React.MouseEvent) => {
  //   event.preventDefault();

  //   if (shoppingDatumValues && shopDataValue) {
  //     shoppingDatumSetValue("modifyShoppingDate", shoppingDatumValues.shoppingDate);
  //     shoppingDatumSetValue("modifyEstimatedBudget", shoppingDatumValues.estimatedBudget);
  //     shoppingDatumSetValue("modifyShoppingMemo", shoppingDatumValues.shoppingMemo);
  //     shoppingDatumSetValue("modyfyShoppingDatumId", shoppingDatumValues.id);
  //     shoppingDatumSetValue("modifyShopName", shopDataValue.shopName);
  //     onShoppingDatumOpen();
  //   }
  // };

  const watchCheckbox = fields.map((field, index) => ({
    checked: watch(`listForm.${index}.isBought`),
  }));

  const checkboxCount = watchCheckbox.filter((c) => c.checked === true).length;
  const calculateCheckbox = fields.length - checkboxCount;
  // ----------------------------------------------------------------------------------------------------------
  // 全体のリスト更新

  const memoListHooksProps = {
    setLoading,
    totalBudget,
  };
  const updateMemoListData = useUpdateUseMemoListData(memoListHooksProps);

  const onAllSubmit = (originFormData: MergeParams) => {
    if (calculateCheckbox === 0) {
      const formData = { ...originFormData, totalBudget };
      const memoListProps = {
        formData,
        deleteIds,
        setLoading,
        setDeleteIds,
        totalBudget,
        fields,
        append,
        setValue,
      };
      updateMemoListData(memoListProps);
    } else {
      showMessage({ title: "買い忘れ商品があります。チェックボックスにチェックを入れてください。", status: "warning" });
    }
  };
  // ----------------------------------------------------------------------------------------------------------
  // 店名入力欄のsuggest機能
  const [shopNameValue, setShopNameValue] = useState("");
  const [shopNameSuggestions, setShopNameSuggestions] = useState<OkaimonoShopsIndexData[]>([]);

  const onShopChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => {
    event.preventDefault();

    setShopNameValue(newValue);
  };

  useEffect(() => {
    const shopNameProps = {
      shopNameValue,
      setShopNameSuggestions,
    };

    getSuggestionsShopName(shopNameProps);
  }, [shopNameValue]);

  // ---------------------------------------------------------------------------
  // 商品名のsuggest機能
  const [purchaseNameValue, setPurchaseNameValue] = useState("");
  const [purchaseNameIndex, setPurchaseNameIndex] = useState<number>();
  const [purchaseNameSuggestions, setPurchaseNameSuggestions] = useState<ListFormParams[]>([]);

  const onListChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: string, index?: number) => {
    event.preventDefault();

    setPurchaseNameValue(newValue);
    setPurchaseNameIndex(index);
  };

  useEffect(() => {
    const purchaseProps = {
      purchaseNameValue,
      setPurchaseNameSuggestions,
    };

    getSuggestionsPurchaseName(purchaseProps);
  }, [purchaseNameValue, purchaseNameIndex]);

  // ---------------------------------------------------------------------------

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <>
      <form onSubmit={allListHandleSubmit(onAllSubmit)}>
        <Flex align="center" justify="center" px={3}>
          <VStack w="100rem">
            <Heading as="h2" size="lg" textAlign="center" pt={3}>
              今日のお買物メモ
            </Heading>
            <Divider my={4} />
            <OkaimonoMemoUseMemo
              readOnly={readOnly}
              register={register}
              errors={errors}
              // onClickShoppingDatumModify={onClickShoppingDatumModify}
              setShopNameSuggestions={setShopNameSuggestions}
              onShopChange={onShopChange}
              shopNameSuggestions={shopNameSuggestions}
              setValue={setValue}
              // validationNumber={validationNumber}
            />
            <OkaimonoMemoUseList
              fields={fields}
              register={register}
              getValues={getValues}
              // validationNumber={validationNumber}
              onClickListModify={onClickListModify}
              setDeleteIds={setDeleteIds}
              remove={remove}
              insertInputForm={insertInputForm}
              errors={errors}
              purchaseNameIndex={purchaseNameIndex}
              setValue={setValue}
              setPurchaseNameSuggestions={setPurchaseNameSuggestions}
              purchaseNameSuggestions={purchaseNameSuggestions}
              onListChange={onListChange}
            />
            <OkaimonoMemoUseCalculate
              totalBudget={totalBudget}
              shoppingBudgetField={shoppingBudgetField}
              calculateCheckbox={calculateCheckbox}
              onClickBack={onClickBack}
            />
            <Box h="15rem" />
          </VStack>
        </Flex>
      </form>

      {/* <form onSubmit={shoppiingDatumModifyHandleSubmit(shoppingDatumSubmit)}>
        <OkaimonoMemoUseMemoModal
          isShoppingDatumOpen={isShoppingDatumOpen}
          closeShoppingDatum={closeShoppingDatum}
          readOnly={readOnly}
          shoppingDatumRegister={shoppingDatumRegister}
          shoppingDatumErrors={shoppingDatumErrors}
          validationNumber={validationNumber}
          onCloseShoppingDatum={onCloseShoppingDatum}
          shoppingDatumSubmit={shoppingDatumSubmit}
          shoppiingDatumModifyHandleSubmit={shoppiingDatumModifyHandleSubmit}
          onShopChange={onShopChange}
          shopNameSuggestions={shopNameSuggestions}
          shoppingDatumSetValue={shoppingDatumSetValue}
          setShopNameSuggestions={setShopNameSuggestions}
        />
      </form> */}

      <form onSubmit={oneListModifyHandleSubmit(onOneSubmit)}>
        <OkaimonoMemoUseListModal
          isListOpen={isListOpen}
          onCloseList={onCloseList}
          // readOnly={readOnly}
          listRegister={listRegister}
          // validationNumber={validationNumber}
          listErrors={listErrors}
          startDate={startDate}
          oneListModifyHandleSubmit={oneListModifyHandleSubmit}
          onOneSubmit={onOneSubmit}
          purchaseNameValue={purchaseNameValue}
          setPurchaseNameSuggestions={setPurchaseNameSuggestions}
          listSetValue={listSetValue}
          purchaseNameSuggestions={purchaseNameSuggestions}
          onListChange={onListChange}
        />
      </form>
    </>
  );
});
