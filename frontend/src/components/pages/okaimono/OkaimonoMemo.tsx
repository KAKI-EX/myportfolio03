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
import { ListFormParams, MergeParams } from "interfaces";
import React, { memo, useCallback, useContext, useEffect, useState, VFC } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useMessage } from "hooks/useToast";
import { useMemoCreate } from "hooks/useMemoCreate";
import { OkaimonoOverview } from "components/molecules/OkaimonoOverview";
import { OkaimonoDetail } from "components/molecules/OkaimonoDetail";
import { AuthContext } from "App";
import { useHistory } from "react-router-dom";
import { OptionallyButton } from "components/atoms/OptionallyButton";
import { AxiosError } from "axios";
import { purchaseNameSearchSuggestions, shopsSearchSuggestions } from "lib/api/show";
import { OkaimonoShopsIndexData } from "interfaces/index";

export const OkaimonoMemo: VFC = memo(() => {
  const defaultShoppingDate = new Date();
  const { showMessage } = useMessage();
  const { setLoading, loading } = useContext(AuthContext);
  const [expiryDate, setExpiryDate] = useState<boolean>(false);
  const { isOpen, onClose } = useDisclosure();
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
    const getSuggestionsShopName = async () => {
      try {
        if (shopNameValue) {
          const shopRes = await shopsSearchSuggestions(shopNameValue);
          if (shopRes?.status === 200 && shopRes) {
            setShopNameSuggestions(shopRes.data);
          }
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        setLoading(false);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    };
    getSuggestionsShopName();
  }, [shopNameValue]);

  // ---------------------------------------------------------------------------
  // 商品名のsuggest機能
  const [purchaseNameValue, setPurchaseNameValue] = useState("");
  const [purchaseNameSuggestions, setPurchaseNameSuggestions] = useState<ListFormParams[]>([]);

  const onListChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, newValue: string) => {
    event.preventDefault();

    setPurchaseNameValue(newValue);
  };

  useEffect(() => {
    const getSuggestionsPurchaseName = async () => {
      try {
        if (purchaseNameValue) {
          const purchaseRes = await purchaseNameSearchSuggestions(purchaseNameValue);
          if (purchaseRes?.status === 200 && purchaseRes) {
            setPurchaseNameSuggestions(purchaseRes.data);
          }
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        // eslint-disable-next-line no-console
        console.error(axiosError.response);
        setLoading(false);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    };
    getSuggestionsPurchaseName();
  }, [purchaseNameValue]);

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
            お買い物メモの作成
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
              expiryDate={expiryDate}
              onListChange={onListChange}
              getValues={getValues}
              purchaseNameSuggestions={purchaseNameSuggestions}
              setValue={setValue}
              setPurchaseNameSuggestions={setPurchaseNameSuggestions}
            />
          </Box>
          <VStack
            position="fixed"
            bg="rgba(49,151,149,1)"
            align="center"
            justify="center"
            w={{ base: "90%", md: "60%" }}
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
              <PrimaryButtonForReactHookForm disabled={!isValid}>確定</PrimaryButtonForReactHookForm>
              <OptionallyButton onClick={onClickTemporarilySaved} disabled={!isValid}>
                一時保存
              </OptionallyButton>
              <DeleteButton onClick={onClickBack}>保存しない</DeleteButton>
            </Stack>
          </VStack>
          <Box h="15rem" />
        </VStack>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="95vw">
          <ModalHeader>いま消費期限を入力しますか？</ModalHeader>
          <ModalCloseButton />
          <ModalBody>お買い物をする時にも入力できますよ！</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              今はしない
            </Button>
            <Button variant="ghost" onClick={onClickInputNow}>
              今入力したい
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  );
});
