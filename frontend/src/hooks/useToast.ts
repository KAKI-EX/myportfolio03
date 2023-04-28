import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

type Props = {
  status: "success" | "error" | "warning" | "info";
  title: string;
};

export const useMessage = () => {
  const toast = useToast({
    containerStyle: {
      marginTop: "5rem"
    }
  });

  const showMessage = useCallback(
    (props) => {
      const { status, title } = props;
      toast({
        title,
        status,
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    },
    [toast]
  );
  return {
    showMessage,
  };
};
