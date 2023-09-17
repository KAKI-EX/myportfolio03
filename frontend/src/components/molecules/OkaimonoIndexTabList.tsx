import { Tab, TabList } from "@chakra-ui/react";
import { OkaimonoMemoData } from "interfaces";
import { memo, VFC } from "react";

type Props = {
  inCompleteMemo: OkaimonoMemoData[] | null | undefined;
  readyShoppingMemo: OkaimonoMemoData[] | null | undefined;
  finishedMemo: OkaimonoMemoData[] | null | undefined;
};

export const OkaimonoIndexTabList: VFC<Props> = memo((props) => {
  const { inCompleteMemo, readyShoppingMemo, finishedMemo } = props;

  return (
    <TabList>
      <Tab
        _focus={{ outline: "none" }}
        fontSize={{ base: "sm", md: "md" }}
        isDisabled={readyShoppingMemo?.length === 0}
      >
        買い物予定メモ
      </Tab>
      <Tab _focus={{ outline: "none" }} fontSize={{ base: "sm", md: "md" }} isDisabled={inCompleteMemo?.length === 0}>
        一時保存中メモ
      </Tab>
      <Tab _focus={{ outline: "none" }} fontSize={{ base: "sm", md: "md" }} isDisabled={finishedMemo?.length === 0}>
        完了メモ
      </Tab>
    </TabList>
  );
});
