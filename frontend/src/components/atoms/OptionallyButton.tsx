import { Button } from "@chakra-ui/react";
import React, { memo, VFC } from "react";

type Props = {
  children: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  w?: string;
};

export const OptionallyButton: VFC<Props> = memo((props) => {
  const { children, disabled = false, loading = false, onClick, w } = props;
  return (
    <Button
      w={w}
      bg="blue.400"
      color="white"
      _hover={{ opacity: 0.8 }}
      disabled={disabled || loading}
      isLoading={loading}
      onClick={onClick}
    >
      {children}
    </Button>
  );
});
