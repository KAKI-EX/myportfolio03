import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  VStack,
  Spinner,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { ListFormParams, MergeParams, OkaimonoShopsIndexData } from "interfaces";
import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useMessage } from "hooks/useToast";
import { OkaimonoOverview } from "components/molecules/OkaimonoOverview";
import { OkaimonoDetail } from "components/organisms/OkaimonoDetail";
import { useHistory, useParams } from "react-router-dom";
import { useSetOkaimonoShowIndex } from "hooks/useSetOkaimonoShowIndex";
import { useShowUpdateList } from "hooks/useShowUpdateList";
import { useSuggestListCreate } from "hooks/useSuggestListCreate";
import { useSuggestShopCreate } from "hooks/useSuggestShopCreate";
import { OkaimonoButtonAndCalculater } from "components/molecules/OkaimonoButtonAndCalculater";
import { OkaimonoConfirmExpiryDateModal } from "components/molecules/OkaimonoConfirmExpiryDateModal";

export const OkaimonoShow: VFC = memo(() => {
  const getSuggestionsPurchaseName = useSuggestListCreate();
  const getSuggestionsShopName = useSuggestShopCreate();
  const { showMessage } = useMessage();

  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>();
  const defaultShoppingDate = new Date();
  const [loading, setLoading] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<boolean>(false);
  const [pushTemporarilyButton, setPushTemporarilyButton] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
    locale: ja,
  });
  const validationNumber = /^[0-9]+$/;
  // ----------------------------------------------------------------------------------------------------------
  const { id } = useParams<{ id?: string }>();
  const [readOnly, setReadOnly] = useState(true);
  const history = useHistory();
  const onClickBack = useCallback(() => history.push("/okaimono"), [history]);
  // ----------------------------------------------------------------------------------------------------------
  // ReactHookFormの機能呼び出し、デフォルト値の設定。
  const {
    setValue,
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<MergeParams>({
    defaultValues: {
      shoppingDate: formattedDefaultShoppingDate,
      listForm: [{ purchaseName: "", price: "", shoppingDetailMemo: "", amount: "", id: "", asc: "" }],
    },
    criteriaMode: "all",
    mode: "all",
  });

  // ----------------------------------------------------------------------------------------------------------
  // ReactHookFormの機能呼び出し、デフォルト値の設定。
  const { fields, append, insert, remove } = useFieldArray({
    control,
    name: "listForm",
    keyName: "key", // デフォルトではidだが、keyに変更。
  });

  // ----------------------------------------------------------------------------------------------------------
  // メモのindexを取得
  const showMemo = useSetOkaimonoShowIndex({ setLoading, id, setValue, fields, append, setExpiryDate, setIsFinished });
  useEffect(() => {
    showMemo();
  }, [expiryDate]);

  useEffect(() => {
    fields.forEach((field, index) => {
      setValue(`listForm.${index}.asc`, index.toString());
    });
  }, [fields]);

  // ----------------------------------------------------------------------------------------------------------
  // 予算計算
  const shoppingBudgetField = watch("estimatedBudget");
  const watchedPriceFields = fields.map((field, index) => ({
    price: watch(`listForm.${index}.price`),
    amount: watch(`listForm.${index}.amount`),
  }));

  // ----------------------------------------------------------------------------------------------------------
  // 予算計算
  const totalBudget = watchedPriceFields.reduce(
    (acc, { price, amount }) => acc + Number(price || "") * Number(amount || "1"),
    0
  );

  // ----------------------------------------------------------------------------------------------------------
  // フォーム追加機能
  const insertInputForm = (index: number) => {
    insert(index + 1, {
      purchaseName: "",
      price: "",
      shoppingDetailMemo: "",
      amount: "",
      id: "",
      asc: "",
      expiryDateStart: formattedDefaultShoppingDate,
      expiryDateEnd: "",
    });
  };

  useEffect(() => {
    if (fields.length === 20) {
      showMessage({ title: "メモは最大20件までの追加が可能です。", status: "warning" });
    }
  }, [fields.length]);

  // ---------------------------------------------------------------------------
  // updateを行なうと、編集画面で追加した新規メモがあるとエラーを起こすため、新規メモを検知したのち、Createアクションへ該当メモを送信。
  // Createアクション送信分はsendUpdateToAPIの中で削除している。その後にupdateアクションを行っているため、戻り値の中にCreateアクションの
  // データがない。そのため、sendUpdataToAPIの戻り値の配列0番目のshoppingDatumIdを元にShowアクションを実行してsetValueしている。
  // 戻り値をsetValueせずに反映しない方法(リロードすると消える)もあるが、その状態でupdateアクションを再度送ると、仕様上、新規作成アクションで
  // 作成したはずのメモが再度作成されてしまう。(新規メモか否かの判断をlistIdの有無で検知しているため)
  const props = { setLoading, totalBudget, readOnly };

  const updateList = useShowUpdateList(props);
  const onSubmit = (formData: MergeParams) => {
    const updateProps = {
      setReadOnly,
      expiryDate,
      onOpen,
      formData,
      pushTemporarilyButton,
      deleteIds,
      setDeleteIds,
      append,
      fields,
      setValue,
      setPushTemporarilyButton,
      isFinished,
    };
    updateList(updateProps);
  };

  const onClickTemporarilySaved = () => {
    setPushTemporarilyButton(true);
  };

  useEffect(() => {
    if (pushTemporarilyButton) {
      const formData = getValues();
      onSubmit(formData);
    }
  }, [pushTemporarilyButton]);

  const onClickInputNow = useCallback(() => {
    setExpiryDate(true);
    onClose();
  }, []);
  // ---------------------------------------------------------------------------
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

  const onListChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, newValue: string) => {
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

  useEffect(() => {
    if (isFinished !== undefined && !isFinished && !readOnly) {
      onOpen();
    }
  }, [isFinished]);

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex align="center" justify="center" px={3}>
        <VStack w="100rem">
          <Heading as="h2" size="lg" textAlign="center" pt={3}>
            {readOnly ? "お買い物メモの確認" : "お買い物メモの編集"}
          </Heading>
          <Divider my={4} />
          <Heading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
            お買い物情報
          </Heading>
          <OkaimonoOverview
            register={register}
            validationNumber={validationNumber}
            errors={errors}
            readOnly={readOnly}
            onShopChange={onShopChange}
            shopNameSuggestions={shopNameSuggestions}
            setValue={setValue}
            setShopNameSuggestions={setShopNameSuggestions}
            isFinished={isFinished}
          />
          <Divider my={4} />
          <OkaimonoDetail
            fields={fields}
            insertInputForm={insertInputForm}
            SmallCloseIcon={SmallCloseIcon}
            remove={remove}
            register={register}
            errors={errors}
            validationNumber={validationNumber}
            readOnly={readOnly}
            getValues={getValues}
            deleteIds={deleteIds}
            setDeleteIds={setDeleteIds}
            watch={watch}
            expiryDate={expiryDate}
            onListChange={onListChange}
            purchaseNameSuggestions={purchaseNameSuggestions}
            setValue={setValue}
            setPurchaseNameSuggestions={setPurchaseNameSuggestions}
            purchaseNameIndex={purchaseNameIndex}
          />
          <OkaimonoButtonAndCalculater
            totalBudget={totalBudget}
            shoppingBudgetField={shoppingBudgetField}
            isValid={isValid}
            readOnly={readOnly}
            isFinished={isFinished}
            onClickTemporarilySaved={onClickTemporarilySaved}
            onClickBack={onClickBack}
          />
          <Box h="12.5rem" />
        </VStack>
        <OkaimonoConfirmExpiryDateModal isOpen={isOpen} onClose={onClose} onClickInputNow={onClickInputNow} />
      </Flex>
    </form>
  );
});
