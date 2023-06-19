import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { MergeParams, OkaimonoMemoDataShow, OkaimonoMemosData, OkaimonoShopModifingData } from "interfaces";
import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ja } from "date-fns/locale";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { useHistory, useParams } from "react-router-dom";
import { useUpdateUseMemoData } from "hooks/useUpdateUseMemoData";
import { useUpdateUseSingleListData } from "hooks/useUpdateUseSingleListData";
import { useGetUseMemoListData } from "hooks/useGetUseMemoListData";
import { useGetUseSingleListData } from "hooks/useGetUseSingleListData";
import { useUpdateUseMemoListData } from "hooks/useUpdateUseMemoListData";
import { OkaimonoMemoUseMemo } from "components/molecules/OkaimonoMemoUseMemo";
import { OkaimonoMemoUseList } from "components/molecules/OkaimonoMemoUseList";
import { OkaimonoMemoUseCalculate } from "components/molecules/OkaimonoMemoUseCalculate";

export const OkaimonoMemoUse: VFC = memo(() => {
  const [readOnly, setReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listValues, setListValues] = useState<OkaimonoMemosData[]>();
  const [shoppingDatumValues, setShoppingDatumValues] = useState<OkaimonoMemoDataShow>();
  const [shopDataValue, setShopDataValues] = useState<OkaimonoShopModifingData>();
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const updateShoppingData = useUpdateUseMemoData();
  const updateListData = useUpdateUseSingleListData();
  const getShoppingMemoList = useGetUseMemoListData();
  const getSingleListData = useGetUseSingleListData();

  const { isOpen: isShoppingDatumOpen, onOpen: onShoppingDatumOpen, onClose: closeShoppingDatum } = useDisclosure();
  const { isOpen: isListOpen, onOpen: onListOpen, onClose: closeList } = useDisclosure();

  const defaultShoppingDate = new Date();
  const history = useHistory();
  const formattedDefaultShoppingDate = format(defaultShoppingDate, "yyyy-MM-dd", {
    locale: ja,
  });
  const validationNumber = /^[0-9]+$/;

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
  const {
    setValue: shoppingDatumSetValue,
    register: shoppingDatumRegister,
    handleSubmit: shoppiingDatumModifyHandleSubmit,
    formState: { errors: shoppingDatumErrors },
  } = useForm<MergeParams>({
    criteriaMode: "all",
    mode: "all",
  });
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
  const shoppingDatumSubmit = useCallback(
    (formData: MergeParams) => {
      const updateProps = {
        setReadOnly,
        readOnly,
        setLoading,
        shoppingDatumFormData: formData,
        setValue,
      };
      updateShoppingData(updateProps);
    },
    [setReadOnly, readOnly, setLoading]
  );

  const onCloseShoppingDatum = () => {
    setReadOnly(true);
    closeShoppingDatum();
  };
  // ----------------------------------------------------------------------------------------------------------
  // リスト情報の単一修正論理式。(右の下矢印から編集を選び、編集する際に呼び出される論理式。)
  const onOneSubmit = async (oneListFormData: MergeParams) => {
    const listProps = { setReadOnly, readOnly, setLoading, oneListFormData, setValue };
    updateListData(listProps);
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
      expiryDateStart: formattedDefaultShoppingDate,
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
  const memoListHooksProps = {
    setLoading,
    totalBudget,
  };
  const updateMemoListData = useUpdateUseMemoListData(memoListHooksProps);
  useEffect(() => {
    const memoListProps = {
      setLoading,
      fields,
      shoppingDatumId,
      setShoppingDatumValues,
      setValue,
      setShopDataValues,
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

  const onClickShoppingDatumModify = (event: React.MouseEvent) => {
    if (shoppingDatumValues && shopDataValue) {
      console.log("shoppingDatumValues", shoppingDatumValues);
      shoppingDatumSetValue("modifyShoppingDate", shoppingDatumValues.shoppingDate);
      shoppingDatumSetValue("modifyEstimatedBudget", shoppingDatumValues.estimatedBudget);
      shoppingDatumSetValue("modifyShoppingMemo", shoppingDatumValues.shoppingMemo);
      shoppingDatumSetValue("modyfyShoppingDatumId", shoppingDatumValues.id);
      shoppingDatumSetValue("modifyShopName", shopDataValue.shopName);
      onShoppingDatumOpen();
    }
  };

  const watchCheckbox = fields.map((field, index) => ({
    checked: watch(`listForm.${index}.isBought`),
  }));

  const checkboxCount = watchCheckbox.filter((c) => c.checked === true).length;
  const calculateCheckbox = fields.length - checkboxCount;
  // ----------------------------------------------------------------------------------------------------------
  // 全体のリスト更新
  const onAllSubmit = (formData: MergeParams) => {
    const memoListProps = {
      formData,
      deleteIds,
      setDeleteIds,
      setLoading,
      totalBudget,
      fields,
      append,
      setValue,
    };
    updateMemoListData(memoListProps);
  };
  // ----------------------------------------------------------------------------------------------------------

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
              onClickShoppingDatumModify={onClickShoppingDatumModify}
            />
            <OkaimonoMemoUseList
              fields={fields}
              register={register}
              getValues={getValues}
              validationNumber={validationNumber}
              onClickListModify={onClickListModify}
              setDeleteIds={setDeleteIds}
              remove={remove}
              insertInputForm={insertInputForm}
              errors={errors}
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

      <form onSubmit={shoppiingDatumModifyHandleSubmit(shoppingDatumSubmit)}>
        <Modal isOpen={isShoppingDatumOpen} onClose={closeShoppingDatum}>
          <ModalOverlay />
          <ModalContent bg="gray.100" maxW="95vw">
            <ModalHeader>選択したお買い物メモ情報</ModalHeader>
            <ModalCloseButton _focus={{ boxShadow: "none" }} />
            <ModalBody>
              <Box bg="white" rounded="xl">
                <Stack align="center" justify="center" py={6} spacing="3">
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    size="md"
                    type="date"
                    w="90%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...shoppingDatumRegister("modifyShoppingDate")}
                  />
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={!readOnly ? "お店の名前" : ""}
                    size="md"
                    w="90%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...shoppingDatumRegister("modifyShopName", {
                      maxLength: { value: 35, message: "最大文字数は35文字までです。" },
                    })}
                  />
                  {shoppingDatumErrors.modifyShopName && shoppingDatumErrors.modifyShopName.types?.maxLength && (
                    <Box color="red">{shoppingDatumErrors.modifyShopName.types.maxLength}</Box>
                  )}
                  <InputGroup w="90%">
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      size="md"
                      placeholder={!readOnly ? "お買い物の予算" : ""}
                      type="number"
                      fontSize={{ base: "sm", md: "md" }}
                      {...shoppingDatumRegister("modifyEstimatedBudget", {
                        pattern: {
                          value: validationNumber,
                          message: "半角整数で入力してください。",
                        },
                      })}
                    />
                    <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                      円
                    </InputRightElement>
                  </InputGroup>
                  {shoppingDatumErrors.modifyEstimatedBudget &&
                    shoppingDatumErrors.modifyEstimatedBudget.types?.pattern && (
                      <Box color="red">{shoppingDatumErrors.modifyEstimatedBudget.types.pattern}</Box>
                    )}
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={!readOnly ? "一言メモ" : ""}
                    size="md"
                    w="90%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...shoppingDatumRegister("modifyShoppingMemo", {
                      maxLength: { value: 150, message: "最大文字数は150文字です。" },
                    })}
                  />
                  {shoppingDatumErrors.modifyShoppingMemo &&
                    shoppingDatumErrors.modifyShoppingMemo.types?.maxLength && (
                      <Box color="red">{shoppingDatumErrors.modifyShoppingMemo.types.maxLength}</Box>
                    )}
                  <Input type="hidden" {...shoppingDatumRegister(`modyfyShoppingDatumId`)} />
                </Stack>
              </Box>
            </ModalBody>
            <ModalFooter>
              <HStack>
                <Button bg="gray.400" color="white" mr={3} onClick={onCloseShoppingDatum}>
                  閉じる
                </Button>
                <PrimaryButtonForReactHookForm onClick={shoppiingDatumModifyHandleSubmit(shoppingDatumSubmit)}>
                  {readOnly ? "編集" : "保存"}{" "}
                </PrimaryButtonForReactHookForm>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </form>

      <form onSubmit={oneListModifyHandleSubmit(onOneSubmit)}>
        <Modal isOpen={isListOpen} onClose={onCloseList}>
          <ModalOverlay />
          <ModalContent bg="gray.100" maxW="95vw">
            <ModalHeader>選択したリストの情報</ModalHeader>
            <ModalCloseButton _focus={{ boxShadow: "none" }} />
            <ModalBody>
              <VStack w="100%">
                <Box bg="white" p={3} rounded="md">
                  <VStack>
                    <HStack>
                      <Input
                        isReadOnly={readOnly}
                        bg={readOnly ? "blackAlpha.200" : "white"}
                        placeholder="商品名"
                        w="70%"
                        fontSize={{ base: "sm", md: "md" }}
                        {...listRegister(`modifyPurchaseName`, {
                          required: { value: true, message: "商品名が入力されていません" },
                          maxLength: { value: 30, message: "最大文字数は30文字までです。" },
                        })}
                      />
                      <InputGroup w="30%">
                        <Input
                          isReadOnly={readOnly}
                          bg={readOnly ? "blackAlpha.200" : "white"}
                          placeholder="個数"
                          type="number"
                          fontSize={{ base: "sm", md: "md" }}
                          {...listRegister(`modifyAmount`, {
                            max: { value: 99, message: "上限は99までです。" },
                            pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                          })}
                        />
                        <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                          個
                        </InputRightElement>
                      </InputGroup>
                    </HStack>
                    {listErrors.modifyPurchaseName && (
                      <Box color="red" fontSize="sm">
                        {listErrors.modifyPurchaseName?.types?.required}
                        {listErrors.modifyPurchaseName?.types?.maxLength}
                      </Box>
                    )}
                    {listErrors.modifyAmount && (
                      <Box color="red" fontSize="sm">
                        {listErrors.modifyAmount?.types?.max}
                        {listErrors.modifyAmount?.types?.pattern}
                      </Box>
                    )}
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      placeholder="メモ"
                      fontSize={{ base: "sm", md: "md" }}
                      {...listRegister(`modifyMemo`, {
                        maxLength: { value: 150, message: "最大文字数は150文字です。" },
                      })}
                    />
                    {listErrors.modifyMemo && (
                      <Box color="red" fontSize="sm">
                        {listErrors.modifyMemo?.types?.maxLength}
                      </Box>
                    )}
                  </VStack>
                </Box>
                <HStack w="100%" bg="white" p={3} rounded="md">
                  <Box w="50%">
                    <FormLabel mb="3px" fontSize={{ base: "sm", md: "md" }}>
                      消費期限 開始日
                    </FormLabel>
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      type="date"
                      placeholder="消費期限 開始"
                      {...listRegister(`modifyExpiryDateStart`)}
                    />
                  </Box>
                  <Box w="50%">
                    <FormLabel mb="3px" fontSize={{ base: "sm", md: "md" }}>
                      終了日
                    </FormLabel>
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      type="date"
                      placeholder="終了日"
                      {...listRegister(`modifyExpiryDateEnd`, {
                        validate: (value) =>
                          !startDate ||
                          !value ||
                          new Date(value) >= new Date(startDate) ||
                          "終了日は開始日以降の日付を選択してください。",
                      })}
                    />
                  </Box>
                </HStack>
                {listErrors.modifyExpiryDateEnd && (
                  <Box color="red" fontSize="sm">
                    {listErrors.modifyExpiryDateEnd?.message}
                  </Box>
                )}
                <Input type="hidden" {...listRegister(`modifyId`)} />
                <Input type="hidden" {...listRegister(`modifyAsc`)} />
                <Input type="hidden" {...listRegister(`modifyShopId`)} />
                <Input type="hidden" {...listRegister(`modifyListShoppingDatumId`)} />
                <Input type="hidden" {...listRegister(`modifyListShoppingDate`)} />
                <Input type="hidden" {...listRegister(`indexNumber`)} />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <HStack>
                <Button bg="gray.400" color="white" mr={3} onClick={onCloseList}>
                  閉じる
                </Button>
                <PrimaryButtonForReactHookForm onClick={oneListModifyHandleSubmit(onOneSubmit)}>
                  {readOnly ? "編集" : "保存"}{" "}
                </PrimaryButtonForReactHookForm>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </form>
    </>
  );
});
