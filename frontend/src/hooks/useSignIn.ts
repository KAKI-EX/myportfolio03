import { SignInParams, User } from "interfaces";
import Cookies from "js-cookie";
import { signIn } from "lib/api/auth";
import React, { Dispatch, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useMessage } from "./useToast";

type Params = {
  userEmail: string;
  userPassword: string;
  setIsSignedIn: Dispatch<React.SetStateAction<boolean>>;
  setCurrentUser: Dispatch<React.SetStateAction<User | undefined>>;
  history: ReturnType<typeof useHistory>;
  showMessage: ReturnType<typeof useMessage>["showMessage"];
  setLoading: Dispatch<React.SetStateAction<boolean>>;
};

export const useSignIn = (customParams: Params) => {
  const { userEmail, userPassword, setIsSignedIn, setCurrentUser, setLoading, history, showMessage } = customParams;

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const params: SignInParams = {
      email: userEmail,
      password: userPassword,
    };

    console.log("useSignInが走っています。");
    console.log(params);
    try {
      setLoading(true);
      const res = await signIn(params);
      if (res?.status === 200) {
        const addLoginFlag = { ...res, isLogin: "true" };
        const cookieData = {
          _access_token: res.headers["access-token"],
          _client: res.headers.client,
          _uid: res.headers.uid,
          _user_id: res.data.data.id,
          _isLogin: addLoginFlag.isLogin,
        };
        Object.entries(cookieData).map(([key, value]) => Cookies.set(key, value));

        console.log(document.cookie);
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);
        setLoading(false);
        history.push("/");
        showMessage({ title: "ログインしました", status: "success" });
      } else {
        showMessage({ title: "ログインできませんでした。", status: "" });
        setLoading(false);
      }
    } catch (err) {
      showMessage({ title: "ログインできませんでした。", status: "error" });
      console.log(err);
      setLoading(false);
    }
  };
  return handleSubmit;
};
