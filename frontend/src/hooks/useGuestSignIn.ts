import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import { useContext } from "react";
import { guestSignIn } from "lib/api/auth";
import Cookies from "js-cookie";
import { AuthContext } from "App";
import { useHistory } from "react-router-dom";

export const useGuestSignIn = () => {
  const { showMessage } = useMessage();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const history = useHistory();

  const runGuestSignIn = async () => {
    try {
      const gestSignInRes = await guestSignIn();
      if (gestSignInRes?.status === 200) {
        const cookieData = {
          _access_token: gestSignInRes.headers["access-token"],
          _client: gestSignInRes.headers.client,
          _uid: gestSignInRes.headers.uid,
        };
        Object.entries(cookieData).map(([key, value]) => Cookies.set(key, value));
        setIsSignedIn(true);
        setCurrentUser(gestSignInRes?.data.data);
        history.push("/okaimono");
        showMessage({ title: gestSignInRes.data.message, status: "success" });
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(axiosError.response);
      showMessage({ title: "エラーが発生しました。", status: "error" });
    }
  };
  return runGuestSignIn;
};
