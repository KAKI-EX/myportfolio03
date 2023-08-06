import { FormLabel, Input } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  readOnly: boolean;
  register: UseFormRegister<MergeParams>;
  index: number;
  expiryDate?: boolean;
};

export const InputExpiryDateStart: VFC<Props> = memo((props) => {
  const { readOnly, register, index, expiryDate } = props;
  return (
    <>
      <FormLabel mb="3px" fontSize={{ base: "sm", md: "md" }}>
        消費期限 開始日
      </FormLabel>
      <Input
        isReadOnly={readOnly}
        type={expiryDate ? "date" : "hidden"}
        bg={readOnly ? "blackAlpha.200" : "white"}
        fontSize={{ base: "sm", md: "md" }}
        size="md"
        {...register(`listForm.${index}.expiryDateStart`)}
      />
    </>
  );
});
