import { Input } from "@chakra-ui/react";
import React, { memo, VFC } from "react";
import { ChangeHandler, RefCallBack } from "react-hook-form";

type Props = {
  readOnly: boolean;
  // eslint-disable-next-line
  customOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: RefCallBack;
  rest: {
    onBlur: ChangeHandler;
    name: `listForm.${number}.purchaseName`;
    min?: string | number | undefined;
    max?: string | number | undefined;
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;
    required?: boolean | undefined;
    disabled?: boolean | undefined;
  };
};

export const InputPurchaseName: VFC<Props> = memo((props) => {
  const { readOnly, customOnChange, inputRef, rest } = props;
  return (
    <Input
      _hover={readOnly ? undefined : { fontWeight: "bold", cursor: "pointer" }}
      isReadOnly={readOnly}
      bg={readOnly ? "blackAlpha.200" : "white"}
      autoFocus={false}
      placeholder={!readOnly ? "買う商品のなまえ" : ""}
      fontSize={{ base: "sm", md: "md" }}
      size="md"
      w="100%"
      onChange={(event) => customOnChange(event)}
      ref={inputRef}
      {...rest}
    />
  );
});
