import { SignUpParams } from "interfaces";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React, { useContext } from "react";
import { accountUpdate } from "lib/api/auth";
import Cookies from "js-cookie";
import { AuthContext } from "App";
import { useHistory } from "react-router-dom";

export const useAccountUpdate = (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const { showMessage } = useMessage();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const history = useHistory();

  const updateAccount = async (data: SignUpParams) => {
    try {
      setLoading(true);
      const res = await accountUpdate(data);
      const cookieData = {
        _access_token: res.headers["access-token"],
        _client: res.headers.client,
        _uid: res.headers.uid,
      };
      Object.entries(cookieData).map(([key, value]) => Cookies.set(key, value));
      setIsSignedIn(true);
      setCurrentUser(res?.data.data);
      showMessage({ title: "アカウント情報を修正しました", status: "success" });
      setLoading(false);
      history.push("/");
    } catch (err) {
      setLoading(false);
      const axiosError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(axiosError.response);
      showMessage({ title: "エラーが発生しました。", status: "error" });
    }
  };
  return updateAccount;
};
