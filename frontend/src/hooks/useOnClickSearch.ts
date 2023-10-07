import { useDisclosure } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

export const useOnClickSearch = () => {
  const { onClose } = useDisclosure();
  const history = useHistory();

  const onClickSearch = () => {
    history.push("/okaimono/okaimono_search");
    onClose();
  };
  return onClickSearch;
};
