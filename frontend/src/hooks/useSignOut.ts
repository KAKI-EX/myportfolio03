import Cookies from "js-cookie";
import React, { useCallback, useContext } from "react";
import { signOut } from "lib/api/auth";
import { AuthContext } from "App";
import { useHistory } from "react-router-dom";
import { useMessage } from "./useToast";

type Props = {
  // eslint-disable-next-line no-unused-vars
  setLoading: (value: React.SetStateAction<boolean>) => void;
};

export const useSignOut = (props: Props) => {
  const { showMessage } = useMessage();
  const { setLoading } = props;
  const history = useHistory();
  const { setIsSignedIn } = useContext(AuthContext);

  const executionSignOut = useCallback(async () => {
    setLoading(true);
    try {
      const res = await signOut();
      if (res.data.success === true) {
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");
        Cookies.remove("_isLogin");
      }
      history.push("/");
      setIsSignedIn(false);

      showMessage({ title: "サインアウトしました。", status: "success" });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        showMessage({
          title: err.response.data.errors,
          status: "error",
        });
      } else {
        showMessage({ title: "サインアウトできませんでした。", status: "error" });
      }
    }
    setLoading(false);
  }, [setLoading, showMessage]);
  return { executionSignOut };
};
