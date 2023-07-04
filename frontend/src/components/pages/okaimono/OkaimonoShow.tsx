import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  Stack,
  VStack,
  Spinner,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteButton } from "components/atoms/DeleteButton";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { ListFormParams, MergeParams, OkaimonoShopsIndexData } from "interfaces";
import React, { memo, useCallback, useEffect, useState, VFC, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useMessage } from "hooks/useToast";
import { OkaimonoOverview } from "components/molecules/OkaimonoOverview";
import { OkaimonoDetail } from "components/molecules/OkaimonoDetail";
import { useHistory, useParams } from "react-router-dom";
import { useSetOkaimonoShowIndex } from "hooks/useSetOkaimonoShowIndex";
import { OptionallyButton } from "components/atoms/OptionallyButton";
import { useShowUpdateList } from "hooks/useShowUpdateList";
import { useSuggestListCreate } from "hooks/useSuggestListCreate";
import { useSuggestShopCreate } from "hooks/useSuggestShopCreate";

export const OkaimonoShow: VFC = memo(() => {
  const getSuggestionsPurchaseName = useSuggestListCreate();
  const getSuggestionsShopName = useSuggestShopCreate();
  const { showMessage } = useMessage();

  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const defaultShoppingDate = new Date();
  const [loading, setLoading] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<boolean>(false);
  const [pushTemporarilyButton, setPushTemporarilyButton] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
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
  const showMemo = useSetOkaimonoShowIndex({ setLoading, id, setValue, fields, append, setExpiryDate });
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
          <Box>
            <OkaimonoOverview
              register={register}
              validationNumber={validationNumber}
              errors={errors}
              readOnly={readOnly}
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
          </Box>
          <VStack
            position="fixed"
            bg="rgba(49,151,149,1)"
            align="center"
            justify="center"
            w="90%"
            bottom="1.5%"
            rounded="xl"
            zIndex="10"
            opacity="0.85"
          >
            <Box mt={4}>
              <Box as="p" color="white">
                現在の合計(税別): {totalBudget}円
              </Box>

              <Box as="p" color={Number(shoppingBudgetField || "") < totalBudget ? "red.500" : "white"}>
                お買い物予算残り: {Number(shoppingBudgetField || "") - totalBudget}円
              </Box>
            </Box>
            <Stack w="80%" py="3%">
              <PrimaryButtonForReactHookForm disabled={!isValid}>
                {readOnly ? "編集する" : "確定する"}
              </PrimaryButtonForReactHookForm>
              <OptionallyButton onClick={onClickTemporarilySaved} disabled={readOnly}>
                一時保存
              </OptionallyButton>
              <DeleteButton onClick={onClickBack}>一覧に戻る</DeleteButton>
            </Stack>
          </VStack>
          <Box h="12.5rem" />
        </VStack>
        <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent maxW="95vw">
            <ModalHeader>いま消費期限を入力しますか？</ModalHeader>
            <ModalCloseButton />
            <ModalBody>お買い物をする時にも入力できますよ！</ModalBody>
            <ModalFooter>
              <Button ref={initialRef} colorScheme="blue" mr={3} onClick={onClose}>
                今はしない
              </Button>
              <Button variant="ghost" onClick={onClickInputNow}>
                今入力したい
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </form>
  );
});
