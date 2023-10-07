import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  VStack,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import { ListFormParams, MergeParams } from "interfaces";
import React, { memo, useCallback, useContext, useEffect, useState, VFC } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useMessage } from "hooks/useToast";
import { useMemoCreate } from "hooks/useMemoCreate";
import { OkaimonoOverview } from "components/molecules/OkaimonoOverview";
import { OkaimonoDetail } from "components/organisms/OkaimonoDetail";
import { AuthContext } from "App";
import { useHistory } from "react-router-dom";
import { OkaimonoShopsIndexData } from "interfaces/index";
import { useSuggestListCreate } from "hooks/useSuggestListCreate";
import { useSuggestShopCreate } from "hooks/useSuggestShopCreate";
import { OkaimonoButtonAndCalculater } from "components/molecules/OkaimonoButtonAndCalculater";
// import { OkaimonoConfirmExpiryDateModal } from "components/molecules/OkaimonoConfirmExpiryDateModal";

export const OkaimonoMemo: VFC = memo(() => {
  const { showMessage } = useMessage();
  const getSuggestionsPurchaseName = useSuggestListCreate();
  const getSuggestionsShopName = useSuggestShopCreate();

  const defaultShoppingDate = new Date();
  const { setLoading, loading } = useContext(AuthContext);
  // const [expiryDate, setExpiryDate] = useState<boolean>(false);
  // const { isOpen, onClose, onOpen } = useDisclosure();
  const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
    locale: ja,
  });
  const validationNumber = /^[0-9]+$/;
  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<MergeParams>({
    defaultValues: {
      shoppingDate: formattedDefaultShoppingDate,
      listForm: [
        {
          purchaseName: "",
          price: "",
          shoppingDetailMemo: "",
          amount: "",
          expiryDateStart: "",
          expiryDateEnd: "",
          id: "",
          asc: "",
        },
      ],
    },
    criteriaMode: "all",
    mode: "all",
  });

  const { fields, insert, remove } = useFieldArray({
    control,
    name: "listForm",
    keyName: "key", // デフォルトではidだが、keyに変更。
  });

  const shoppingBudgetField = watch("estimatedBudget");
  const watchedPriceFields = fields.map((field, index) => ({
    price: watch(`listForm.${index}.price`),
    amount: watch(`listForm.${index}.amount`),
  }));

  const totalBudget = watchedPriceFields.reduce(
    (acc, { price, amount }) => acc + Number(price || "") * Number(amount || "1"),
    0
  );

  const insertInputForm = (index: number) => {
    insert(index + 1, {
      purchaseName: "",
      price: "",
      shoppingDetailMemo: "",
      amount: "",
      expiryDateStart: "",
      expiryDateEnd: "",
      id: "",
      asc: "",
    });
  };

  useEffect(() => {
    if (fields.length === 20) {
      showMessage({ title: "メモは最大20件までの追加が可能です。", status: "warning" });
    }
  }, [fields.length]);
  // ---------------------------------------------------------------------------
  // ここでフォームデータの送信処理を行っている。詳細はuseMemoCreateを参照。
  const props = { setLoading, totalBudget };
  const sendDataToAPI = useMemoCreate(props);

  const onSubmit = (formData: MergeParams) => {
    const addFromData = { ...formData, isFinish: false };
    sendDataToAPI(addFromData);
  };

  const onClickTemporarilySaved = () => {
    const formData = getValues();
    sendDataToAPI(formData);
  };
  // ---------------------------------------------------------------------------
  const history = useHistory();
  const onClickBack = useCallback(() => history.push("/okaimono"), [history]);

  // const onClickInputNow = useCallback(() => {
  //   setExpiryDate(true);
  //   onClose();
  // }, []);

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

  // useEffect(() => onOpen(), []);

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex align="center" justify="center" px={3}>
        <VStack w="100rem">
          <Heading as="h2" size="lg" textAlign="center" pt={3}>
            お買い物メモの作成
          </Heading>
          <Divider my={4} />
          <Heading as="h3" size="sm" textAlign="center" pt={1} pb={3}>
            お買い物情報
          </Heading>
          <OkaimonoOverview
            register={register}
            validationNumber={validationNumber}
            errors={errors}
            onShopChange={onShopChange}
            shopNameSuggestions={shopNameSuggestions}
            setValue={setValue}
            setShopNameSuggestions={setShopNameSuggestions}
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
            watch={watch}
            // expiryDate={expiryDate}
            onListChange={onListChange}
            getValues={getValues}
            purchaseNameSuggestions={purchaseNameSuggestions}
            setValue={setValue}
            setPurchaseNameSuggestions={setPurchaseNameSuggestions}
            purchaseNameIndex={purchaseNameIndex}
          />
          <OkaimonoButtonAndCalculater
            totalBudget={totalBudget}
            shoppingBudgetField={shoppingBudgetField}
            isValid={isValid}
            onClickTemporarilySaved={onClickTemporarilySaved}
            onClickBack={onClickBack}
          />
          <Box h="15rem" />
        </VStack>
      </Flex>
      {/* <OkaimonoConfirmExpiryDateModal isOpen={isOpen} onClose={onClose} onClickInputNow={onClickInputNow} /> */}
    </form>
  );
});
