import { Input } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  readOnly: boolean;
  register: UseFormRegister<MergeParams>;
  index: number;
};

export const InputShoppingDetailMemo: VFC<Props> = memo((props) => {
  const { readOnly, register, index } = props;
  return (
    <Input
      _hover={readOnly ? undefined : { fontWeight: "bold", cursor: "pointer" }}
      isReadOnly={readOnly}
      bg={readOnly ? "blackAlpha.200" : "white"}
      placeholder={!readOnly ? "メモ" : ""}
      fontSize={{ base: "sm", md: "md" }}
      size="md"
      {...register(`listForm.${index}.shoppingDetailMemo`, {
        maxLength: { value: 150, message: "最大文字数は150文字です。" },
      })}
    />
  );
});
