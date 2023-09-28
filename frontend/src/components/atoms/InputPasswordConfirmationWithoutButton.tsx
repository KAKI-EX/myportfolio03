import { Input } from "@chakra-ui/react";
import { UserInputParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormGetValues, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<UserInputParams>;
  getValues: UseFormGetValues<UserInputParams>;
};

export const InputPasswordConfirmationWithoutButton: VFC<Props> = memo((props) => {
  const { register, getValues } = props;
  return (
    <Input
      placeholder="パスワード再入力"
      aria-label="パスワード再入力"
      type="password"
      {...register("passwordConfirmation", {
        required: {
          value: true,
          message: "入力が必須の項目です。",
        },
        validate: (value) => {
          return value === getValues("password") || "メールアドレスが一致しません";
        },
      })}
    />
  );
});
