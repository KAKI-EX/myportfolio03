import { Input } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  readOnly: boolean;
  register: UseFormRegister<MergeParams>;
  index: number;
  validationNumber: RegExp;
};

export const InputAmount: VFC<Props> = memo((props) => {
  const { readOnly, register, index, validationNumber } = props;
  return (
    <Input
      data-testid="inputAmount"
      isReadOnly={readOnly}
      bg={readOnly ? "blackAlpha.200" : "white"}
      placeholder={!readOnly ? "個数" : ""}
      fontSize={{ base: "sm", md: "md" }}
      size="md"
      w="100%"
      type="number"
      {...register(`listForm.${index}.amount`, {
        max: { value: 99, message: "上限は99までです。" },
        pattern: { value: validationNumber, message: "半角整数で入力してください。" },
      })}
    />
  );
});
