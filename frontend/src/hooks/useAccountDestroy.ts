import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import { useContext } from "react";
import { accountDestroy } from "lib/api/auth";
import { AuthContext } from "App";
import { useHistory } from "react-router-dom";

export const useAccountDestroy = (onClose: () => void) => {
  const { showMessage } = useMessage();
  const { setIsSignedIn } = useContext(AuthContext);
  const history = useHistory();

  const accountDelete = async () => {
    onClose();
    try {
      await accountDestroy();
      setIsSignedIn(false);
      showMessage({ title: "アカウントを削除しました", status: "success" });
      history.push("/");
    } catch (err) {
      const axiosError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(axiosError.response);
      showMessage({ title: axiosError.response?.data.message, status: "error" });
    }
  };
  return accountDelete;
};
