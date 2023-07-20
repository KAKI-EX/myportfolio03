import { Button } from "@chakra-ui/react";
import React, { memo, ReactNode, VFC } from "react";

type Props = {
  children: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const DeleteButton: VFC<Props> = memo((props) => {
  const {
    children,
    disabled = false,
    loading = false,
    onClick,
  } = props;
  return (
    <Button
      bg="red.400"
      color="white"
      _hover={{ opacity: 0.8 }}
      disabled={disabled || loading}
      isLoading={loading}
      onClick={onClick}
      aria-label={children}
    >
      {children}
    </Button>
  );
});
