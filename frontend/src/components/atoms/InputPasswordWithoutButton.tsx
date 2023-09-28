import { Input } from "@chakra-ui/react";
import { UserInputParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<UserInputParams>;
  placeholder: string;
};

export const InputPasswordWithoutButton: VFC<Props> = memo((props) => {
  const { register, placeholder } = props;
  return (
    <Input
      placeholder={placeholder}
      aria-label="パスワード"
      type="password"
      {...register("password", {
        required: {
          value: true,
          message: "入力が必須の項目です。",
        },
        maxLength: {
          value: 32,
          message: "32文字以上のパスワードは設定できません。",
        },
        minLength: {
          value: 8,
          message: "8文字以上入力してください。",
        },
      })}
    />
  );
});
