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

export const InputPrice: VFC<Props> = memo((props) => {
  const { readOnly, register, index, validationNumber } = props;
  return (
    <Input
      _hover={readOnly ? undefined : { fontWeight: "bold", cursor: "pointer" }}
      isReadOnly={readOnly}
      bg={readOnly ? "blackAlpha.200" : "white"}
      placeholder="予想価格"
      // placeholder={!readOnly ? "いくら？" : ""}
      type="number"
      fontSize={{ base: "sm", md: "md" }}
      {...register(`listForm.${index}.price`, {
        pattern: { value: validationNumber, message: "半角整数で入力してください。" },
      })}
    />
  );
});
