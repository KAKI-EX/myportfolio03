import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import {
  GetSingleMemo,
  ListFormParams,
  MergeParams,
  OkaimonoMemoDataShow,
  OkaimonoMemosData,
  OkaimonoMemosDataResponse,
  OkaimonoShopModifingData,
} from "interfaces";
import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ja } from "date-fns/locale";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { DeleteButton } from "components/atoms/DeleteButton";
import { useHistory, useParams } from "react-router-dom";
import { memoProps, memoShow, memosShow, shoppingDatumShow, shopShow } from "lib/api/show";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import { useMemoUpdate } from "hooks/useMemoUpdate";
import { useUpdateUseMemoData } from "hooks/useUpdateUseMemoData";
import { useUpdateUseSingleListData } from "hooks/useUpdateUseSingleListData";
import { useGetUseMemoListData } from "hooks/useGetUseMemoListData";

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
    formState: { errors, isValid },
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

  const { showMessage } = useMessage();

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
  const onClickListModify = (index: number) => async (event: React.MouseEvent) => {
    setLoading(true);
    if (listValues) {
      try {
        const targetIdToFind = getValues(`listForm.${index}.id`);
        const target = listValues.find((element) => element.id === targetIdToFind);
        if (target) {
          const getTargetMemo = await memoShow(target.id);
          if (getTargetMemo && target) {
            const listResponse: GetSingleMemo = getTargetMemo;
            listSetValue("modifyPurchaseName", listResponse.data.purchaseName);
            listSetValue("modifyAmount", listResponse.data.amount);
            listSetValue("modifyMemo", listResponse.data.shoppingDetailMemo);
            listSetValue("modifyExpiryDateStart", listResponse.data.expiryDateStart);
            listSetValue("modifyExpiryDateEnd", listResponse.data.expiryDateEnd);
            listSetValue("modifyId", listResponse.data.id);
            listSetValue("modifyAsc", listResponse.data.asc);
            listSetValue("modifyShopId", listResponse.data.shopId);
            listSetValue("modifyListShoppingDate", listResponse.data.shoppingDate);
            listSetValue("modifyListShoppingDatumId", listResponse.data.shoppingDatumId);
            listSetValue("indexNumber", index);
            onListOpen();
            setLoading(false);
          }
        }
      } catch (err) {
        setLoading(false);
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    }
  };

  const onClickShoppingDatumModify = () => (event: React.MouseEvent) => {
    if (shoppingDatumValues) {
      shoppingDatumSetValue("modifyShoppingDate", shoppingDatumValues.shoppingDate);
      shoppingDatumSetValue("modifyEstimatedBudget", shoppingDatumValues.estimatedBudget);
      shoppingDatumSetValue("modifyShoppingMemo", shoppingDatumValues.shoppingMemo);
      shoppingDatumSetValue("modyfyShoppingDatumId", shoppingDatumValues.id);
      if (shopDataValue) {
        shoppingDatumSetValue("modifyShopName", shopDataValue.shopName);
        onShoppingDatumOpen();
      }
    }
  };

  const watchCheckbox = fields.map((field, index) => ({
    checked: watch(`listForm.${index}.isBought`),
  }));

  const checkboxCount = watchCheckbox.filter((c) => c.checked === true).length;
  const calculateCheckbox = fields.length - checkboxCount;
  // ----------------------------------------------------------------------------------------------------------
  // 全体のリスト更新
  const props = { setLoading, totalBudget };
  const sendUpdateToAPI = useMemoUpdate(props);
  const onAllSubmit = useCallback(
    async (formData: MergeParams) => {
      try {
        const result = await sendUpdateToAPI(formData, deleteIds, setDeleteIds);
        console.log("result", result);
        const memosProps: memoProps = {
          shoppingDatumId: result?.data[0].shoppingDatumId,
        };
        // const memosRes: OkaimonoMemosDataResponse = await memosShow(memosProps);
        const getAllList = await memosShow(memosProps);
        if (getAllList) {
          const listResponse = getAllList;
          for (let i = fields.length; i < listResponse.data.length; i++) {
            append({ purchaseName: "", price: "", shoppingDetailMemo: "", amount: "", id: "", asc: "" });
          }
          listResponse.data.forEach((data: ListFormParams, index: number) => {
            setValue(`listForm.${index}.purchaseName`, data.purchaseName);
            setValue(`listForm.${index}.price`, data.price);
            setValue(`listForm.${index}.shoppingDetailMemo`, data.shoppingDetailMemo);
            setValue(`listForm.${index}.amount`, data.amount);
            setValue(`listForm.${index}.id`, data.id);
          });
        }
        history.push("/okaimono");
      } catch (err) {
        setLoading(false);
        const axiosError = err as AxiosError;
        console.error(axiosError.response);
        showMessage({ title: "エラーが発生しました。", status: "error" });
      }
    },
    [sendUpdateToAPI]
  );
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
            <Box bg="white" rounded="xl" w={{ base: "100%", md: "50%" }} boxShadow="md">
              <HStack>
                <Stack align="center" justify="center" py={6} spacing="3" w="95%" ml={5}>
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    size="md"
                    type="date"
                    w="100%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...register("shoppingDate")}
                  />
                  <Input
                    isReadOnly={readOnly}
                    bg={readOnly ? "blackAlpha.200" : "white"}
                    placeholder={readOnly ? "お店の名前" : ""}
                    size="md"
                    w="100%"
                    fontSize={{ base: "sm", md: "md" }}
                    {...register("shopName", {
                      maxLength: { value: 35, message: "最大文字数は35文字までです。" },
                    })}
                  />
                  {errors.shopName && errors.shopName.types?.maxLength && (
                    <Box color="red">{errors.shopName.types.maxLength}</Box>
                  )}
                  <InputGroup w="100%">
                    <Input
                      isReadOnly={readOnly}
                      bg={readOnly ? "blackAlpha.200" : "white"}
                      size="md"
                      placeholder={!readOnly ? "お買い物の予算" : ""}
                      type="number"
                      fontSize={{ base: "sm", md: "md" }}
                      {...register("estimatedBudget")}
                    />
                    <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                      円
                    </InputRightElement>
                  </InputGroup>
                  <Input type="hidden" {...register(`shoppingDatumId`)} />
                  <Input type="hidden" {...register(`isFinish`)} />
                </Stack>
                <Box w="5%">
                  <Menu>
                    <MenuButton as={ChevronDownIcon} />
                    <MenuList borderRadius="md" shadow="md">
                      <MenuItem onClick={onClickShoppingDatumModify()}>確認&編集</MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
              </HStack>
            </Box>
            {fields.map((field, index) => {
              return (
                <Box
                  w={{ base: "100%", md: "50%" }}
                  key={field.key}
                  bg="white"
                  py={4}
                  px={2}
                  rounded={10}
                  boxShadow="md"
                >
                  <HStack>
                    <Checkbox size="lg" colorScheme="green" ml={1} {...register(`listForm.${index}.isBought`)} />
                    <Input
                      border={getValues(`listForm.${index}.id`) ? "none" : "1px solid black"}
                      placeholder="商品名"
                      w="50%"
                      fontSize={{ base: "sm", md: "md" }}
                      px={1}
                      isReadOnly={!!getValues(`listForm.${index}.id`)}
                      ml={0}
                      {...register(`listForm.${index}.purchaseName`, {
                        required: { value: true, message: "商品名が入力されていません" },
                        maxLength: { value: 30, message: "最大文字数は30文字までです。" },
                      })}
                    />
                    <InputGroup w="20%">
                      <Input
                        textAlign="center"
                        px={1}
                        border={getValues(`listForm.${index}.id`) ? "none" : "1px solid black"}
                        isReadOnly={!!getValues(`listForm.${index}.id`)}
                        fontSize={{ base: "sm", md: "md" }}
                        size="md"
                        type="number"
                        {...register(`listForm.${index}.amount`, {
                          max: { value: 99, message: "上限は99までです。" },
                          pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                        })}
                      />
                      <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                        個
                      </InputRightElement>
                    </InputGroup>
                    <InputGroup w="30%">
                      <Input
                        type="number"
                        fontSize={{ base: "sm", md: "md" }}
                        {...register(`listForm.${index}.price`, {
                          pattern: { value: validationNumber, message: "半角整数で入力してください。" },
                        })}
                      />
                      <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "sm", md: "md" }}>
                        円
                      </InputRightElement>
                    </InputGroup>
                    {errors.listForm && errors.listForm[index]?.price && (
                      <Box color="red" fontSize="sm">
                        {errors.listForm[index]?.price?.types?.pattern}
                      </Box>
                    )}
                    <Input type="hidden" {...register(`listForm.${index}.id`)} />
                    <Input type="hidden" {...register(`listForm.${index}.asc`)} />
                    <Menu>
                      <MenuButton as={ChevronDownIcon} />
                      <MenuList borderRadius="md" shadow="md" zIndex="dropdown">
                        {getValues(`listForm.${index}.id`) ? (
                          <MenuItem onClick={onClickListModify(index)}>編集する</MenuItem>
                        ) : null}
                        <MenuItem
                          onClick={() => {
                            if (getValues) {
                              const memoId = getValues(`listForm.${index}.id`);
                              if (memoId) {
                                if (setDeleteIds) {
                                  setDeleteIds((prevIds) => [...(prevIds || []), memoId]);
                                }
                              }
                            }
                            remove(index);
                          }}
                        >
                          削除する
                        </MenuItem>
                        <MenuItem onClick={() => insertInputForm(index)}>フォームを下に追加</MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                  {errors.listForm && errors.listForm[index]?.purchaseName && (
                    <Box color="red" fontSize="sm">
                      {errors.listForm[index]?.purchaseName?.types?.required}
                      {errors.listForm[index]?.purchaseName?.types?.maxLength}
                    </Box>
                  )}
                  {errors.listForm && errors.listForm[index]?.amount && (
                    <Box color="red" fontSize="sm">
                      {errors.listForm[index]?.amount?.types?.max}
                      {errors.listForm[index]?.amount?.types?.pattern}
                    </Box>
                  )}
                </Box>
              );
            })}
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

                <Box as="p" color="white">
                  買い物予定残り： {calculateCheckbox}つ
                </Box>
              </Box>
              <Stack w="80%" py="3%">
                <PrimaryButtonForReactHookForm>お買い物終了！</PrimaryButtonForReactHookForm>
                <DeleteButton onClick={onClickBack}>一覧に戻る</DeleteButton>
              </Stack>
            </VStack>
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
