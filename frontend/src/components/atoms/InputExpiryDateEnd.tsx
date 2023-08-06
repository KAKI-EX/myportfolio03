import { FormLabel, Input } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  readOnly: boolean;
  register: UseFormRegister<MergeParams>;
  index: number;
  expiryDate?: boolean;
  startDate?: string;
};

export const InputExpiryDateEnd: VFC<Props> = memo((props) => {
  const { readOnly, register, index, startDate } = props;

  return (
    <>
      <FormLabel mb="3px" fontSize={{ base: "sm", md: "md" }}>
        終了日
      </FormLabel>
      <Input
        isReadOnly={readOnly}
        type="date"
        bg={readOnly ? "blackAlpha.200" : "white"}
        fontSize={{ base: "sm", md: "md" }}
        size="md"
        {...register(`listForm.${index}.expiryDateEnd`, {
          validate: (value) =>
            !startDate ||
            !value ||
            new Date(value) >= new Date(startDate) ||
            "終了日は開始日以降の日付を選択してください。",
        })}
      />
    </>
  );
});
