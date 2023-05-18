import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

type Props = {
  status: "success" | "error" | "warning" | "info";
  title: string;
};

export const useMessage = () => {
  const toast = useToast({});

  const showMessage = useCallback(
    (props: Props) => {
      const { status, title } = props;
      const titleSplit = (String(title).split(","));
      titleSplit.forEach((titles: string) => {
        toast({
          title: titles,
          status,
          position: "bottom",
          duration: 3000,
          isClosable: true,
        });
      });
    },
    [toast]
  );
  return {
    showMessage,
  };
};
