import { SignInParams } from "interfaces";
import { useMessage } from "hooks/useToast";
import React, { useContext } from "react";
import { signIn } from "lib/api/auth";
import Cookies from "js-cookie";
import { AuthContext } from "App";
import { useHistory } from "react-router-dom";

export const useAccountSignIn = (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const { showMessage } = useMessage();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const history = useHistory();

  const accountSignIn = async (formData: SignInParams) => {
    try {
      setLoading(true);
      const res = await signIn(formData);
      if (res?.status === 200) {
        const cookieData = {
          _access_token: res.headers["access-token"],
          _client: res.headers.client,
          _uid: res.headers.uid,
        };
        Object.entries(cookieData).map(([key, value]) => Cookies.set(key, value));
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);
        history.push("/okaimono");
        showMessage({ title: res.data.message, status: "success" });
      }
      // エラーハンドリング
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        showMessage({ title: `code:${err.response.status} ${err.response.data.errors}`, status: "error" });
      } else {
        showMessage({ title: "ログインできませんでした。", status: "error" });
      }
      setLoading(false);
    }
  };
  return accountSignIn;
};
