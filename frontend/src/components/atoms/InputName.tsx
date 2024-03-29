import { Input } from "@chakra-ui/react";
import { UserInputParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<UserInputParams>
};

export const InputName: VFC<Props> = memo((props) => {
  const { register } = props;
  return (
    <Input
      placeholder="名前"
      aria-label="名前"
      {...register("name", {
        required: {
          value: true,
          message: "入力が必須の項目です。",
        },
        maxLength: {
          value: 30,
          message: "名前は30文字以内で入力してください。",
        },
      })}
    />
  );
});
