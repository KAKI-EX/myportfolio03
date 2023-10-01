import { Button } from "@chakra-ui/react";
import React, { memo, ReactNode, VFC } from "react";

type Props = {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  w?: string;
  fontSize?: string | number | (string | number)[];
};

export const PrimaryButton: VFC<Props> = memo((props) => {
  const {
    children,
    disabled = false,
    loading = false,
    onClick,
    w,
    fontSize
  } = props;
  return (
    <Button
      bg="teal.400"
      color="white"
      _hover={{ opacity: 0.8 }}
      disabled={disabled || loading}
      isLoading={loading}
      onClick={onClick}
      w={w}
      fontSize={fontSize}
    >
      {children}
    </Button>
  );
});
