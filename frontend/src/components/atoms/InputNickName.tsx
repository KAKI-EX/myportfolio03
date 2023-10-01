import { Input } from "@chakra-ui/react";
import { UserInputParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<UserInputParams>
};

export const InputNickName: VFC<Props> = memo((props) => {
  const { register } = props;
  return (
    <Input
      placeholder="ニックネーム"
      aria-label="ニックネーム"
      {...register("nickname", {
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
