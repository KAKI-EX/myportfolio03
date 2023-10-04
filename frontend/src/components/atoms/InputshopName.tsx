/* eslint-disable react/require-default-props */
import { Input } from "@chakra-ui/react";
import React from "react";
import { ChangeHandler } from "react-hook-form";

type Props = {
  readOnly?: boolean;
  // eslint-disable-next-line no-unused-vars
  customOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  w?: string;
  // ref?: RefCallBack; // 名称を変更
  rest?: {
    onBlur?: ChangeHandler;
    name?: string;
    min?: string | number;
    max?: string | number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    required?: boolean;
    disabled?: boolean;
  };
};

export const InputShopName = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { readOnly = false, customOnChange, w, rest } = props; // innerRef を追加
  return (
    <Input
      _hover={readOnly ? undefined : { fontWeight: "bold", cursor: "pointer" }}
      onChange={customOnChange}
      isReadOnly={readOnly}
      bg={readOnly ? "blackAlpha.200" : "white"}
      placeholder="店舗名"
      size="md"
      w={w}
      fontSize={{ base: "sm", md: "md" }}
      ref={ref}
      onBlur={rest?.onBlur}
      name={rest?.name}
      min={rest?.min}
      max={rest?.max}
      maxLength={rest?.maxLength}
      minLength={rest?.minLength}
      pattern={rest?.pattern}
      required={rest?.required}
      disabled={rest?.disabled}
    />
  );
});
