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
        _hover={{ fontWeight: "bold" }}
      >
        買い物予定
      </Tab>
      <Tab
        _focus={{ outline: "none" }}
        fontSize={{ base: "sm", md: "md" }}
        isDisabled={inCompleteMemo?.length === 0}
        _hover={{ fontWeight: "bold" }}
      >
        一時保存中
      </Tab>
      <Tab
        _focus={{ outline: "none" }}
        fontSize={{ base: "sm", md: "md" }}
        isDisabled={finishedMemo?.length === 0}
        _hover={{ fontWeight: "bold" }}
      >
        完了
      </Tab>
    </TabList>
  );
});
