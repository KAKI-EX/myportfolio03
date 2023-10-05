import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  readOnly?: boolean;
  register: UseFormRegister<MergeParams>;
  w?: string;
};

export const InputEstimatedBudget: VFC<Props> = memo((props) => {
  const { readOnly = false, register, w } = props;
  const validationNumber = /^[0-9]+$/;
  return (
    <InputGroup w={w} _hover={readOnly ? undefined : { fontWeight: "bold", cursor: "pointer" }}>
      <Input
        _hover={readOnly ? undefined : { fontWeight: "bold", cursor: "pointer" }}
        isReadOnly={readOnly}
        bg={readOnly ? "blackAlpha.200" : "white"}
        size="md"
        // placeholder={!readOnly ? "お買い物の予算" : ""}
        placeholder="合計予算"
        type="number"
        fontSize={{ base: "sm", md: "md" }}
        {...register("estimatedBudget", {
          pattern: {
            value: validationNumber,
            message: "半角整数で入力してください。",
          },
        })}
      />
      <InputRightElement pointerEvents="none" color="gray.300" fontSize={{ base: "xs", md: "md" }}>
        円
      </InputRightElement>
    </InputGroup>
  );
});
