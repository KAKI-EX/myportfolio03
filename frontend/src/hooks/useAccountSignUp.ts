import { UserInputParams } from "interfaces";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React, { useContext } from "react";
import { signUp } from "lib/api/auth";
import Cookies from "js-cookie";
import { AuthContext } from "App";
import { useHistory } from "react-router-dom";

export const useAccountSignUp = (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const { showMessage } = useMessage();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);
  const history = useHistory();

  const signUpAccount = async (formData: UserInputParams) => {
    const { name, email, password, passwordConfirmation, nickname } = formData;
    const params: UserInputParams = {
      name,
      email,
      password,
      passwordConfirmation,
      nickname
    };

    try {
      setLoading(true);
      const res = await signUp(params);
      const cookieData = {
        _access_token: res.headers["access-token"],
        _client: res.headers.client,
        _uid: res.headers.uid,
      };
      Object.entries(cookieData).map(([key, value]) => Cookies.set(key, value));
      setIsSignedIn(true);
      setCurrentUser(res?.data.data);
      history.push("/");
      const signUpMessage = `${res.data.message} ,ログインしました。`;
      showMessage({ title: signUpMessage, status: "success" });
    } catch (err) {
      setLoading(false);
      const axiosError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(axiosError.response);
      showMessage({ title: axiosError.response?.data.errors.fullMessages, status: "error" });
    }
  };
  return signUpAccount;
};
