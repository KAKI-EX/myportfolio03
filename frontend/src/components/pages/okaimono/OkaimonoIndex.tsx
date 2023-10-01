import { Box, Flex, Heading, Spinner, TabPanel, TabPanels, Tabs, useDisclosure } from "@chakra-ui/react";
import React, { memo, useEffect, useState, VFC } from "react";
import { useHistory } from "react-router-dom";
import { OkaimonoMemoData } from "interfaces";
import { useForm } from "react-hook-form";
import { useGetOkaimonoIndex } from "hooks/useGetOkaimonoIndex";
import { useGetOpenUrl } from "hooks/useGetOpenUrl";
import { useOkaimonoIndexDelete } from "hooks/useOkaimonoIndexDelete";
import { OkaimonoIndexTabList } from "components/molecules/OkaimonoIndexTabList";
import { OkaimonoIndexTabPanelTemporary } from "components/molecules/OkaimonoIndexTabPanelTemporary";
import { OkaimonoIndexTapPanelConfimed } from "components/molecules/OkaimonoIndexTapPanelConfimed";
import { OkaimonoIndexTabPanelCompleted } from "components/molecules/OkaimonoIndexTabPanelCompleted";
import { DeleteConfimationDialog } from "components/molecules/DeleteConfimationDialog";
import { OkaimonoCheckOpenUrlModal } from "components/molecules/OkaimonoCheckOpenUrlModal";

export const OkaimonoIndex: VFC = memo(() => {
  const [inCompleteMemo, setInCompleteMemo] = useState<OkaimonoMemoData[] | null>();
  const [readyShoppingMemo, setReadyShoppingMemo] = useState<OkaimonoMemoData[] | null>();
  const [finishedMemo, setFinishedMemo] = useState<OkaimonoMemoData[] | null>();
  const [openMessage, setOpenMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [deletePost, setDeletePost] = useState<OkaimonoMemoData>();

  const getIndex = useGetOkaimonoIndex();
  const getOpenUrl = useGetOpenUrl(readyShoppingMemo);

  const history = useHistory();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onCloseAlert } = useDisclosure();
  const { isOpen: isOpenUrl, onOpen: onOpenUrl, onClose: onCloseUrl } = useDisclosure();
  const cancelRef = React.useRef(null);
  const { register, getValues, setValue } = useForm();

  //------------------------------------------------------------------------
  // indexページのリスト読み込み
  useEffect(() => {
    const props = { setLoading, setInCompleteMemo, setReadyShoppingMemo, setFinishedMemo };
    getIndex(props);
  }, []);
  //------------------------------------------------------------------------
  // indexページの特定のメモ削除機能
  const customHookProps = {
    onCloseAlert,
    inCompleteMemo,
    setInCompleteMemo,
    readyShoppingMemo,
    setReadyShoppingMemo,
    finishedMemo,
    setFinishedMemo,
    setLoading,
  };
  const deleteShopData = useOkaimonoIndexDelete(customHookProps);
  const onClickDelete = (deleteId: OkaimonoMemoData) => {
    deleteShopData(deleteId);
  };
  // ---------------------------------------------------------------------------------
  // paramsを使用してidを渡すリンク
  const onClickShowMemo = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    history.push(`/okaimono/okaimono_show/${id}`);
  };

  const onClickMemoUse = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    history.push(`/okaimono/okaimono_memo_use/${id}`);
  };
  // ---------------------------------------------------------------------------------
  // 公開用ページのopenModalとコピー機能(コピー機能はhttps環境下出ないと動作しないため注意)
  const onClickShowOpenUrl = (shoppingDatumId: string, event: React.MouseEvent) => {
    const openUrlProps = { setOpenMessage, setValue, onOpenUrl, setLoading, shoppingDatumId, event };
    getOpenUrl(openUrlProps);
  };

  const onClickUrlCopy = () => {
    navigator.clipboard.writeText(getValues("openMemoUrl"));
  };
  // ---------------------------------------------------------------------------------

  return loading ? (
    <Box h="80vh" display="flex" justifyContent="center" alignItems="center">
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    </Box>
  ) : (
    <Flex align="center" justify="center" px={2}>
      <Box w={{ base: "100rem", md: "60rem" }}>
        <Heading as="h1" size="lg" textAlign="center" my={5}>
          お買い物リスト一覧
        </Heading>
        <Box borderRadius="lg" overflow="hidden" backgroundColor="white" boxShadow="md">
          <Tabs isFitted>
            <OkaimonoIndexTabList
              inCompleteMemo={inCompleteMemo}
              readyShoppingMemo={readyShoppingMemo}
              finishedMemo={finishedMemo}
            />
            <TabPanels>
              <TabPanel p={1}>
                <OkaimonoIndexTapPanelConfimed
                  onClickShowMemo={onClickShowMemo}
                  setDeletePost={setDeletePost}
                  onAlertOpen={onAlertOpen}
                  readyShoppingMemo={readyShoppingMemo}
                  onClickMemoUse={onClickMemoUse}
                  onClickShowOpenUrl={onClickShowOpenUrl}
                />
              </TabPanel>
              <TabPanel p={1}>
                <OkaimonoIndexTabPanelTemporary
                  onClickShowMemo={onClickShowMemo}
                  inCompleteMemo={inCompleteMemo}
                  setDeletePost={setDeletePost}
                  onAlertOpen={onAlertOpen}
                />
              </TabPanel>
              <TabPanel p={1}>
                <OkaimonoIndexTabPanelCompleted
                  onClickShowMemo={onClickShowMemo}
                  setDeletePost={setDeletePost}
                  onAlertOpen={onAlertOpen}
                  finishedMemo={finishedMemo}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <DeleteConfimationDialog
          onCloseAlert={onCloseAlert}
          isAlertOpen={isAlertOpen}
          cancelRef={cancelRef}
          deletePost={deletePost}
          onClickDelete={onClickDelete}
        />
        <OkaimonoCheckOpenUrlModal
          getValues={getValues}
          isOpenUrl={isOpenUrl}
          onCloseUrl={onCloseUrl}
          openMessage={openMessage}
          register={register}
          onClickUrlCopy={onClickUrlCopy}
        />
      </Box>
    </Flex>
  );
});
