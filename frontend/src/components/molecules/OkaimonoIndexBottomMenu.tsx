import { HStack, Icon, Spacer, Text, useMediaQuery, VStack } from "@chakra-ui/react";
import { useOnClickAlert } from "hooks/useOnClickAlert";
import { useOnClickMakeMemo } from "hooks/useOnClickMakeMemo";
import { useOnClickMyPage } from "hooks/useOnClickMyPage";
import { useOnClickSearch } from "hooks/useOnClickSearch";
import { memo, VFC } from "react";
import { BsCardChecklist, BsDoorOpen, BsJournalPlus, BsSearch } from "react-icons/bs";

export const OkaimonoIndexBottomMenu: VFC = memo(() => {
  const onClickMakeMemo = useOnClickMakeMemo();
  const onClickAlert = useOnClickAlert();
  const onClickSearch = useOnClickSearch();
  const onClickMyPage = useOnClickMyPage();
  const [isLargerThan767] = useMediaQuery("(min-width: 767px)");

  return (
    <>
      {isLargerThan767 ? null : (
        <VStack
          py={2}
          position="fixed"
          bg="#f9f7ef"
          align="center"
          justify="center"
          bottom="0%"
          zIndex="10"
          opacity="0.85"
          w="100%"
          h="13%"
        >
          <HStack spacing={5}>
            <VStack>
              <Icon as={BsJournalPlus} h={8} w={8} onClick={onClickMakeMemo} />
              <Text>作成</Text>
            </VStack>
            <Spacer />
            <VStack>
              <Icon as={BsCardChecklist} h={8} w={8} onClick={onClickAlert} />
              <Text>アラート</Text>
            </VStack>
            <Spacer />
            <VStack>
              <Icon as={BsSearch} h={8} w={8} onClick={onClickSearch} />
              <Text>履歴検索</Text>
            </VStack>
            <Spacer />
            <VStack>
              <Icon as={BsDoorOpen} h={8} w={8} onClick={onClickMyPage} />
              <Text>マイページ</Text>
            </VStack>
          </HStack>
        </VStack>
      )}
    </>
  );
});
