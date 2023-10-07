import { useDisclosure } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

export const useOnClickMakeMemo = () => {
  const { onClose } = useDisclosure();
  const history = useHistory();

  const onClickMakeMemo = () => {
    history.push("/okaimono/okaimono_memo");
    onClose();
  };
  return onClickMakeMemo;
};
