import { useDisclosure } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

export const useOnClickAlert = () => {
  const { onClose } = useDisclosure();
  const history = useHistory();

  const onClickAlert = () => {
    history.push("/okaimono/okaimono_alert");
    onClose();
  };
  return onClickAlert;
};
