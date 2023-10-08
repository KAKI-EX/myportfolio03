import { Box, HStack, Spacer, VStack } from "@chakra-ui/react";
import React, { memo, VFC } from "react";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { OptionallyButton } from "components/atoms/OptionallyButton";
import { DeleteButton } from "components/atoms/DeleteButton";

type Props = {
  totalBudget: number;
  shoppingBudgetField: string | undefined;
  isValid: boolean;
  readOnly?: boolean;
  isFinished?: boolean | undefined;
  onClickTemporarilySaved: () => void;
  onClickBack: () => void;
};

export const OkaimonoButtonAndCalculater: VFC<Props> = memo((props) => {
  const { totalBudget, shoppingBudgetField, isValid, readOnly, isFinished, onClickTemporarilySaved, onClickBack } =
    props;

  return (
    <VStack
      py={2}
      position="fixed"
      bg="rgba(49,151,149,1)"
      align="center"
      justify="center"
      bottom="1.5%"
      rounded="xl"
      zIndex="10"
      opacity="0.85"
      w={{ base: "90%", md: "70%", xl: "60%" }}
    >
      <Box>
        <Box as="p" color="white">
          現在の合計(税別): {totalBudget}円
        </Box>
        <Box as="p" color={Number(shoppingBudgetField || "") < totalBudget ? "red.500" : "white"}>
          お買い物予算残り: {Number(shoppingBudgetField || "") - totalBudget}円
        </Box>
      </Box>
      <HStack w="100%">
        <Spacer />
        <PrimaryButtonForReactHookForm disabled={!isValid} w={isFinished ? "60%" : "45%"}>
          {readOnly ? "編集" : "確定"}
        </PrimaryButtonForReactHookForm>
        {isFinished ? null : <Spacer />}
        {!isFinished && (
          <>
            <OptionallyButton w="45%" onClick={onClickTemporarilySaved} disabled={!isValid}>
              一時保存
            </OptionallyButton>
          </>
        )}
        <Spacer />
      </HStack>
      <DeleteButton w="60%" onClick={onClickBack}>
        一覧に戻る
      </DeleteButton>
    </VStack>
  );
});
