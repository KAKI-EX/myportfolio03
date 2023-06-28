import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  VStack,
  Spinner,
  Heading,
  HStack,
  Icon,
  Text,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tr,
  Td,
  TableContainer,
  TableCaption,
  Table,
  Tbody,
} from "@chakra-ui/react";

import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { TbAlertTriangle, TbArrowBarRight, TbArrowBarToRight } from "react-icons/tb";
import { BsCartCheck, BsShopWindow } from "react-icons/bs";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { BiCube } from "react-icons/bi";
import { alertParams, ListFormParams, MergeParams, OkaimonoShopsIndexData } from "interfaces";
import { useDateConversion } from "hooks/useDateConversion";
import { useHistory } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { useGetAlertList } from "hooks/useGetAlertList";
import { useGetAlertShop } from "hooks/useGetAlertShop";
import { useAlertListDelete } from "hooks/useAlertListDelete";

export const OkaimonoAlert: VFC = memo(() => {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertLists, setAlertLists] = useState<ListFormParams[]>();
  const [alertListDetail, setAlertListDetail] = useState<ListFormParams | null>();
  const [alertListShop, setAlertListShop] = useState<OkaimonoShopsIndexData | null>();
  const [clickAlertDelete, setClickAlertDelete] = useState<boolean>(false);

  const { dateConversion } = useDateConversion();
  const getAlert = useGetAlertList();
  const getShop = useGetAlertShop();
  const updateIsDisplay = useAlertListDelete();

  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { control, register, handleSubmit } = useForm<MergeParams>({
    criteriaMode: "all",
    mode: "all",
  });

  useFieldArray({
    control,
    name: "listForm",
    keyName: "key", // デフォルトではidだが、keyに変更。
  });

  const deleteSubmit = async (formData: alertParams) => {
    const deleteProps = {
      setLoading,
      setAlertLists,
      clickAlertDelete,
      formData,
      alertLists,
    };
    updateIsDisplay(deleteProps);
  };

  const onClickDeleteAlert = () => {
    setClickAlertDelete(!clickAlertDelete);
  };

  useEffect(() => {
    const props = {
      setLoading,
      setAlertLists,
    };
    getAlert(props);
  }, []);

  const onClickAlertListBody = useCallback(
    (listId: string | undefined, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();

      const findTargetAlert = alertLists?.find((item) => item.id === listId);
      setAlertListDetail(findTargetAlert);
    },
    [alertLists]
  );

  useEffect(() => {
    const props = {
      setLoading,
      setAlertListShop,
      alertListDetail,
      onOpen,
    };
    getShop(props);
  }, [alertListDetail]);

  const onClickClose = () => {
    setAlertListDetail(null);
    setAlertListShop(null);
    onClose();
  };

  const onClickShowMemo = (event: React.MouseEvent, id?: string) => {
    event.preventDefault();
    history.push(`/okaimono/okaimono_show/${id}`);
  };

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <>
      <form onSubmit={handleSubmit(deleteSubmit)}>
        <Flex align="center" justify="center" px={2}>
          <Box w={{ base: "100%", md: "50%" }}>
            <Heading as="h1" size="lg" textAlign="center" my={5}>
              お買い物アラート
            </Heading>
            <VStack>
              <PrimaryButtonForReactHookForm onClick={onClickDeleteAlert}>
                {clickAlertDelete ? "確定" : "アラートを選択して消す"}
              </PrimaryButtonForReactHookForm>
              {alertLists?.map((alert, index) => (
                <HStack w="100%" bg="white" py={4} px={2} rounded={10} boxShadow="md" key={alert.id}>
                  {clickAlertDelete ? (
                    <Checkbox size="lg" colorScheme="green" ml={1} {...register(`listForm.${index}.isDelete`)} />
                  ) : null}
                  <Text
                    w="18%"
                    color={
                      (alert.differentDay !== undefined && alert.differentDay > 0 && "red.500") ||
                      (alert.differentDay !== undefined && alert.differentDay > -3 && "yellow.500") ||
                      "green.500"
                    }
                    fontSize={{ base: "sm", md: "md" }}
                    textAlign="center"
                    onClick={(event) => onClickAlertListBody(alert.id, event)}
                  >
                    {alert.differentDay !== undefined && alert.differentDay > 0 && (
                      <Icon
                        as={TbAlertTriangle}
                        w={6}
                        h={6}
                        mb={-2}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      />
                    )}
                    {`${alert.differentDay}日`}
                  </Text>
                  <Text
                    w="40%"
                    fontSize={{ base: "sm", md: "md" }}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    onClick={(event) => onClickAlertListBody(alert.id, event)}
                  >
                    {alert.purchaseName}
                  </Text>
                  <Text
                    w="40%"
                    fontSize={{ base: "sm", md: "md" }}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    onClick={(event) => onClickAlertListBody(alert.id, event)}
                  >
                    <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
                    {dateConversion(alert.shoppingDate)}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Flex>
      </form>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.100" maxW="95vw">
          <ModalHeader>選択したアラートの情報</ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody>
            <VStack alignItems="left" bg="white" boxShadow="md" rounded={10}>
              <TableContainer>
                <Table variant="simple">
                  <TableCaption onClick={(event) => onClickShowMemo(event, alertListDetail?.shoppingDatumId)}>
                    実際のお買い物メモを見る
                  </TableCaption>
                  <Tbody>
                    <Tr>
                      <Td fontSize={{ base: "sm", md: "md" }}>
                        <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
                        購入日
                      </Td>
                      <Td fontSize={{ base: "sm", md: "md" }}>{dateConversion(alertListDetail?.shoppingDate)}</Td>
                    </Tr>
                    <Tr>
                      <Td fontSize={{ base: "sm", md: "md" }}>
                        <Icon as={TbArrowBarRight} w={5} h={5} mb={-1} mr={1} />
                        消費期限 開始
                      </Td>
                      <Td fontSize={{ base: "sm", md: "md" }}>{dateConversion(alertListDetail?.expiryDateStart)}</Td>
                    </Tr>
                    <Tr>
                      <Td fontSize={{ base: "sm", md: "md" }}>
                        <Icon as={TbArrowBarToRight} w={5} h={5} mb={-1} mr={1} />
                        消費期限 終了
                      </Td>
                      <Td fontSize={{ base: "sm", md: "md" }}>{dateConversion(alertListDetail?.expiryDateEnd)}</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Icon as={BsShopWindow} w={5} h={5} mb={-1} mr={1} />
                        お店の名前
                      </Td>
                      <Td>{alertListShop?.shopName}</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Icon as={AiOutlineMoneyCollect} w={5} h={5} mb={-1} mr={1} />
                        価格
                      </Td>
                      <Td>{`${alertListDetail?.price}  円`}</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Icon as={BiCube} w={5} h={5} mb={-1} mr={1} />
                        個数
                      </Td>
                      <Td>{`${alertListDetail?.amount}  つ`}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button bg="gray.400" color="white" mr={3} onClick={onClickClose}>
                閉じる
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
