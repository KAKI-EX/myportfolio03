import { Input } from "@chakra-ui/react";
import { UserInputParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<UserInputParams>;
  placeholder: string;
};

export const InputEmailAddress: VFC<Props> = memo((props) => {
  const { register, placeholder } = props;
  return (
    <Input
      placeholder={placeholder}
      aria-label="Eメールアドレス"
      {...register("email", {
        required: { value: true, message: "入力が必須の項目です。" },
        pattern: {
          value: /[\w\-._]+@[\w\-._]+\.[A-Za-z]+/,
          message: "有効なメールアドレスを入力してください。",
        },
        maxLength: {
          value: 100,
          message: "メールアドレスは100文字以内で入力してください。",
        },
      })}
    />
  );
});
