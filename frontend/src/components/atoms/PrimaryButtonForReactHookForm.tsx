import { Button } from "@chakra-ui/react";
import { memo, ReactNode, VFC } from "react";

type Props = {
  loading?: boolean;
  children: ReactNode;
  disabled?: boolean;
};

export const PrimaryButtonForReactHookForm: VFC<Props> = memo((props) => {
  const { loading, children, disabled = false } = props;
  return (
    <Button
      bg="teal.400"
      color="white"
      _hover={{ opacity: 0.8 }}
      isLoading={loading}
      type="submit"
      disabled={disabled || loading}
    >
      {children}
    </Button>
  );
});
