import { Button } from "@chakra-ui/react";
import React, { memo, ReactNode, VFC } from "react";

type Props = {
  loading?: boolean;
  children: ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  w?: string;
  type?: "button" | "submit" | "reset" | undefined
};

export const PrimaryButtonForReactHookForm: VFC<Props> = memo((props) => {
  const { loading, children, disabled = false, onClick, w, type = "submit" } = props;
  return (
    <Button
      bg="teal.400"
      color="white"
      _hover={{ opacity: 0.8 }}
      isLoading={loading}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      w={w}
    >
      {children}
    </Button>
  );
});
