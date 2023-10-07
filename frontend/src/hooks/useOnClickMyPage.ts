import { useDisclosure } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

export const useOnClickMyPage = () => {
  const { onClose } = useDisclosure();
  const history = useHistory();

  const onClickMyPage = () => {
    history.push("/user/");
    onClose();
  };
  return onClickMyPage;
};
