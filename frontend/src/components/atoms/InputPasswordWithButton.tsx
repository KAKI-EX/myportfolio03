import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { UserInputParams } from "interfaces";
import { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  show: boolean;
  register: UseFormRegister<UserInputParams>;
  handleClick: () => void;
};

export const InputPasswordWithButton: VFC<Props> = memo((props) => {
  const { show, register, handleClick } = props;
  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="パスワード"
        aria-label="パスワード"
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
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" bg="teal.400" color="white" onClick={handleClick}>
          {show ? "非表示" : "表示"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
});
