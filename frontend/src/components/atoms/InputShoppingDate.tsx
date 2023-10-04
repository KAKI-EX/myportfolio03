import { Input } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  readOnly?: boolean;
  register: UseFormRegister<MergeParams>;
  w?: string;
};

export const InputShoppingDate: VFC<Props> = memo((props) => {
  const { readOnly = false, register, w } = props;
  return (
    <Input
      _hover={readOnly ? undefined : { fontWeight: "bold", cursor: "pointer" }}
      isReadOnly={readOnly}
      bg={readOnly ? "blackAlpha.200" : "white"}
      size="md"
      type="date"
      w={w}
      fontSize={{ base: "sm", md: "md" }}
      {...register("shoppingDate")}
    />
  );
});
