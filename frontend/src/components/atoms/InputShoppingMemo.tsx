import { Input } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  readOnly?: boolean;
  register: UseFormRegister<MergeParams>
  w?: string;
};

export const InputShoppingMemo: VFC<Props> = memo((props) => {
  const { readOnly = false, register, w } = props;
  return (
    <Input
      _hover={readOnly ? undefined : { fontWeight: "bold", cursor: "pointer" }}
      isReadOnly={readOnly}
      bg={readOnly ? "blackAlpha.200" : "white"}
      // placeholder={!readOnly ? "一言メモ" : ""}
      placeholder="買い物メモ"
      size="md"
      w={w}
      fontSize={{ base: "sm", md: "md" }}
      {...register("shoppingMemo", {
        maxLength: { value: 150, message: "最大文字数は150文字です。" },
      })}
    />
  );
});
