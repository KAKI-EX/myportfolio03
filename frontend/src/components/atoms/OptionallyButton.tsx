import { Button } from "@chakra-ui/react";
import React, { memo, ReactNode, VFC } from "react";

type Props = {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const OptionallyButton: VFC<Props> = memo((props) => {
  console.log("PrimaryButtonが走っています");
  const {
    children,
    disabled = false,
    loading = false,
    onClick,
  } = props;
  return (
    <Button
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
