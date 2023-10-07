import { Box, Flex, VStack, Spinner, Heading, useDisclosure } from "@chakra-ui/react";

import React, { memo, useCallback, useEffect, useState, VFC } from "react";
import { alertParams, ListFormParams, MergeParams, OkaimonoShopsIndexData } from "interfaces";
import { useHistory } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { useGetAlertList } from "hooks/useGetAlertList";
import { useGetAlertShop } from "hooks/useGetAlertShop";
import { useAlertListDelete } from "hooks/useAlertListDelete";
import { OkaimonoAlertList } from "components/molecules/OkaimonoAlertList";
import { OkaimonoAlertModal } from "components/molecules/OkaimonoAlertModal";

export const OkaimonoAlert: VFC = memo(() => {
  const [loading, setLoading] = useState<boolean>(false);
  const [alertLists, setAlertLists] = useState<ListFormParams[]>();
  const [alertListDetail, setAlertListDetail] = useState<ListFormParams | null>();
  const [alertListShop, setAlertListShop] = useState<OkaimonoShopsIndexData | null>();
  const [clickAlertDelete, setClickAlertDelete] = useState<boolean>(false);

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
    <Box w="95vw">
      <form onSubmit={handleSubmit(deleteSubmit)}>
        <Flex align="center" justify="center" px={2}>
          <Box w={{ base: "100%", md: "80%" }}>
            <Heading as="h1" size="lg" textAlign="center" my={5}>
              お買い物アラート
            </Heading>
            <VStack>
              <PrimaryButtonForReactHookForm onClick={onClickDeleteAlert}>
                {clickAlertDelete ? "確定" : "アラートを選択して消す"}
              </PrimaryButtonForReactHookForm>
              <OkaimonoAlertList
                alertLists={alertLists}
                clickAlertDelete={clickAlertDelete}
                register={register}
                onClickAlertListBody={onClickAlertListBody}
              />
            </VStack>
          </Box>
        </Flex>
      </form>
      <OkaimonoAlertModal
        isOpen={isOpen}
        onClose={onClose}
        onClickShowMemo={onClickShowMemo}
        alertListDetail={alertListDetail}
        alertListShop={alertListShop}
        onClickClose={onClickClose}
      />
    </Box>
  );
});
