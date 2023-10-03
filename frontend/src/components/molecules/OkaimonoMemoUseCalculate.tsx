import { Box, Stack, VStack } from "@chakra-ui/react";
import { DeleteButton } from "components/atoms/DeleteButton";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";
import { memo, VFC } from "react";

type Props = {
  totalBudget: number;
  shoppingBudgetField: string | undefined;
  calculateCheckbox: number;
  onClickBack: () => void;
  userId?: string;
  onClickButton?: () => void;
};

export const OkaimonoMemoUseCalculate: VFC<Props> = memo((props) => {
  const { totalBudget, shoppingBudgetField, calculateCheckbox, onClickBack, userId } = props;
  return (
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
        <PrimaryButtonForReactHookForm type="submit">お買い物終了！</PrimaryButtonForReactHookForm>
        {!userId ? <DeleteButton onClick={onClickBack}>一覧に戻る</DeleteButton> : null}
      </Stack>
    </VStack>
  );
});
